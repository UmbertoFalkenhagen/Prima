namespace Slenderman {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Slenderman);  // Register the namespace to FUDGE for serialization

  export class TreeComponent extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(TreeComponent);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "TreeComponent added to ";
    private treepos: ƒ.Vector3 = new ƒ.Vector3;
    private scalefactor: ƒ.Vector3 = new ƒ.Vector3;


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

    public placeTree(_treepos: ƒ.Vector2, _scalefactor: ƒ.Vector3): void {
      
      //place tree at given x and z coordinates
      this.treepos.x = _treepos.x;
      this.treepos.z = _treepos.y;
      this.node.mtxLocal.translation.x = this.treepos.x;
      this.node.mtxLocal.translation.z = this.treepos.y;

      //scale tree according to given values
      this.scalefactor = _scalefactor;
      this.node.mtxLocal.scaling = this.scalefactor;

      //place tree on terrain height at coordinates
      let mtxTerrain: ƒ.Matrix4x4;
      let meshTerrain: ƒ.MeshTerrain;
      let cmpMeshTerrain: ƒ.ComponentMesh = viewport.getBranch().getChildrenByName("Floor")[0].getComponent(ƒ.ComponentMesh);
      meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
      mtxTerrain = cmpMeshTerrain.mtxWorld;
      let posStem: ƒ.Vector3 = this.node.getChildrenByName("Stem")[0].getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posStem, mtxTerrain);
      console.log(terrainInfo);
      let height: number = posStem.y - terrainInfo.position.y;
      this.node.mtxLocal.translateY((-height / this.node.mtxLocal.scaling.y) - 0.2);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}