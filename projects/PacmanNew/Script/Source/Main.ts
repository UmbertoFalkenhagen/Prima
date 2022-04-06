namespace PacmanNew {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  export let playerAgent: ƒ.Node;
  let grid: ƒ.Node;
  let cameraNode: ƒ.Node = new ƒ.Node("cameraNode");
  let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();
  let cameraPosParameter: number = 1;

  let direction: ƒ.Vector2 = ƒ.Vector2.ZERO();
  let speed: number = 0.05;

  let ctrlY: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlY.setDelay(50);
  let ctrlX: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrlX.setDelay(50);
  //let agentMoveSpeedFactor: number = 5;
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
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);

    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.translateZ(-20);

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
    grid = sceneGraph.getChildrenByName("Grid")[0];

    document.addEventListener("keydown", hndKeyDown);     //document keyboard event listener

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    
    deltaTime = ƒ.Loop.timeFrameReal / 1000;
    ƒ.AudioManager.default.update();

    //movementcontrol
    // let playerposition: ƒ.Vector3 = playerAgent.mtxLocal.translation;
    // let playerradius: number = playerAgent.getComponent(ƒ.ComponentMesh).radius;
    // let gridwidth: number = sceneGraph.getChildrenByName("Grid")[0].getChildrenByName("GridRow(1)")[0].getChildren().length * 1.1;
    // let gridheight: number = sceneGraph.getChildrenByName("Grid")[0].getChildren().length * 1.1;

    let sounds: ƒ.ComponentAudio[] = sceneGraph.getChildrenByName("AudioListener")[0].getComponents(ƒ.ComponentAudio); //array with audios

    // let inputYvalue: number = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) 
    // + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));

    // if (inputYvalue < 0) {
    //   if (!((playerposition.y - playerradius) < 0)) {
    //     ctrlY.setInput(inputYvalue);
    //     playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
    //     } else {
    //       console.log("collision bottom");
    //       if (!sounds[1].isPlaying) {
    //         sounds[1].play(true);
    //       }
    //     }
    // } else if (inputYvalue > 0) {
    //   if (!((playerposition.y + playerradius) >  gridheight)) {
    //     ctrlY.setInput(inputYvalue);
    //     playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
    //   } else {
    //     console.log("collision top");
    //     if (!sounds[1].isPlaying) {
    //       sounds[1].play(true);
    //     }
    //   }
    // }

    // let inputXvalue: number = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    // + (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));

    // if (inputXvalue < 0) {
    //   if (!((playerposition.x - playerradius) < 0)) {
    //     ctrlX.setInput(inputXvalue);
    //     playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
    //     } else {
    //       console.log("collision left");
    //       if (!sounds[1].isPlaying) {
    //         sounds[1].play(true);
    //       }
    //     }
    // } else if (inputXvalue > 0) {
    //   if (!((playerposition.x + playerradius) >  gridwidth)) {
    //     ctrlX.setInput(inputXvalue);
    //     playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
    //   } else {
    //     console.log("collision right");
    //     if (!sounds[1].isPlaying) {
    //       sounds[1].play(true);
    //     }
    //   }
    // }

    let posPacman: ƒ.Vector3 = playerAgent.mtxLocal.translation;
    let nearestGridPoint: ƒ.Vector2 = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
    let nearGridPoint: boolean = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);

    if (nearGridPoint) {
      let directionOld: ƒ.Vector2 = direction.clone;
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
        direction.set(1, 0);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
        direction.set(-1, 0);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
        direction.set(0, 1);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
        direction.set(0, -1);


      if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
        if (direction.equals(directionOld)) {// did not turn
          direction.set(0, 0); // full stop
          if (!sounds[1].isPlaying) {
            sounds[1].play(true);
          }
        } else {
          if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) { // wrong turn and dead end
            direction.set(0, 0); // full stop
            if (!sounds[1].isPlaying) {
              sounds[1].play(true);
            }
          } else
            direction = directionOld; // don't turn but continue ahead
        }

      if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
        playerAgent.mtxLocal.translation = nearestGridPoint.toVector3();

      // if (direction.equals(ƒ.Vector2.ZERO()))
      //   waka.play(false);
      // else if (!waka.isPlaying)
      //   waka.play(true);

    }

    playerAgent.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed).toVector3());
    viewport.draw();
    

    switchCamMode(cameraPosParameter);
  }

  function switchCamMode(camSetting: number): void {
    //let cmpCamera: ƒ.ComponentCamera  = cameraNode.getComponent(ƒ.ComponentCamera);
    switch (camSetting) {
      case 0:
        cameraNode.mtxLocal.mutate({
          translation: new ƒ.Vector3(playerAgent.mtxWorld.translation.x, playerAgent.mtxWorld.translation.y, -10)
        });
        break;
      case 1:
        cameraNode.mtxLocal.mutate({
          translation: new ƒ.Vector3(2, 2, -10)
        });
        break;
      default:
        console.log("Invalid camera position parameter");
        break;
      
    }
  }


  function hndKeyDown(_e: KeyboardEvent): void {
    if (_e.key == " " ||
        _e.code == "Space"   
    ) {
      if (cameraPosParameter == 0) {
        cameraPosParameter = 1;
      } else {
        cameraPosParameter = 0;
      }
    }
  }

  function blocked(_posCheck: ƒ.Vector2): boolean {
    let check: ƒ.Node = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
    return (!check || check.name == "Wall");
  }
}