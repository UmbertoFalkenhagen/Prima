namespace EndlessMatrixRunner {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunner);  // Register the namespace to FUDGE for serialization

  export class GroundControllerScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(GroundControllerScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "GroundControllerScript added to ";

    private groundGraph: ƒ.Graph;
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
      this.node.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
      
      
    }

    public update = (_event: Event): void => {

      if (GameState.get().gameRunning) {
        this.groundNodes = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground");
        //console.log(this.groundNodes.length);
        this.checkPlayerPosition();
      }

    }

    private checkPlayerPosition = (): void => {
      if ((playerNode.mtxLocal.translation.x + 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2) 
      && this.node == this.groundNodes[this.groundNodes.length - 1]) {
        let newgroundposition: number = this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x;
        this.instantiateNewGroundSegmentAtPosition(newgroundposition);
        
        
      } else if (playerNode.mtxLocal.translation.x - 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2 
        && this.node == this.groundNodes[0]) {
          sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].removeChild(this.node);
          console.log("Removed ground segment");
      }
    }

    private instantiateNewGroundSegmentAtPosition = async (xtranslation: number): Promise<void> => {
      this.groundGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
      let newGroundNode: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(this.groundGraph);
      newGroundNode.mtxLocal.translation = 
      new ƒ.Vector3(xtranslation, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.y, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.z);
      newGroundNode.name = "Ground";
      sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
      console.log("Added ground segment");
    }



    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}