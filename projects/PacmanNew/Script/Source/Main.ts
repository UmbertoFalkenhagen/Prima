namespace PacmanNew {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  export let playerAgent: ƒ.Node;
  let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");

  let ctrlForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlForward.setDelay(50);
  let ctrlRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlRotation.setDelay(50);
  let agentMoveSpeedFactor: number = 5;
  let deltaTime: number;

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
    sceneGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-03-25T15:44:46.847Z|42436"];
    
    // setup Camera
    let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();
    
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);

    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.translateZ(-10);

    sceneGraph.addChild(cameraNode);

    //create new viewport with the camera node as main camera
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
    sceneGraph = viewport.getBranch();

    viewport.calculateTransforms();

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    playerAgent = sceneGraph.getChildrenByName("PlayerAgent")[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    deltaTime = ƒ.Loop.timeFrameReal / 1000;
    ƒ.AudioManager.default.update();

    //movementcontrol
    let inputmovementvalue: number = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) 
    + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));

    ctrlForward.setInput(inputmovementvalue);
    playerAgent.mtxLocal.translateY(ctrlForward.getOutput() * deltaTime * agentMoveSpeedFactor);
    cameraNode.mtxLocal.translation.x = playerAgent.mtxLocal.translation.x;

    let inputrotationvalue: number = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));

    ctrlRotation.setInput(inputrotationvalue);
    playerAgent.mtxLocal.rotateZ(ctrlRotation.getOutput() * deltaTime * 360);

    bordercollisionscanner();
    
  }

  function bordercollisionscanner(): void { //checks if the pacman collides with battlefieldborders
    let playerposition: ƒ.Vector3 = playerAgent.mtxLocal.translation;
    let playerradius: number = playerAgent.getComponent(ƒ.ComponentMesh).radius;
    let gridwidth: number = sceneGraph.getChildrenByName("Grid")[0].getChildrenByName("GridRow(1)")[0].getChildren().length * 1.1;
    let gridheight: number = sceneGraph.getChildrenByName("Grid")[0].getChildren().length * 1.1;

    //console.log ("width/height: " + gridwidth + ", " + gridheight);
    //console.log("Player position: " + playerposition);
    //console.log("Player radius: " + playerradius);

    if ((playerposition.x - playerradius) < 0 || (playerposition.y - playerradius < 0) || (playerposition.x + playerradius) >  gridwidth || (playerposition.y + playerradius) > gridheight) {
      playerAgent.mtxLocal.translation.set(0.5, 0.5, 0);
      console.log("collision");
    }

  }
}