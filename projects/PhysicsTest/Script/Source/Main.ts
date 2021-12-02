namespace PhysicsTest {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let sceneGraph: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(50);

  let ground: ƒ.Node;
  let cart: ƒ.Node;
  let cameraNode: ƒ.Node;

  let cartWheels: ƒ.Node[];
  //let cmpRigidbodyCart: ƒ.ComponentRigidbody;

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
    sceneGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-30T11:23:11.948Z|51069"];

    let cmpCamera: ƒ.ComponentCamera  = new ƒ.ComponentCamera();

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
    sceneGraph = viewport.getBranch();

    ƒ.Physics.adjustTransforms(sceneGraph);

    ƒ.AudioManager.default.listenTo(sceneGraph);
    ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));

    ground = sceneGraph.getChildrenByName("Ground")[0];
    cart = sceneGraph.getChildrenByName("Cart")[0];
    cartWheels = cart.getChildrenByName("Wheel");
    console.log(cartWheels.length);

    let kartTransform: ƒ.ComponentTransform = cart.getComponent(ƒ.ComponentTransform);
    // kartTransform.mtxLocal.translateX(35);
    // kartTransform.mtxLocal.translateY(5);
    // kartTransform.mtxLocal.translateZ(45);
    kartTransform.mtxLocal.rotateY(-90);

    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
    
    cameraNode = new ƒ.Node("cameraNode");
    cameraNode.addComponent(cmpCamera);
    cameraNode.addComponent(new ƒ.ComponentTransform);
    sceneGraph.addChild(cameraNode);

    // ground.addComponent(new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_1));
    // ground.getComponent(ƒ.ComponentRigidbody).restitution = 0;
    // cmpCart = new ƒ.ComponentRigidbody(80, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.COLLISION_GROUP.DEFAULT);
    // cmpCart.restitution = 0;
    // cart.addComponent(cmpCart); 
    //cmpRigidbodyCart = cart.getComponent(ƒ.ComponentRigidbody);    

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.world.simulate(Math.min(0.1, ƒ.Loop.timeFrameReal / 1000));  // if physics is included and used
    //let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    cart.getComponent(ƒ.ComponentRigidbody).applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    cart.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));

    placeCameraOnCart();
    cartWheels.forEach(wheel => {
      calculateDistanceToGroundAndModifyGravity(wheel);
    });

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  // function adjustCartRotation(): void {
  //   if (cart.mtxWorld.rotation.z > 90) {
  //     cart.mtxWorld.rotation.z -= 1;
  //   } else if (cart.mtxWorld.rotation.z < -90) {
  //     cart.mtxWorld.rotation.z += 1;
  //   }
  // }

  function placeCameraOnCart(): void {
    cameraNode.mtxLocal.mutate({
      translation: cart.mtxWorld.translation,
      rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0)
    });
  }

  function calculateDistanceToGroundAndModifyGravity(_node: ƒ.Node): void {
    let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_node.mtxWorld.translation, ground.mtxWorldInverse, true);
    //console.log(posLocal.toString());
    let gravityVector: ƒ.Vector3 = ƒ.Vector3.ZERO();
    if (posLocal.z < -3) {
      gravityVector.y = 0;
    } else if (posLocal.z == -3) {
      gravityVector.y = 0;
    } else {
      gravityVector.y = 3;
    }

    cart.getComponent(ƒ.ComponentRigidbody).applyForceAtPoint(gravityVector, _node.mtxWorld.translation);

    
  }
}