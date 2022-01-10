namespace EndlessMatrixRunner {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunner);  // Register the namespace to FUDGE for serialization

  export class PlayerMovement extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlayerMovement);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "PlayerMovement added to ";
    
    private ctrlJump: ƒ.Control = new ƒ.Control("Jump", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);

    private ctrlForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
    private canDash: boolean = true;

    //private groundRB: ƒ.ComponentRigidbody;
    private cmpPlayerRb: ƒ.ComponentRigidbody;

  
    


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          this.start();
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    public start (): void  {
      //this.ctrlJump.setDelay(250);
      this.ctrlForward.setDelay(10);

      

      //this.groundRB = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0].getComponent(ƒ.ComponentRigidbody);
      

      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      
      
    }

    public update = (_event: Event): void => {

      this.cmpPlayerRb = playerNode.getComponent(ƒ.ComponentRigidbody);

      this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);

      let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

      this.ctrlForward.setInput(10);

      let isGrounded: boolean = false;
      let canJumpMidair: boolean;

      let playerCollisions: ƒ.ComponentRigidbody[] = this.cmpPlayerRb.collisions;
      playerCollisions.forEach(collider => {
        if (collider.collisionGroup == ƒ.COLLISION_GROUP.GROUP_2) {
          isGrounded = true;
          canJumpMidair = true;
          console.log("Is grounded");
        }
      });

      // = this.checkCollision(groundNode);

    
      let isJumpPressed: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]);
      
      if (isJumpPressed && isGrounded) {
        this.ctrlJump.setInput(30);
        playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
        console.log("Jumped from ground");
        return;
      } else if (isJumpPressed && !isGrounded) {
        this.ctrlJump.setInput(-30);
        playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
        console.log("Jumped midair");
      }
      

      //playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
      //playerNode.mtxLocal.translateX(this.ctrlForward.getOutput() * deltaTime);
      playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));

    }

    //public checkCollision = (collider: ƒ.Node): boolean => {
      
    //}


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}