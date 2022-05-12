namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;

    export class Agent extends ƒ.Node { //creating a new agent will create a new player with all necessary components
        public constructor(position: ƒ.Vector3) {
            super("Agent");
            this.addComponent(new ƒ.ComponentTransform);

            let elementmesh: ƒ.MeshSphere = <ƒ.MeshSphere>ƒ.Project.resources["MeshSphere|2022-05-05T11:36:25.420Z|81284"];
            let elementmeshcmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(1, 2, 1);
            this.addComponent(elementmeshcmp);

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-05-05T11:37:45.198Z|89647"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            this.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_PIVOT;
            elementrb.mass = 20;
            elementrb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CAPSULE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            elementrb.restitution = 0;
            elementrb.effectGravity = 2;
            elementrb.friction = 0;
            this.addComponent(elementrb);

            this.addComponent(new PlayerMovement());
            this.addComponent(new PlatformRemover);

            this.mtxWorld.translation = position;
            this.mtxLocal.translateY(3);
        }
        
    }


}