namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;
  export let playerNode: Agent;

  // tslint:disable-next-line: no-any
  export let configurations: any;
  export let deltaTime: number;

  let cameraNode: ƒ.Node;

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

    async function start(): Promise<void> {
      await ƒ.Project.loadResourcesFromHTML();
      sceneGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-05-05T11:28:13.576Z|03522"];
      
      let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();

      configurations = await fetchData();

      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      viewport = new ƒ.Viewport();
      viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
      sceneGraph = viewport.getBranch();

      // let playerprefab: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-05-05T12:50:15.258Z|71678"];
      // let prefabinstance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(playerprefab);
      // sceneGraph.addChild(prefabinstance);

      playerNode = new Agent(new ƒ.Vector3(0, 0, 0));
      sceneGraph.addChild(playerNode);

      cameraNode = new ƒ.Node("cameraNode");
      cameraNode.addComponent(cmpCamera);
      cameraNode.addComponent(new ƒ.ComponentTransform);
      cameraNode.addComponent(new CameraScript);
      sceneGraph.addChild(cameraNode);

      let floorelement: FloorElement = new FloorElement(new ƒ.Vector3(20, 1, 2));
      sceneGraph.addChild(floorelement);

      //let obstacleplatform: ObstaclePlatform = new ObstaclePlatform();
      //sceneGraph.addChild(obstacleplatform);
    
      viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    
      ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

    function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    deltaTime = ƒ.Loop.timeFrameReal / 1000;

    // //make sure all terrain objects have a proper collisiongroup assigned
    // let platformNodes: ƒ.Node[] = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildrenByName("ObstaclePlatform");
    // platformNodes.forEach(platform => {
    //   platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2; //all ground objects are collision group 2
    //   platform.getChildrenByName("Obstacle").forEach(edgeobstacle => {
    //     edgeobstacle.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_3; //all obstacles are collision group 3
    //     //console.log("EdgeObstacle received collision group");
    //   });
    // }); //all items should have collision group 4 and all npcs have collision group 5

    if (GameState.get().gameRunning) {
      //controllGround();
      GameState.get().highscore += 1 * deltaTime;
      //console.log(Math.floor(GameState.get().highscore));

      
    } else if (!GameState.get().gameRunning) {
      startGame();
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

    async function startGame(): Promise<void> {
    // console.log(sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length);
    // if (sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length == 0) {
    //   console.log("#1");
    //   let ground: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
    //   let newGroundNode: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(ground);
    //   newGroundNode.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
    //   newGroundNode.name = "Ground";
    //   sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
    //   console.log("Created first ground segment");
    // }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
      GameState.get().gameRunning = true;
      GameState.get().highscore = 0;
    }

    
      
      
  }

    // tslint:disable-next-line: typedef
    async function fetchData() {
    try {
      // tslint:disable-next-line: typedef
      const response = await fetch("../configuration.JSON");
      // tslint:disable-next-line: typedef
      const responseObj = await response.json();
      return responseObj;
    } catch (error) {
      return error;
    }
  }

  
  }
}