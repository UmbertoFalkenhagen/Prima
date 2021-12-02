namespace MarioKart {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(MarioKart);  // Register the namespace to FUDGE for serialization

  export class HeightMapGenerator extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(HeightMapGenerator);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "HeightMapGenerator added to ";
    public heightMapSource: ƒ.TextureImage;
    public reliefMesh: ƒ.MeshTerrain;
    public map: ƒ.Node = new ƒ.Node("ownTarrain");
    public graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T14:33:59.117Z|18376"];


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
      //this.reliefMesh = this.node.getComponent(ƒ.MeshRelief);
      this.generateTerrain();
      //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      
      
    }

    //public update = (_event: Event): void => {

    //}

    public async generateTerrain(): Promise<void> {
      this.heightMapSource = new ƒ.TextureImage();
      this.heightMapSource = <ƒ.TextureImage>FudgeCore.Project.resources["TextureImage|2021-11-23T10:35:25.413Z|13750"];
      //await this.heightMapSource.load("../Textures/heightmap_3.png");

      /*for (let x = 0; x < this.heightMapSource.; index++) {
        const element = array[index];
        
      }*/

      //let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

      let mtrTexFlat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2021-11-23T02:36:34.207Z|12139"];
      let material: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrTexFlat);
      let gridMeshFlat: ƒ.MeshTerrain = new ƒ.MeshRelief("HeightMap", this.heightMapSource);
      let grid: ƒ.ComponentMesh = new ƒ.ComponentMesh(gridMeshFlat);
      console.log(grid);
      grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100));
      grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y);

      let transfom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
      this.map.addComponent(grid);
      this.map.addComponent(material);
      //this.map.addComponent(cmpRigidbody);
      this.map.addComponent(transfom);
      this.graph.addChild(this.map);
  
      //this.reliefMesh = new ƒ.MeshRelief("HeightMap", this.heightMapSource);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}