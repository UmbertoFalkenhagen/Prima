namespace MarioKart {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  let cart: ƒ.Node;
  let cameraNode: ƒ.Node;
  let body: ƒ.ComponentRigidbody;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 7000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);

  let isGrounded: boolean = false;
  let dampTranslation: number;
  let dampRotation: number;

  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

  let frictionMap: ƒ.TextureImage;

  window.addEventListener("load", init);

  function init(_event: Event): void {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", (_event: Event) => {
        // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
        dialog.close();
        start();
      });
    //@ts-ignore
    dialog.showModal();
}

  async function start(): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();
    sceneGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T14:33:59.117Z|18376"];
    frictionMap = <ƒ.TextureImage>ƒ.Project.resources["TextureImage|2021-12-13T10:35:51.198Z|25477"];
    // setup Camera
    let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();

    

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
    sceneGraph = viewport.getBranch();

    viewport.calculateTransforms();

    let cmpMeshTerrain: ƒ.ComponentMesh = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;
    //console.log(sceneGraph);

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    cart = sceneGraph.getChildrenByName("Agent")[0];
    let kartTransform: ƒ.ComponentTransform = cart.getComponent(ƒ.ComponentTransform);
    kartTransform.mtxLocal.translateX(35);
    kartTransform.mtxLocal.translateY(5);
    kartTransform.mtxLocal.translateZ(45);
    kartTransform.mtxLocal.rotateY(-90);

    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
    
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);
    sceneGraph.addChild(cameraNode);

    body = cart.getComponent(ƒ.ComponentRigidbody);

    dampTranslation = body.dampTranslation;
    dampRotation = body.dampRotation;

    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
  }

  function update(_event: Event): void {
    
    //let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let maxHeight: number = 0.3;
    let minHeight: number = 0.2;
    let forceNodes: ƒ.Node[] = cart.getChildren();
    let force: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -body.mass / forceNodes.length);

    isGrounded = false;
    for (let forceNode of forceNodes) {
      let posForce: ƒ.Vector3 = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      checkFrictionOnCurrentPosition(terrainInfo.position.x, terrainInfo.position.z);
      let height: number = posForce.y - terrainInfo.position.y;
      if (height < maxHeight) {
        body.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
        isGrounded = true;
      }
    }

    if (isGrounded) {
      body.dampTranslation = dampTranslation;
      body.dampRotation = dampRotation;
      let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      cart.getComponent(ƒ.ComponentRigidbody).applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));

      let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
      ctrForward.setInput(forward);
      cart.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));
    } else
    body.dampRotation = body.dampTranslation = 0;
    

    placeCameraOnCart();
    
    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function placeCameraOnCart(): void {
    cameraNode.mtxLocal.mutate({
      translation: cart.mtxWorld.translation,
      rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0)
    });
  }

  function checkFrictionOnCurrentPosition(_x: number, _z: number): void {
    //let greyscaleValue: number;
    // let x: number = frictionMap.image.width / 2;
    // let z: number = frictionMap.image.height / 2;
    // var canvas = document.createElement("canvas");
    // var context = canvas.getContext("2d");
    // var bufferWidth = frictionMap.image.width;
    // var bufferHeight = frictionMap.image.height;
    // canvas.width = bufferWidth;
    // canvas.height = bufferHeight;

    // context.drawImage(frictionMap.image, 0, 0);
    
    // var buffer = context.getImageData(x + _x, z + _z, bufferWidth, bufferHeight).data;

    // console.log(buffer.toString());
  }

}