namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;

  let speedRotY: number = 0.2;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    avatar = viewport.getBranch().getChildrenByName("PlayerAgent")[0];
    viewport.camera = avatar.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    
    cmpCamera = avatar.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndPointerMove(_event: PointerEvent): void {
    avatar.mtxLocal.rotateY(_event.movementX * speedRotY);
    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }
}