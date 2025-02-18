namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;

    export class FloorElement extends ƒ.Node {
        public constructor(position: ƒ.Vector3) {
            super("FloorElement");
            let elementtransform: ƒ.ComponentTransform = new ƒ.ComponentTransform;
            this.addComponent(elementtransform);

            let elementmesh: ƒ.MeshCube = <ƒ.MeshCube>ƒ.Project.resources["MeshCube|2022-05-05T11:29:50.067Z|61589"];
            this.addComponent(new ƒ.ComponentMesh(elementmesh));

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-05-05T11:30:27.621Z|27233"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(3, 0.25));
            this.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
            this.addComponent(elementrb);

            this.addComponent(new GroundControllerScript());

            this.mtxLocal.scale(new ƒ.Vector3(20, 1, 2));
            this.mtxLocal.translate(position);

            sceneGraph.getChildrenByName("FloorElements")[0].addChild(this);
            
            //this.mtxLocal.translateY(0.5);
        }
        
    }


}