namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;
  export let playerNode: Agent;
  // tslint:disable-next-line: no-any
  export let configurations: any;
  export let deltaTime: number;

  let platformSpawner: PlatformSpawner;



  let cameraNode: ƒ.Node;

  //sounds
  let jumpSound: ƒ.ComponentAudio;
  let dropSound: ƒ.ComponentAudio;
  let deathSound: ƒ.ComponentAudio;
  let coinSound: ƒ.ComponentAudio;
  let enemySound: ƒ.ComponentAudio;

  let scoreCounter: HTMLInputElement;
  let coinCounter: HTMLElement;

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

      let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();

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

      let floorelement: FloorElement = new FloorElement(new ƒ.Vector3(0, 0, 0));
      console.log(floorelement);

      //let obstacleplatform: ObstaclePlatform = new ObstaclePlatform(new ƒ.Vector3(20, 2, 0));
      //console.log(obstacleplatform);
      //sceneGraph.addChild(obstacleplatform);

      platformSpawner = new PlatformSpawner(40);
      console.log(platformSpawner);


      jumpSound = sceneGraph.getComponents(ƒ.ComponentAudio)[1];
      dropSound = sceneGraph.getComponents(ƒ.ComponentAudio)[2];
      deathSound = sceneGraph.getComponents(ƒ.ComponentAudio)[3];
      coinSound = sceneGraph.getComponents(ƒ.ComponentAudio)[4];
      enemySound = sceneGraph.getComponents(ƒ.ComponentAudio)[5];


      sceneGraph.addEventListener("jumpEvent", hndJumpEvent);
      sceneGraph.addEventListener("dropEvent", hndDropEvent);
      sceneGraph.addEventListener("deathEvent", hndDeathEvent);
      sceneGraph.addEventListener("coinEvent", hndCoinEvent);
      sceneGraph.addEventListener("enemyEvent", hndEnemyEvent);
      //soundManager.addEventListener("jumpEvent", hndJumpEvent, true);


      ƒ.AudioManager.default.listenTo(sceneGraph);
      ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

      viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

      ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }

    function update(_event: Event): void {
      ƒ.Physics.simulate();  // if physics is included and used
      deltaTime = ƒ.Loop.timeFrameReal / 1000;

      if (GameState.get().gameRunning) {
        GameState.get().highscore += 1 * deltaTime;
        GameState.get().score.textContent = "Score: " + Math.floor(GameState.get().highscore);
        GameState.get().coins.textContent = "Coins: " + GameState.get().coinscounter;

      } else if (!GameState.get().gameRunning) {
        sceneGraph.getComponent(ƒ.ComponentAudio).play(false);
        startGame();
      }

      viewport.draw();
      ƒ.AudioManager.default.update();
    }

    async function startGame(): Promise<void> {
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
        GameState.get().gameRunning = true;
        GameState.get().highscore = 0;
        GameState.get().coinscounter = 0;
        sceneGraph.getComponent(ƒ.ComponentAudio).play(true);
        sceneGraph.getComponent(ƒ.ComponentAudio).volume = configurations.backgroundvolume;

        jumpSound.volume = configurations.effectvolume;
        dropSound.volume = configurations.effectvolume;
        deathSound.volume = configurations.effectvolume;
        coinSound.volume = configurations.effectvolume;
        enemySound.volume = configurations.effectvolume;
      }




    }

    // tslint:disable-next-line: typedef
    async function fetchData() {
      try {
        // tslint:disable-next-line: typedef
        const response = await fetch("configuration.json");
        // tslint:disable-next-line: typedef
        const responseObj = await response.json();
        return responseObj;
      } catch (error) {
        return error;
      }
    }

    function hndJumpEvent(): void {
      jumpSound.play(true);
    }

    function hndDropEvent(): void {
      dropSound.play(true);
    }

    function hndDeathEvent(): void {
      deathSound.play(true);
    }

    function hndEnemyEvent(): void {
      console.log("Gegner greift an!");
      enemySound.play(true);
    }

    function hndCoinEvent(): void {
      coinSound.play(true);
      GameState.get().coinscounter += 1;
      GameState.get().highscore += 10;
    }
  }
}
