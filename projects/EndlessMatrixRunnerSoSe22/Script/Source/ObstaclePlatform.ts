namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    export class ObstaclePlatform extends ƒ.Node {
        public receivedCoin: boolean = false;

        public constructor(position: ƒ.Vector3, receiveEdgeObstacles: boolean) {
            super("ObstaclePlatform");
            this.name = "ObstaclePlatform";
            let elementtransform: ƒ.ComponentTransform = new ƒ.ComponentTransform;
            this.addComponent(elementtransform);

            let elementmesh: ƒ.MeshCube = <ƒ.MeshCube>ƒ.Project.resources["MeshCube|2022-05-05T11:29:50.067Z|61589"];
            let elementmeshcmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(4, 1, 2);
            this.addComponent(elementmeshcmp);

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-05-05T11:30:27.621Z|27233"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(2, 0.5));
            this.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
            this.addComponent(elementrb);
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            // elementrb.mass = 1;
            // elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            // elementrb.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            // elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;



            this.mtxLocal.translate(position);


            // });

            if (receiveEdgeObstacles) {
                this.createObstacleElement(new ƒ.Vector3(-2, 0, -0.75), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(0.8, 0.7, 0.5));
                this.createObstacleElement(new ƒ.Vector3(-2, 0, 0.75), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(0.8, 0.7, 0.5));
                this.createObstacleElement(new ƒ.Vector3(-2, 0, 0), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(0.8, 1, 1));
            }




            sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].addChild(this);
            //console.log(sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren().length);
        }

        private createObstacleElement(position: ƒ.Vector3, rotation: ƒ.Vector3, scale: ƒ.Vector3): void {

            let obstacleNode: ƒ.Node = new ƒ.Node("Obstacle");
            this.addChild(obstacleNode);

            let elementtransform: ƒ.ComponentTransform = new ƒ.ComponentTransform;
            elementtransform.mtxLocal.translation = position;
            elementtransform.mtxLocal.scaling = scale;
            elementtransform.mtxLocal.rotation = rotation;
            obstacleNode.addComponent(elementtransform);

            let elementmesh: ƒ.MeshPyramid = <ƒ.MeshPyramid>ƒ.Project.resources["MeshPyramid|2022-05-05T12:03:50.249Z|59428"];
            obstacleNode.addComponent(new ƒ.ComponentMesh(elementmesh));

            let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-05-05T12:03:08.224Z|13509"];
            let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(1, 2));
            obstacleNode.addComponent(elementmatcmp);

            let elementrb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.PYRAMID;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_3;
            obstacleNode.addComponent(elementrb);


        }
    }
}