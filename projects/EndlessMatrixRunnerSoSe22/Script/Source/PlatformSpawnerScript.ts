namespace EndlessMatrixRunnerSoSe22 {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22);  // Register the namespace to FUDGE for serialization

  export class PlatformSpawnerScript extends ƒ.ComponentScript { //is attached to the platformspawner and 
    // includes the behavior for spawning predefined combinations of platforms
    // Register the script as component for use in the editor via drag&drop
    //public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformSpawnerScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "PlatformSpawnerScript added to ";

    private distancefromplayer: number;
    private spawnactivationcounter: number = 0;
    private currentplatforms: ƒ.Node[];
    //private currentplatformswithcoin: ƒ.Node[];
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

    public start(): void {


      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);


    }

    public update = (_event: Event): void => {

      this.currentplatforms = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
      this.node.mtxLocal.translation.x = playerNode.mtxLocal.translation.x + this.distancefromplayer;
      this.createRandomPlatformAmount();
      this.addCoinsToPlatforms();
    }

    public createRandomPlatformAmount(): void {
      if (GameState.get().gameRunning && playerNode.getComponent(ƒ.ComponentRigidbody).getVelocity().x > 1) {
        let random: ƒ.Random = new ƒ.Random();
        let randomnumber: number = random.getRangeFloored(0, playerNode.getComponent(PlayerMovement).ctrlForward.getOutput());
        this.spawnactivationcounter += randomnumber;
        //console.log(this.spawnactivationcounter);
        if (this.spawnactivationcounter >= 1000 && this.currentplatforms.length <= 10) {
          random = new ƒ.Random();
          randomnumber = random.getRangeFloored(0, 100);
          //console.log(randomnumber);
          switch (true) {
            case (randomnumber < 45):
              this.spawnNewPlatform(0, 0, configurations.obstacleplatforms);
              console.log("Spawned one platform");
              this.spawnactivationcounter = 0;
              break;
            case (45 <= randomnumber && randomnumber < 70):
              this.spawnNewPlatform(0, 0, configurations.obstacleplatforms);
              this.spawnNewPlatform(15, 4, configurations.obstacleplatforms);
              console.log("Spawned two platforms");
              this.spawnactivationcounter = 0;
              break;
            case (70 <= randomnumber && randomnumber < 100):
              this.spawnNewPlatform(0, 0, configurations.obstacleplatforms);
              this.spawnNewPlatform(15, 4, configurations.obstacleplatforms);
              this.spawnNewPlatform(30, 0, configurations.obstacleplatforms);
              console.log("Spawned three platforms");
              this.spawnactivationcounter = 0;
              break;
            default:
              break;
          }

          random = new ƒ.Random();
          randomnumber = random.getRangeFloored(0, 10);
          if (randomnumber <= 3) {
            this.spawnEnemy(0);
          }
          this.currentplatforms = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
        }
      }
    }

    public spawnNewPlatform = async (xposfrombottomline: number, yposfrombottomline: number, receiveEdgeObstacles: boolean): Promise<void> => {
      let newPlatformNode: ObstaclePlatform = new ObstaclePlatform(ƒ.Vector3.ZERO(), receiveEdgeObstacles);
      newPlatformNode.mtxLocal.translation =
        new ƒ.Vector3(this.node.mtxLocal.translation.x + xposfrombottomline, this.node.mtxLocal.translation.y + yposfrombottomline + 2, this.node.mtxLocal.translation.z);
      newPlatformNode.name = "Platform";
      sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].addChild(newPlatformNode);
      console.log("Added platform segment");
    }

    public addCoinsToPlatforms(): void {

      this.currentplatforms.forEach(platform => {
        if (platform.getChildrenByName("Coin").length == 0 && platform.mtxLocal.translation.x - 30 > playerNode.mtxLocal.translation.x) {
          let random: ƒ.Random = new ƒ.Random();
          let randomnumber: number = random.getRangeFloored(0, 200);
          if (randomnumber == 1) {
            let newcoin: Coin = new Coin(platform);
            console.log(newcoin);
          }


        }

      });
    }

    public spawnEnemy(iterator: number): void {
      let enemynodes: ƒ.Node[] = sceneGraph.getChildrenByName("Enemies")[0].getChildren();
      if (enemynodes.length < 2) {
        let random: ƒ.Random = new ƒ.Random();
        let randomnumber: number = random.getRangeFloored(1, 4);
        let placementposition: ƒ.Vector3 = ƒ.Vector3.ZERO();
        switch (randomnumber) {
          case 1:
            enemynodes.forEach(element => {
              if (element.mtxLocal.translation.y == 2) {
                if (iterator < 3) {
                  this.spawnEnemy(iterator + 1);
                } else {
                  return;
                }
              }
            });
            placementposition = new ƒ.Vector3(playerNode.mtxLocal.translation.x + 20, 2, 0);
            break;
          case 2:
            enemynodes.forEach(element => {
              if (element.mtxLocal.translation.y == 6) {
                if (iterator < 3) {
                  this.spawnEnemy(iterator + 1);
                } else {
                  return;
                }
              }
            });
            placementposition = new ƒ.Vector3(playerNode.mtxLocal.translation.x + 20, 6, 0);
            break;
          case 3:
            enemynodes.forEach(element => {
              if (element.mtxLocal.translation.y == 10) {
                if (iterator < 3) {
                  this.spawnEnemy(iterator + 1);
                } else {
                  return;
                }
              }
            });
            placementposition = new ƒ.Vector3(playerNode.mtxLocal.translation.x + 20, 10, 0);
            break;
          default:
            break;
        }

        let enemy: Enemy = new Enemy(placementposition);

      }

    }




    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}