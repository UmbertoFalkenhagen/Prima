namespace EndlessMatrixRunner {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunner);  // Register the namespace to FUDGE for serialization

  export class PlatformScript extends GroundControllerScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "PlatformScript added to ";


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

    public update = (_event: Event): void => {
      if (playerNode.mtxLocal.translation.x - 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2 
        && this.node == sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform")[0]) {
          this.node.getChildren().forEach(child => {
            child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
          });
          this.node.removeComponent(this.node.getComponent(ƒ.ComponentRigidbody));
          sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].removeChild(this.node);
          console.log("Removed platform");
      }
    }


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}