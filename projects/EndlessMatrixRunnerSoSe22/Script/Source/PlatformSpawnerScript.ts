namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization

  export class PlatformSpawnerScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    //public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformSpawnerScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "PlatformSpawnerScript added to ";

    private distancefromplayer: number;
    private spawnactivationcounter: number = 0;
    //private platformGraph: ƒ.Graph;


    constructor(_distancefromplayer: number) {
      super();
      this.distancefromplayer = _distancefromplayer;

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

      this.node.mtxLocal.translation.x = playerNode.mtxLocal.translation.x + this.distancefromplayer;

      if (GameState.get().gameRunning) {
        this.spawnactivationcounter ++;
        //console.log(this.spawnactivationcounter);
        if (this.spawnactivationcounter >= 300) {
          
          let random: ƒ.Random = new ƒ.Random();
          let randomnumber: number = random.getRangeFloored(0, 100);
          //console.log(randomnumber);
          switch (true) {
            case (randomnumber < 25):
              this.spawnactivationcounter = 0;
              break;
            case (25 <= randomnumber && randomnumber < 45) :
              this.spawnNewPlatform(0, 0);
              console.log("Spawned one platform");
              this.spawnactivationcounter = 0;
              break;
            case (45 <= randomnumber && randomnumber < 60) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              console.log("Spawned two platforms");
              this.spawnactivationcounter = 0;
              break;
            case (60 <= randomnumber && randomnumber < 73) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              this.spawnNewPlatform(30, 0);
              console.log("Spawned three platforms");
              this.spawnactivationcounter = 0;
              break;
            case (73 <= randomnumber && randomnumber < 83) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              this.spawnNewPlatform(30, 0);
              this.spawnNewPlatform(25, 7);
              console.log("Spawned four platforms");
              this.spawnactivationcounter = 0;
              break;
            case (83 <= randomnumber && randomnumber < 90) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              this.spawnNewPlatform(30, 0);
              this.spawnNewPlatform(25, 7);
              this.spawnNewPlatform(35, 4);
              console.log("Spawned five platforms");
              this.spawnactivationcounter = 0;
              break;
            case (90 <= randomnumber && randomnumber < 96) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              this.spawnNewPlatform(30, 0);
              this.spawnNewPlatform(25, 7);
              this.spawnNewPlatform(35, 4);
              this.spawnNewPlatform(45, 7);
              console.log("Spawned six platforms");
              this.spawnactivationcounter = 0;
              break;
            case (96 <= randomnumber && randomnumber < 100) :
              this.spawnNewPlatform(0, 0);
              this.spawnNewPlatform(15, 4);
              this.spawnNewPlatform(30, 0);
              this.spawnNewPlatform(25, 7);
              this.spawnNewPlatform(35, 4);
              this.spawnNewPlatform(45, 7);
              this.spawnNewPlatform(60, 4);
              console.log("Spawned seven platforms");
              this.spawnactivationcounter = 0;
              break;
            default:
              break;
          }
        }
      }
    }

    public spawnNewPlatform = async (xposfrombottomline: number, yposfrombottomline: number): Promise<void> => {
      let newPlatformNode: ObstaclePlatform = new ObstaclePlatform(ƒ.Vector3.ZERO());
      newPlatformNode.mtxLocal.translation = 
      new ƒ.Vector3(this.node.mtxLocal.translation.x + xposfrombottomline, this.node.mtxLocal.translation.y + yposfrombottomline + 2, this.node.mtxLocal.translation.z);
      newPlatformNode.name = "Platform";
      sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].addChild(newPlatformNode);
      console.log("Added platform segment");
    }

    


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}