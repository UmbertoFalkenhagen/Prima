namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;
  export let playerNode: ƒ.Node;

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

      let playerprefab: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-05-05T12:50:15.258Z|71678"];
      let prefabinstance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(playerprefab);
      sceneGraph.addChild(prefabinstance);

      playerNode = sceneGraph.getChildrenByName("PlayerBody")[0];
      

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
    ƒ.Physics.simulate();  // if physics is included and used
    deltaTime = ƒ.Loop.timeFrameReal / 1000;

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

    async function fetchData() {
    try {
      const response = await fetch("../configuration.JSON");
      const responseObj = await response.json();
      return responseObj;
    } catch(error) {
      return error;
    }
  }

  
  }
}