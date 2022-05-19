namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization
  
    export class PlatformRemover extends ƒ.ComponentScript { //is attached to the agent and removes platforms that are out of sight
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformRemover);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "PlatformRemover added to ";
  
      private platformnodes: ƒ.Node[];
  
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
       
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        
      }
  
      public update = (_event: Event): void => {
  
        this.platformnodes = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
        //console.log(this.platformnodes.length);
        this.platformnodes.forEach(platform => {
          this.checkPlayerPosition(platform);
        });
        
        
  
      }
  
      private checkPlayerPosition = (_platformnode: ƒ.Node): void => {
        //console.log("Playerposition: " + playerNode.mtxLocal.translation.x);
        //console.log("Platformposition: " + this.node.mtxLocal.translation.x);
        if (this.node.mtxLocal.translation.x - 20 >= _platformnode.mtxLocal.translation.x) {
            // console.log(this.platformnodes.length);
            // _platformnode.removeComponent(_platformnode.getComponent(ƒ.ComponentRigidbody));
            // _platformnode.getChildren().forEach(child => {
            // child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
            // });
            // _platformnode.removeAllChildren();
            sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeChild(_platformnode);
            // console.log("Removed platform segment");
            // console.log(this.platformnodes.length);
        }
      }

      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }