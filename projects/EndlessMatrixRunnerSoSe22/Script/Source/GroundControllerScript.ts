namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization
  
    export class GroundControllerScript extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(GroundControllerScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "GroundControllerScript added to ";
  
      private groundNodes: ƒ.Node[];
  
  
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
  
        this.groundNodes = sceneGraph.getChildrenByName("FloorElements")[0].getChildrenByName("FloorElement");
        this.checkPlayerPosition();
        
  
      }
  
      private checkPlayerPosition = (): void => {
        //console.log("Playerposition: " + playerNode.mtxLocal.translation.x);
        //console.log("Platformposition: " + this.node.mtxLocal.translation.x);
        if ((playerNode.mtxLocal.translation.x + 30 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2) 
        && this.node == this.groundNodes[this.groundNodes.length - 1]) {
          console.log("Time to spawn a new floor element");
          let newgroundposition: number = this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x;
          this.instantiateNewGroundSegmentAtPosition(newgroundposition);
          
          
        } else if (playerNode.mtxLocal.translation.x - 30 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2 
          && this.node == this.groundNodes[0]) {
            this.node.removeComponent(this.node.getComponent(ƒ.ComponentRigidbody));
            sceneGraph.getChildrenByName("FloorElements")[0].removeChild(this.node);
            console.log("Removed ground segment");
        }
      }
  
      private instantiateNewGroundSegmentAtPosition = (xtranslation: number): void => {
       
        let newfloorelement: FloorElement = new FloorElement(new ƒ.Vector3(xtranslation, 0, 0));
        newfloorelement.mtxLocal.translation = 
        new ƒ.Vector3(xtranslation, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.y, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.z);
        //newfloorelement.name = "FloorElement";
        sceneGraph.getChildrenByName("FloorElements")[0].addChild(newfloorelement);
        console.log("Added ground segment");
      }
  
  
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }