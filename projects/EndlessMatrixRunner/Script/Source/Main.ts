namespace EndlessMatrixRunner {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;

  let cameraNode: ƒ.Node;

  export let playerNode: ƒ.Node;
  export let groundNode: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);

  ƒ.Debug.info("Main Program Template running!");

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
    sceneGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-12-21T17:37:49.295Z|21356"];

    let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
    sceneGraph = viewport.getBranch();

    viewport.calculateTransforms();

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    playerNode = sceneGraph.getChildrenByName("Player")[0];
    playerNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
    

    groundNode = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0];
    groundNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;

    let platformNode: ƒ.Node[] = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
    platformNode.forEach(platform => {
      platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
    });

    //cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    //cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
    
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);
    cameraNode.addComponent(new CameraScript);
    sceneGraph.addChild(cameraNode);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    let forward: number = 1;
    ctrForward.setInput(forward);

    let movementVector: ƒ.Vector3 = ƒ.Vector3.ZERO();
    movementVector.x = ctrForward.getOutput();
    playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(movementVector);

    controllGround();
    //setUpCamera();

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controllGround(): void {
    
  }

  function setUpCamera(): void {
    cameraNode.mtxLocal.mutate({
      translation: playerNode.mtxWorld.translation
    });
  }
}