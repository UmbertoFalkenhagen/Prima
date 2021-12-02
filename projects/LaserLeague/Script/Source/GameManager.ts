namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(LaserLeague);  // Register the namespace to FUDGE for serialization

  export class GameManager extends ƒ.ComponentScript {
    
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(GameManager);
    private static instance: GameManager;
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "GameManager added to ";
    

    public deltaTime: number;
    public agent: ƒ.Node;
    public sceneGraph: ƒ.Node;


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    public static getInstance(): GameManager {
      if (!GameManager.instance) {
          GameManager.instance = new GameManager();
      }

      return GameManager.instance;
  }

    // Activate the functions of this component as response to events
     // Activate the functions of this component as response to events
     public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          this.sceneGraph = this.node;
          this.start();
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    public start = (): void  => {
      console.log("thats what you looking for: " + this.node);
      //this.sceneGraph = this.node; //<ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-13T12:42:15.134Z|58505"];
      //this.agent = this.sceneGraph.getChildrenByName("Agents")[0].getChildrenByName("Agent_1")[0];
      
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      this.deltaTime = ƒ.Loop.timeFrameReal / 1000;
    }

    public update = (_event: Event): void => {
      
      //CollisionDetector.checkCollision(this.node, this.agent);
    }


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}