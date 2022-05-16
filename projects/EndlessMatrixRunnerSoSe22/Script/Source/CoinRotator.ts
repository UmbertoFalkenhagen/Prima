namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization

  export class CoinRotator extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CoinRotator);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CoinRotator added to ";
    private minheight: number;
    private maxheight: number;
    private moveDir: boolean = false;

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
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
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    public start (): void  {
     
      this.maxheight = this.node.mtxLocal.translation.y + 0.25;
      this.minheight = this.node.mtxLocal.translation.y - 0.25;
      this.node.addEventListener("ColliderEnteredCollision", this.hndPlayerCollision);
      
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      
      
    }

    public update = (_event: Event): void => {
      this.node.mtxLocal.rotateY(deltaTime * 180);

      if (this.moveDir) {
        if (this.node.mtxLocal.translation.y < this.maxheight) {
          this.node.mtxLocal.translateY(deltaTime);
        } else {
          this.node.mtxLocal.translation.y = this.maxheight;
          this.moveDir = !this.moveDir;
        }
      } else {
        if (this.node.mtxLocal.translation.y > this.minheight) {
          this.node.mtxLocal.translateY(-deltaTime);
        } else {
          this.node.mtxLocal.translation.y = this.minheight;
          this.moveDir = !this.moveDir;
        }
      }
    }

    public hndPlayerCollision(): void {
      this.node.removeEventListener("ColliderEnteredCollision", this.hndPlayerCollision);
      console.log("Coin Collected");
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}