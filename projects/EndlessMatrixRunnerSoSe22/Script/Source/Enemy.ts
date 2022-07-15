namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;

    export class Enemy extends ƒ.Node { //creating a new enemy will create a new enemy with all necessary components
        public constructor(position: ƒ.Vector3) {
            super("Enemy");
            this.addComponent(new ƒ.ComponentTransform);

            let elementmesh: ƒ.MeshPyramid = <ƒ.MeshPyramid>ƒ.Project.resources["MeshPyramid|2022-07-15T12:09:48.716Z|73697"];
            let elementmeshcmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(1, 1, 1);
            elementmeshcmp.mtxPivot.rotateZ(90);
            this.addComponent(elementmeshcmp);

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-07-15T12:16:11.934Z|81738"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            this.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_PIVOT;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.PYRAMID;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_3;
            elementrb.restitution = 0;
            elementrb.effectGravity = 0;
            elementrb.friction = 0;
            elementrb.mtxPivot.rotateZ(90);
            this.addComponent(elementrb);

            this.addComponent(new EnemyStateMachine);

            sceneGraph.getChildrenByName("Enemies")[0].addChild(this);

            this.mtxLocal.translation = position;

            
        }
        
    }


}