namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(LaserLeague);  // Register the namespace to FUDGE for serialization

  export class CollisionDetector extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CollisionDetector);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CollisionDetector added to ";

    public viewport: ƒ.Viewport;
    public deltaTime: number;
    public agents: ƒ.Node[];
    public sceneGraph: ƒ.Graph;

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
    public hndEvent = (_event: Event) => {
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
      this.sceneGraph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-13T12:42:15.134Z|58505"];
      this.deltaTime = ƒ.Loop.timeFrameReal / 1000;
      this.agents = this.sceneGraph.getChildrenByName("Agents")[0].getChildren();
      //console.log(this.agents.length);
      /*this.agents.forEach(agent => {
        this.checkCollision(agent);
      });*/
    }

    public checkCollision = (collider: ƒ.Node): boolean => {
      //let mesh: ƒ.ComponentMesh = this.node.getComponent(ƒ.ComponentMesh);
      let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, this.node.mtxWorldInverse, true);
      let x: number = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius / 2;
      let y: number = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius / 2;

      if (posLocal.x <= (x) && posLocal.x >= -(x) && posLocal.y <= y && posLocal.y >= 0) {
        //console.log("intersecting");
        this.node.dispatchEvent(new CustomEvent("collisionEvent", { bubbles: true }));
        return true;
        //_agent.getComponent(agentComponentScript).respawn();
      } else {
        return false;
      }
    }



    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}