namespace MarioKart {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  let kart: ƒ.Node;
  let cameraNode: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(50);

  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

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

    kart = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-22T11:02:19.072Z|64411"];
    //kart.mtxLocal.translateX(5);
    sceneGraph.appendChild(kart);
    let kartTransform: ƒ.ComponentTransform = kart.getComponent(ƒ.ComponentTransform);
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
    //kart.addComponent(cmpCamera);
    
    // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateZ(-20);
    // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(10);
    // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(360);
    // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateX(20);
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    kart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    kart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(kart.mtxLocal.translation, mtxTerrain);
    kart.mtxLocal.translation = terrainInfo.position;
    kart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal); 

    placeCameraOnCart();
    
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function placeCameraOnCart(): void {
    cameraNode.mtxLocal.mutate({
      translation: kart.mtxWorld.translation,
      rotation: new ƒ.Vector3(0, kart.mtxWorld.rotation.y, 0)
    });
  }
}