namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;

    export class Coin extends ƒ.Node {

        public constructor(parenplatform: ƒ.Node) {
            super("Coin");
            this.name = "Coin";
            let elementtransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            this.addComponent(elementtransform);

            let elementmesh: ƒ.MeshSphere = <ƒ.MeshSphere>ƒ.Project.resources["MeshTorus|2022-05-13T12:24:39.125Z|90532"];
            let elementmeshcmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(1, 1, 1);
            elementmeshcmp.mtxPivot.rotateX(90);
            this.addComponent(elementmeshcmp);

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-05-13T12:25:28.997Z|99078"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            this.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_PIVOT;
            elementrb.mass = 20;
            elementrb.typeBody = ƒ.BODY_TYPE.KINEMATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.SPHERE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_4;
            elementrb.restitution = 0;
            elementrb.effectGravity = 0;
            elementrb.friction = 0;
            elementrb.isTrigger = true;
            this.addComponent(elementrb);

            this.mtxLocal.translateY(1.5);

            this.addComponent(new CoinRotator());

            parenplatform.addChild(this);

            
            
        }
    }
}
