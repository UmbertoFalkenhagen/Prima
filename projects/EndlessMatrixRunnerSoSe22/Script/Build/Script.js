"use strict";
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor(position) {
            super("Agent");
            this.addComponent(new ƒ.ComponentTransform);
            let elementmesh = ƒ.Project.resources["MeshSphere|2022-05-05T11:36:25.420Z|81284"];
            let elementmeshcmp = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(1, 2, 1);
            this.addComponent(elementmeshcmp);
            let elementmat = ƒ.Project.resources["Material|2022-05-05T11:37:45.198Z|89647"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            this.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_PIVOT;
            elementrb.mass = 20;
            elementrb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CAPSULE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            elementrb.restitution = 0;
            elementrb.effectGravity = 2;
            elementrb.friction = 0;
            this.addComponent(elementrb);
            this.addComponent(new EndlessMatrixRunnerSoSe22.PlayerMovement());
            this.addComponent(new EndlessMatrixRunnerSoSe22.PlatformRemover);
            this.mtxLocal.translation = position;
            this.mtxLocal.translateY(3);
        }
    }
    EndlessMatrixRunnerSoSe22.Agent = Agent;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class CameraScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CameraScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CameraScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            this.node.mtxLocal.translation.y = EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.y + 7.5;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.node.mtxLocal.translation.x = EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x;
            this.node.mtxLocal.translation.z = EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.z + 40;
            this.node.mtxLocal.lookAt(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation);
        };
    }
    EndlessMatrixRunnerSoSe22.CameraScript = CameraScript;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        constructor(parenplatform) {
            super("Coin");
            this.name = "Coin";
            let elementtransform = new ƒ.ComponentTransform();
            this.addComponent(elementtransform);
            let elementmesh = ƒ.Project.resources["MeshTorus|2022-05-13T12:24:39.125Z|90532"];
            let elementmeshcmp = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(1, 1, 1);
            elementmeshcmp.mtxPivot.rotateX(90);
            this.addComponent(elementmeshcmp);
            let elementmat = ƒ.Project.resources["Material|2022-05-13T12:25:28.997Z|99078"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            this.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody();
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
            this.addComponent(new EndlessMatrixRunnerSoSe22.CoinRotator());
            parenplatform.addChild(this);
        }
    }
    EndlessMatrixRunnerSoSe22.Coin = Coin;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class CoinRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CoinRotator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CoinRotator added to ";
        minheight;
        maxheight;
        moveDir = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        start() {
            this.maxheight = this.node.mtxLocal.translation.y + 0.25;
            this.minheight = this.node.mtxLocal.translation.y - 0.25;
            this.node.addEventListener("ColliderEnteredCollision", this.hndPlayerCollision);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.node.mtxLocal.rotateY(EndlessMatrixRunnerSoSe22.deltaTime * 180);
            if (this.moveDir) {
                if (this.node.mtxLocal.translation.y < this.maxheight) {
                    this.node.mtxLocal.translateY(EndlessMatrixRunnerSoSe22.deltaTime);
                }
                else {
                    this.node.mtxLocal.translation.y = this.maxheight;
                    this.moveDir = !this.moveDir;
                }
            }
            else {
                if (this.node.mtxLocal.translation.y > this.minheight) {
                    this.node.mtxLocal.translateY(-EndlessMatrixRunnerSoSe22.deltaTime);
                }
                else {
                    this.node.mtxLocal.translation.y = this.minheight;
                    this.moveDir = !this.moveDir;
                }
            }
        };
        hndPlayerCollision() {
            this.node.removeEventListener("ColliderEnteredCollision", this.hndPlayerCollision);
            console.log("Coin Collected");
        }
    }
    EndlessMatrixRunnerSoSe22.CoinRotator = CoinRotator;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    EndlessMatrixRunnerSoSe22.CustomComponentScript = CustomComponentScript;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    class FloorElement extends ƒ.Node {
        constructor(position) {
            super("FloorElement");
            let elementtransform = new ƒ.ComponentTransform;
            this.addComponent(elementtransform);
            let elementmesh = ƒ.Project.resources["MeshCube|2022-05-05T11:29:50.067Z|61589"];
            this.addComponent(new ƒ.ComponentMesh(elementmesh));
            let elementmat = ƒ.Project.resources["Material|2022-05-05T11:30:27.621Z|27233"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(3, 0.25));
            this.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
            this.addComponent(elementrb);
            this.addComponent(new EndlessMatrixRunnerSoSe22.GroundControllerScript());
            this.mtxLocal.scale(new ƒ.Vector3(20, 1, 2));
            this.mtxLocal.translate(position);
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].addChild(this);
            //this.mtxLocal.translateY(0.5);
        }
    }
    EndlessMatrixRunnerSoSe22.FloorElement = FloorElement;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    //import ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        //private static controller: ƒui.Controller;
        static instance;
        name = "EndlessMatrixRunnerSoSe22";
        highscore = 0;
        gameRunning = false;
        constructor() {
            super();
            let domHud = document.querySelector("#Hud");
            console.log(domHud);
            GameState.instance = this;
            //GameState.controller = new ƒui.Controller(this, domHud);
            //console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        reduceMutator(_mutator) { }
    }
    EndlessMatrixRunnerSoSe22.GameState = GameState;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class GroundControllerScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(GroundControllerScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "GroundControllerScript added to ";
        groundNodes;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.groundNodes = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].getChildrenByName("FloorElement");
            this.checkPlayerPosition();
        };
        checkPlayerPosition = () => {
            //console.log("Playerposition: " + playerNode.mtxLocal.translation.x);
            //console.log("Platformposition: " + this.node.mtxLocal.translation.x);
            if ((EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x + 30 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2)
                && this.node == this.groundNodes[this.groundNodes.length - 1]) {
                console.log("Time to spawn a new floor element");
                let newgroundposition = this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x;
                this.instantiateNewGroundSegmentAtPosition(newgroundposition);
            }
            else if (EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x - 30 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2
                && this.node == this.groundNodes[0]) {
                this.node.removeComponent(this.node.getComponent(ƒ.ComponentRigidbody));
                EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].removeChild(this.node);
                console.log("Removed ground segment");
            }
        };
        instantiateNewGroundSegmentAtPosition = (xtranslation) => {
            let newfloorelement = new EndlessMatrixRunnerSoSe22.FloorElement(new ƒ.Vector3(xtranslation, 0, 0));
            newfloorelement.mtxLocal.translation =
                new ƒ.Vector3(xtranslation, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.y, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.z);
            //newfloorelement.name = "FloorElement";
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].addChild(newfloorelement);
            console.log("Added ground segment");
        };
    }
    EndlessMatrixRunnerSoSe22.GroundControllerScript = GroundControllerScript;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let platformSpawner;
    let cameraNode;
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", (_event) => {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            start();
        });
        //@ts-ignore
        dialog.showModal();
        async function start() {
            await ƒ.Project.loadResourcesFromHTML();
            EndlessMatrixRunnerSoSe22.sceneGraph = ƒ.Project.resources["Graph|2022-05-05T11:28:13.576Z|03522"];
            let cmpCamera = new ƒ.ComponentCamera();
            EndlessMatrixRunnerSoSe22.configurations = await fetchData();
            let canvas = document.querySelector("canvas");
            viewport = new ƒ.Viewport();
            viewport.initialize("Viewport", EndlessMatrixRunnerSoSe22.sceneGraph, cmpCamera, canvas);
            EndlessMatrixRunnerSoSe22.sceneGraph = viewport.getBranch();
            // let playerprefab: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-05-05T12:50:15.258Z|71678"];
            // let prefabinstance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(playerprefab);
            // sceneGraph.addChild(prefabinstance);
            EndlessMatrixRunnerSoSe22.playerNode = new EndlessMatrixRunnerSoSe22.Agent(new ƒ.Vector3(0, 0, 0));
            EndlessMatrixRunnerSoSe22.sceneGraph.addChild(EndlessMatrixRunnerSoSe22.playerNode);
            cameraNode = new ƒ.Node("cameraNode");
            cameraNode.addComponent(cmpCamera);
            cameraNode.addComponent(new ƒ.ComponentTransform);
            cameraNode.addComponent(new EndlessMatrixRunnerSoSe22.CameraScript);
            EndlessMatrixRunnerSoSe22.sceneGraph.addChild(cameraNode);
            let floorelement = new EndlessMatrixRunnerSoSe22.FloorElement(new ƒ.Vector3(0, 0, 0));
            console.log(floorelement);
            //let obstacleplatform: ObstaclePlatform = new ObstaclePlatform(new ƒ.Vector3(20, 2, 0));
            //console.log(obstacleplatform);
            //sceneGraph.addChild(obstacleplatform);
            platformSpawner = new EndlessMatrixRunnerSoSe22.PlatformSpawner(40);
            console.log(platformSpawner);
            viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
            ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        }
        function update(_event) {
            ƒ.Physics.simulate(); // if physics is included and used
            EndlessMatrixRunnerSoSe22.deltaTime = ƒ.Loop.timeFrameReal / 1000;
            // //make sure all terrain objects have a proper collisiongroup assigned
            // let platformNodes: ƒ.Node[] = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildrenByName("ObstaclePlatform");
            // platformNodes.forEach(platform => {
            //   platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2; //all ground objects are collision group 2
            //   platform.getChildrenByName("Obstacle").forEach(edgeobstacle => {
            //     edgeobstacle.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_3; //all obstacles are collision group 3
            //     //console.log("EdgeObstacle received collision group");
            //   });
            // }); //all items should have collision group 4 and all npcs have collision group 5
            if (EndlessMatrixRunnerSoSe22.GameState.get().gameRunning) {
                //controllGround();
                EndlessMatrixRunnerSoSe22.GameState.get().highscore += 1 * EndlessMatrixRunnerSoSe22.deltaTime;
                //console.log(Math.floor(GameState.get().highscore));
            }
            else if (!EndlessMatrixRunnerSoSe22.GameState.get().gameRunning) {
                startGame();
            }
            viewport.draw();
            ƒ.AudioManager.default.update();
        }
        async function startGame() {
            // console.log(sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length);
            // if (sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length == 0) {
            //   console.log("#1");
            //   let ground: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
            //   let newGroundNode: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(ground);
            //   newGroundNode.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
            //   newGroundNode.name = "Ground";
            //   sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
            //   console.log("Created first ground segment");
            // }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
                EndlessMatrixRunnerSoSe22.GameState.get().gameRunning = true;
                EndlessMatrixRunnerSoSe22.GameState.get().highscore = 0;
            }
        }
        // tslint:disable-next-line: typedef
        async function fetchData() {
            try {
                // tslint:disable-next-line: typedef
                const response = await fetch("../configuration.JSON");
                // tslint:disable-next-line: typedef
                const responseObj = await response.json();
                return responseObj;
            }
            catch (error) {
                return error;
            }
        }
    }
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    class ObstaclePlatform extends ƒ.Node {
        receivedCoin = false;
        constructor(position, receiveEdgeObstacles) {
            super("ObstaclePlatform");
            this.name = "ObstaclePlatform";
            let elementtransform = new ƒ.ComponentTransform;
            this.addComponent(elementtransform);
            let elementmesh = ƒ.Project.resources["MeshCube|2022-05-05T11:29:50.067Z|61589"];
            let elementmeshcmp = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(4, 1, 2);
            this.addComponent(elementmeshcmp);
            let elementmat = ƒ.Project.resources["Material|2022-05-05T11:30:27.621Z|27233"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(2, 0.5));
            this.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
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
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].addChild(this);
            //console.log(sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren().length);
        }
        createObstacleElement(position, rotation, scale) {
            let obstacleNode = new ƒ.Node("Obstacle");
            this.addChild(obstacleNode);
            let elementtransform = new ƒ.ComponentTransform;
            elementtransform.mtxLocal.translation = position;
            elementtransform.mtxLocal.scaling = scale;
            elementtransform.mtxLocal.rotation = rotation;
            obstacleNode.addComponent(elementtransform);
            let elementmesh = ƒ.Project.resources["MeshPyramid|2022-05-05T12:03:50.249Z|59428"];
            obstacleNode.addComponent(new ƒ.ComponentMesh(elementmesh));
            let elementmat = ƒ.Project.resources["Material|2022-05-05T12:03:08.224Z|13509"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(1, 2));
            obstacleNode.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.PYRAMID;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_3;
            obstacleNode.addComponent(elementrb);
        }
    }
    EndlessMatrixRunnerSoSe22.ObstaclePlatform = ObstaclePlatform;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class PlatformRemover extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PlatformRemover);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "PlatformRemover added to ";
        platformnodes;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.platformnodes = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
            //console.log(this.platformnodes.length);
            this.platformnodes.forEach(platform => {
                this.checkPlayerPosition(platform);
            });
        };
        checkPlayerPosition = (_platformnode) => {
            //console.log("Playerposition: " + playerNode.mtxLocal.translation.x);
            //console.log("Platformposition: " + this.node.mtxLocal.translation.x);
            if (this.node.mtxLocal.translation.x - 20 >= _platformnode.mtxLocal.translation.x) {
                // console.log(this.platformnodes.length);
                // _platformnode.removeComponent(_platformnode.getComponent(ƒ.ComponentRigidbody));
                // _platformnode.getChildren().forEach(child => {
                // child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
                // });
                // _platformnode.removeAllChildren();
                EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeChild(_platformnode);
                // console.log("Removed platform segment");
                // console.log(this.platformnodes.length);
            }
        };
    }
    EndlessMatrixRunnerSoSe22.PlatformRemover = PlatformRemover;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    class PlatformSpawner extends ƒ.Node {
        constructor(distancefromplayer) {
            super("PlatformSpawner");
            this.addComponent(new ƒ.ComponentTransform);
            this.mtxLocal.translateX(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x + distancefromplayer);
            this.mtxLocal.translateY(2);
            this.addComponent(new EndlessMatrixRunnerSoSe22.PlatformSpawnerScript(distancefromplayer));
        }
    }
    EndlessMatrixRunnerSoSe22.PlatformSpawner = PlatformSpawner;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class PlatformSpawnerScript extends ƒ.ComponentScript {
        // includes the behavior for spawning predefined combinations of platforms
        // Register the script as component for use in the editor via drag&drop
        //public static readonly iSubclass: number = ƒ.Component.registerSubclass(PlatformSpawnerScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "PlatformSpawnerScript added to ";
        distancefromplayer;
        spawnactivationcounter = 0;
        currentplatforms;
        //private currentplatformswithcoin: ƒ.Node[];
        //private platformGraph: ƒ.Graph;
        constructor(_distancefromplayer) {
            super();
            this.distancefromplayer = _distancefromplayer;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.currentplatforms = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
            this.node.mtxLocal.translation.x = EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x + this.distancefromplayer;
            this.createRandomPlatformAmount();
            this.addCoinsToPlatforms();
        };
        createRandomPlatformAmount() {
            if (EndlessMatrixRunnerSoSe22.GameState.get().gameRunning && EndlessMatrixRunnerSoSe22.playerNode.getComponent(ƒ.ComponentRigidbody).getVelocity().x > 1) {
                let random = new ƒ.Random();
                let randomnumber = random.getRangeFloored(0, EndlessMatrixRunnerSoSe22.playerNode.getComponent(EndlessMatrixRunnerSoSe22.PlayerMovement).ctrlForward.getOutput());
                this.spawnactivationcounter += randomnumber;
                //console.log(this.spawnactivationcounter);
                if (this.spawnactivationcounter >= 1000 && this.currentplatforms.length <= 10) {
                    random = new ƒ.Random();
                    randomnumber = random.getRangeFloored(0, 100);
                    //console.log(randomnumber);
                    switch (true) {
                        case (randomnumber && randomnumber < 45):
                            this.spawnNewPlatform(0, 0, true);
                            console.log("Spawned one platform");
                            this.spawnactivationcounter = 0;
                            break;
                        case (45 <= randomnumber && randomnumber < 70):
                            this.spawnNewPlatform(0, 0, true);
                            this.spawnNewPlatform(15, 4, true);
                            console.log("Spawned two platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (70 <= randomnumber && randomnumber < 100):
                            this.spawnNewPlatform(0, 0, true);
                            this.spawnNewPlatform(15, 4, true);
                            this.spawnNewPlatform(30, 0, false);
                            console.log("Spawned three platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        // case (73 <= randomnumber && randomnumber < 83) :
                        //   this.spawnNewPlatform(0, 0);
                        //   this.spawnNewPlatform(15, 4);
                        //   this.spawnNewPlatform(30, 0);
                        //   this.spawnNewPlatform(25, 7);
                        //   console.log("Spawned four platforms");
                        //   this.spawnactivationcounter = 0;
                        //   break;
                        // case (83 <= randomnumber && randomnumber < 90) :
                        //   this.spawnNewPlatform(0, 0);
                        //   this.spawnNewPlatform(15, 4);
                        //   this.spawnNewPlatform(30, 0);
                        //   this.spawnNewPlatform(25, 7);
                        //   this.spawnNewPlatform(35, 4);
                        //   console.log("Spawned five platforms");
                        //   this.spawnactivationcounter = 0;
                        //   break;
                        // case (90 <= randomnumber && randomnumber < 96) :
                        //   this.spawnNewPlatform(0, 0);
                        //   this.spawnNewPlatform(15, 4);
                        //   this.spawnNewPlatform(30, 0);
                        //   this.spawnNewPlatform(25, 7);
                        //   this.spawnNewPlatform(35, 4);
                        //   this.spawnNewPlatform(45, 7);
                        //   console.log("Spawned six platforms");
                        //   this.spawnactivationcounter = 0;
                        //   break;
                        // case (96 <= randomnumber && randomnumber < 100) :
                        //   this.spawnNewPlatform(0, 0);
                        //   this.spawnNewPlatform(15, 4);
                        //   this.spawnNewPlatform(30, 0);
                        //   this.spawnNewPlatform(25, 7);
                        //   this.spawnNewPlatform(35, 4);
                        //   this.spawnNewPlatform(45, 7);
                        //   this.spawnNewPlatform(60, 4);
                        //   console.log("Spawned seven platforms");
                        //   this.spawnactivationcounter = 0;
                        //   break;
                        default:
                            break;
                    }
                    this.currentplatforms = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
                }
            }
        }
        spawnNewPlatform = async (xposfrombottomline, yposfrombottomline, receiveEdgeObstacles) => {
            let newPlatformNode = new EndlessMatrixRunnerSoSe22.ObstaclePlatform(ƒ.Vector3.ZERO(), receiveEdgeObstacles);
            newPlatformNode.mtxLocal.translation =
                new ƒ.Vector3(this.node.mtxLocal.translation.x + xposfrombottomline, this.node.mtxLocal.translation.y + yposfrombottomline + 2, this.node.mtxLocal.translation.z);
            newPlatformNode.name = "Platform";
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].addChild(newPlatformNode);
            console.log("Added platform segment");
        };
        addCoinsToPlatforms() {
            this.currentplatforms.forEach(platform => {
                if (platform.getChildrenByName("Coin").length == 0 && platform.mtxLocal.translation.x - 30 > EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.x) {
                    let random = new ƒ.Random();
                    let randomnumber = random.getRangeFloored(0, 200);
                    if (randomnumber == 1) {
                        let newcoin = new EndlessMatrixRunnerSoSe22.Coin(platform);
                    }
                }
            });
        }
    }
    EndlessMatrixRunnerSoSe22.PlatformSpawnerScript = PlatformSpawnerScript;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
var EndlessMatrixRunnerSoSe22;
(function (EndlessMatrixRunnerSoSe22) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunnerSoSe22); // Register the namespace to FUDGE for serialization
    class PlayerMovement extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PlayerMovement);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "PlayerMovement added to ";
        ctrlForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
        ctrlJump = new ƒ.Control("Jump", 1, 2 /* DIFFERENTIAL */);
        isJumpPressed = false;
        //private canDash: boolean = true;
        //private groundRB: ƒ.ComponentRigidbody;
        cmpPlayerRb;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            this.ctrlForward.setDelay(0);
            //this.groundRB = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0].getComponent(ƒ.ComponentRigidbody);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.cmpPlayerRb = EndlessMatrixRunnerSoSe22.playerNode.getComponent(ƒ.ComponentRigidbody);
            this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.ctrlJump.setDelay(EndlessMatrixRunnerSoSe22.deltaTime * 1000 - 1);
            if (EndlessMatrixRunnerSoSe22.GameState.get().gameRunning) {
                this.ctrlForward.setInput(EndlessMatrixRunnerSoSe22.configurations.maxspeed);
                //this.cmpPlayerRb.setVelocity(new ƒ.Vector3(this.ctrlForward.getOutput(), this.cmpPlayerRb.getVelocity().y, this.cmpPlayerRb.getVelocity().z));
                this.cmpPlayerRb.applyForce(ƒ.Vector3.SCALE(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));
                let isGrounded = false;
                let playerCollisions = this.cmpPlayerRb.collisions;
                playerCollisions.forEach(collider => {
                    switch (collider.collisionGroup) {
                        case ƒ.COLLISION_GROUP.GROUP_2: //Ground elements
                            isGrounded = true;
                            break;
                        case ƒ.COLLISION_GROUP.GROUP_3: //Obstacles
                            this.respawn();
                            console.log("Obstacle hit");
                            break;
                        case ƒ.COLLISION_GROUP.GROUP_4:
                            console.log("Coin collected");
                        default:
                            break;
                    }
                });
                this.ctrlJump.setInput(ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE]));
                if ((this.ctrlJump.getOutput() == 1) && !this.isJumpPressed) {
                    this.isJumpPressed = true;
                    //console.log(this.ctrlJump.getOutput());
                }
                else {
                    this.isJumpPressed = false;
                    //console.log(this.ctrlJump.getOutput());
                }
                if (this.isJumpPressed && isGrounded) {
                    //playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), 300));
                    // let velocityvector: ƒ.Vector3 = this.cmpPlayerRb.getVelocity();
                    // velocityvector.y = 20;
                    // this.cmpPlayerRb.setVelocity(velocityvector);
                    this.cmpPlayerRb.applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.getY(), 400));
                    console.log("Jump from ground");
                    return;
                }
                else if (this.isJumpPressed && !isGrounded) {
                    this.cmpPlayerRb.applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.getY(), -400));
                    console.log("Dive towards ground");
                }
            }
        };
        respawn = () => {
            //this.node.mtxLocal.translation = new ƒ.Vector3(0, 2.2, 0);
            this.cmpPlayerRb.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.cmpPlayerRb.setPosition(new ƒ.Vector3(0, 2.2, 0));
            EndlessMatrixRunnerSoSe22.GameState.get().gameRunning = false;
            let platforms = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0];
            platforms.removeAllChildren();
            // let platforms: ƒ.Node[] = sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildren();
            // platforms.forEach(platform => {
            //   platform.removeComponent(platform.getComponent(ƒ.ComponentRigidbody));
            //   platform.getChildrenByName("Obstacle").forEach(child => {
            //     child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
            //     });
            // });
            // sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeAllChildren();
            // let groundsegments: ƒ.Node[] = sceneGraph.getChildrenByName("FloorElements")[0].getChildren();
            // groundsegments.forEach(groundsegment => {
            //   groundsegment.removeComponent(groundsegment.getComponent(ƒ.ComponentRigidbody));
            // });
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].removeAllChildren();
            let firstfloorelement = new EndlessMatrixRunnerSoSe22.FloorElement(new ƒ.Vector3(0, 0, 0));
            console.log(firstfloorelement);
        };
    }
    EndlessMatrixRunnerSoSe22.PlayerMovement = PlayerMovement;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
//# sourceMappingURL=Script.js.map