namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization

  export class PlayerMovement extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlayerMovement);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "PlayerMovement added to ";
    
    private ctrlJump: ƒ.Control = new ƒ.Control("Jump", 1, ƒ.CONTROL_TYPE.DIFFERENTIAL);
    private isJumpPressed: boolean = false;

    private ctrlForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
    //private canDash: boolean = true;

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
      
      this.ctrlForward.setDelay(10);

      

      //this.groundRB = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0].getComponent(ƒ.ComponentRigidbody);
      

      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      
      
    }

    public update = (_event: Event): void => {

      this.cmpPlayerRb = playerNode.getComponent(ƒ.ComponentRigidbody);

      this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);
      

      
      this.ctrlJump.setDelay(deltaTime * 1000 - 1);

      if (GameState.get().gameRunning) {

        this.ctrlForward.setInput(configurations.initialspeed);
        playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));
  
        let isGrounded: boolean = false;
  
        let playerCollisions: ƒ.ComponentRigidbody[] = this.cmpPlayerRb.collisions;
        playerCollisions.forEach(collider => {
  
          switch (collider.collisionGroup) {
            case ƒ.COLLISION_GROUP.GROUP_2: //Ground elements
              isGrounded = true;
              break;
  
            case ƒ.COLLISION_GROUP.GROUP_3: //Obstacles
              this.respawn();
              
              console.log("Obstacle hit");
              break;
          
            default:
              break;
            
          }
        });
  
        this.ctrlJump.setInput(ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE]));
  
        if ((this.ctrlJump.getOutput() == 1) && !this.isJumpPressed) {
          this.isJumpPressed = true;
          //console.log(this.ctrlJump.getOutput());
        } else {
          this.isJumpPressed = false;
          //console.log(this.ctrlJump.getOutput());
        }
        
        if (this.isJumpPressed && isGrounded) {
          //playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), 300));
          let velocityvector: ƒ.Vector3 = this.cmpPlayerRb.getVelocity();
          velocityvector.y = 10;
          this.cmpPlayerRb.setVelocity(velocityvector);
          console.log("Jump from ground");
          return;
        } else if (this.isJumpPressed && !isGrounded) {
          playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), -400));
          console.log("Dive towards ground");
        }
      }
      }

      public respawn = (): void =>  {

        //this.node.mtxLocal.translation = new ƒ.Vector3(0, 2.2, 0);
        this.cmpPlayerRb.setVelocity(new ƒ.Vector3(0, 0, 0));
        this.cmpPlayerRb.setPosition(new ƒ.Vector3(0, 2.2, 0));
        GameState.get().gameRunning = false;
        let platforms: ƒ.Node[] = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildrenByName("ObstaclePlatform");
        platforms.forEach(platform => {
          platform.removeComponent(platform.getComponent(ƒ.ComponentRigidbody));
          platform.getChildrenByName("Obstacle").forEach(child => {
            child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
            });
        });

        sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeAllChildren();

        let groundsegments: ƒ.Node[] = sceneGraph.getChildrenByName("FloorElements")[0].getChildren();
        groundsegments.forEach(groundsegment => {
          groundsegment.removeComponent(groundsegment.getComponent(ƒ.ComponentRigidbody));
        });
        sceneGraph.getChildrenByName("FloorElements")[0].removeAllChildren();
        let firstfloorelement: FloorElement = new FloorElement(new ƒ.Vector3(0, 0, 0))
        
      }

  }

  

}