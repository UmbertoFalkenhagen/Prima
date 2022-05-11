namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization
  
    export class PlatformRemover extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformRemover);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "PlatfromRemover added to ";
  
      private groundNodes: ƒ.Node[];
      private noderb: ƒ.ComponentRigidbody;
      private nodetransform: ƒ.ComponentTransform;
  
  
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
       
        this.noderb = this.node.getComponent(ƒ.ComponentRigidbody);
        this.nodetransform = this.node.getComponent(ƒ.ComponentTransform);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        
      }
  
      public update = (_event: Event): void => {
  
        this.groundNodes = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildrenByName("ObstaclePlatform");
        this.checkPlayerPosition();
        
  
      }
  
      private checkPlayerPosition = (): void => {
        //console.log("Playerposition: " + playerNode.mtxLocal.translation.x);
        //console.log("Platformposition: " + this.node.mtxLocal.translation.x);
        if (playerNode.mtxLocal.translation.x - 20 >= this.nodetransform.mtxLocal.translation.x) {
            this.node.removeComponent(this.noderb);
            this.node.getChildren().forEach(child => {
            child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
            });
            this.node.removeAllChildren();
            this.node.removeComponent(this);
            sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeChild(this.node);
            console.log("Removed platform segment");
        }
      }

      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }