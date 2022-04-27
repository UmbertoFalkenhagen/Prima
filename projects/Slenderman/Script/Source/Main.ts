namespace Slenderman {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let sceneGraph: ƒ.Node;
  let avatar: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;
  let speedRotY: number = -0.2;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let ctrlWalk: ƒ.Control = new ƒ.Control("ctrlWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let ctrlStrafe: ƒ.Control = new ƒ.Control("ctrlStrafe", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let exhaustion: number = 0;
  let canSprint: boolean = true;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    sceneGraph = viewport.getBranch();
    avatar = viewport.getBranch().getChildrenByName("PlayerAgent")[0];
    console.log(avatar);

    viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
    console.log(viewport.camera);

    //instantiate new tree from prefab
    let treegraph: ƒ.Graph = <ƒ.Graph> ƒ.Project.resources["Graph|2022-04-26T14:32:47.257Z|97095"];
    let treenode = new ƒ.Node("TreeNode");
    treenode.addComponent(new ƒ.ComponentTransform);
    treenode.addChild(treegraph.getChildrenByName("Crown")[0]);
    treenode.addChild(treegraph.getChildrenByName("Stem")[0]);
    sceneGraph.addChild(treenode);

    //add treecomponent and place/scale tree
    let treecomponent: TreeComponent = new TreeComponent;
    treenode.addComponent(treecomponent);
    let treepos: ƒ.Vector3 = new ƒ.Vector3(40, 0, 10);
    let treescale: ƒ.Vector3 = new ƒ.Vector3(5, 10, 10);
    treecomponent.placeTree(treepos, treescale);

    console.log(treenode);

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
    ctrlWalk.setInput(input);

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrlStrafe.setInput(strafe);

    console.log(canSprint);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
      ctrlWalk.setFactor(20);
      ctrlStrafe.setFactor(20);
      ctrlWalk.setDelay(500);
      ctrlStrafe.setDelay(500);
    } else {
      ctrlWalk.setFactor(8);
      ctrlStrafe.setFactor(8);
      ctrlWalk.setDelay(200);
      ctrlStrafe.setDelay(200);
    }

    if (input == 0 && strafe == 0) {
      ctrlWalk.setDelay(200);
      ctrlStrafe.setDelay(200);
    }

    avatar.mtxLocal.translateZ(ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    avatar.mtxLocal.translateX(ctrlStrafe.getOutput() * ƒ.Loop.timeFrameGame / 1000);
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