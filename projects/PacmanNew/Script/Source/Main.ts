namespace PacmanNew {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  export let playerAgent: ƒ.Node;
  let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");

  let ctrlY: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlY.setDelay(50);
  let ctrlX: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlX.setDelay(50);
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
    let playerposition: ƒ.Vector3 = playerAgent.mtxLocal.translation;
    let playerradius: number = playerAgent.getComponent(ƒ.ComponentMesh).radius;
    let gridwidth: number = sceneGraph.getChildrenByName("Grid")[0].getChildrenByName("GridRow(1)")[0].getChildren().length * 1.1;
    let gridheight: number = sceneGraph.getChildrenByName("Grid")[0].getChildren().length * 1.1;

    let inputYvalue: number = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) 
    + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));

    if (inputYvalue < 0) {
      if (!((playerposition.y - playerradius) < 0)) {
        ctrlY.setInput(inputYvalue);
        playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
        } else {
          console.log("collision bottom");
        }
    } else if (inputYvalue > 0) {
      if (!((playerposition.y + playerradius) >  gridheight)) {
        ctrlY.setInput(inputYvalue);
        playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
      } else {
        console.log("collision top");
      }
    }

    let inputXvalue: number = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    + (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));

    if (inputXvalue < 0) {
      if (!((playerposition.x - playerradius) < 0)) {
        ctrlX.setInput(inputXvalue);
        playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
        } else {
          console.log("collision left");
        }
    } else if (inputXvalue > 0) {
      if (!((playerposition.x + playerradius) >  gridwidth)) {
        ctrlX.setInput(inputXvalue);
        playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
      } else {
        console.log("collision right");
      }
    }

    
    //bordercollisionscanner();
    
  }
}