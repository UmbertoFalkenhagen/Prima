namespace EndlessMatrixRunner {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;
  export let configurations: any;

  let cameraNode: ƒ.Node;

  export let playerNode: ƒ.Node;
  export let groundNode: ƒ.Node;
  export let deltaTime: number;

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

    configurations = await fetchData();

    viewport.calculateTransforms();

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    playerNode = sceneGraph.getChildrenByName("Player")[0];
    playerNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
    

    // groundNode = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0];
    // groundNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;

    

    //cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    //cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
    
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);
    cameraNode.addComponent(new CameraScript);
    sceneGraph.addChild(cameraNode);

    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    //make sure all terrain objects have a proper collisiongroup assigned
    let platformNode: ƒ.Node[] = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
    platformNode.forEach(platform => {
      platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2; //all ground objects are collision group 2
      platform.getChildrenByName("EdgeObstacle").forEach(edgeobstacle => {
        edgeobstacle.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_3; //all obstacles are collision group 3
        //console.log("EdgeObstacle received collision group");
      });
    }); //all items should have collision group 4 and all npcs have collision group 5

    deltaTime = ƒ.Loop.timeFrameReal / 1000;

    if (GameState.get().gameRunning) {
      //controllGround();
      GameState.get().highscore += 1 * deltaTime;
      //console.log(Math.floor(GameState.get().highscore));
      //setUpCamera();

      
    } else if (!GameState.get().gameRunning) {
      startGame();
    }
    ƒ.Physics.world.simulate(); // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function startGame(): Promise<void> {
    console.log(sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length);
    if (sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length == 0) {
      console.log("#1");
      let ground: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
      let newGroundNode: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(ground);
      newGroundNode.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
      newGroundNode.name = "Ground";
      sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
      console.log("Created first ground segment");
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
      GameState.get().highscore = 0;
    }

    
      
      
  }

  async function fetchData() {
    try {
      const response = await fetch("../configuration.JSON");
      const responseObj = await response.json();
      return responseObj;
    } catch(error) {
      return error;
    }
  }

  function setUpCamera(): void {
    cameraNode.mtxLocal.mutate({
      translation: playerNode.mtxWorld.translation
    });
  }
}