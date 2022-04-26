namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;
  let speedRotY: number = -0.2;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let cntStrafe: ƒ.Control = new ƒ.Control("cntStrafe", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let exhaustion: number = 0;
  let canSprint: boolean = true;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    avatar = viewport.getBranch().getChildrenByName("PlayerAgent")[0];
    console.log(avatar);

    viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
    console.log(viewport.camera);

    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    controlWalk();
    controlSpeed();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controlWalk(): void {
    let input: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    cntWalk.setInput(input);

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    cntStrafe.setInput(strafe);

    console.log(canSprint);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
      cntWalk.setFactor(20);
      cntStrafe.setFactor(20);
      cntWalk.setDelay(500);
      cntStrafe.setDelay(500);
    } else {
      cntWalk.setFactor(8);
      cntStrafe.setFactor(8);
      cntWalk.setDelay(200);
      cntStrafe.setDelay(200);
    }

    if (input == 0 && strafe == 0) {
      cntWalk.setDelay(200);
      cntStrafe.setDelay(200);
    }

    avatar.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    avatar.mtxLocal.translateX(cntStrafe.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    /* cntWalk.setInput(strafe); 
    avatar.mtxLocal.translateX(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000); */
  }

  function hndPointerMove(_event: PointerEvent): void {
    avatar.mtxLocal.rotateY(_event.movementX * speedRotY);
    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function controlSpeed(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
      exhaustion += ƒ.Loop.timeFrameGame / 1000;
      if (exhaustion > 10) {
        canSprint = false;

        setTimeout(
          function (): void {
            canSprint = true;
            exhaustion = 0;
          },
          7000);
      }
    }
  }
}