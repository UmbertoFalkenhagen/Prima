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
            elementrb.mass = 30;
            elementrb.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CAPSULE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
            elementrb.restitution = 0.1;
            this.addComponent(elementrb);
            this.addComponent(new EndlessMatrixRunnerSoSe22.PlayerMovement());
            this.mtxWorld.translation = position;
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
            this.node.mtxLocal.translation.z = EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation.z + 30;
            this.node.mtxLocal.lookAt(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.translation);
        };
    }
    EndlessMatrixRunnerSoSe22.CameraScript = CameraScript;
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
        constructor(scale) {
            super("FloorElement");
            this.addComponent(new ƒ.ComponentTransform);
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
            this.mtxLocal.scale(scale);
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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
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
            let floorelement = new EndlessMatrixRunnerSoSe22.FloorElement(new ƒ.Vector3(20, 1, 2));
            EndlessMatrixRunnerSoSe22.sceneGraph.addChild(floorelement);
            //let obstacleplatform: ObstaclePlatform = new ObstaclePlatform();
            //sceneGraph.addChild(obstacleplatform);
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
        constructor() {
            super("ObstaclePlatform");
            this.addComponent(new ƒ.ComponentTransform);
            let elementmesh = ƒ.Project.resources["MeshCube|2022-05-05T11:29:50.067Z|61589"];
            let elementmeshcmp = new ƒ.ComponentMesh(elementmesh);
            elementmeshcmp.mtxPivot.scaling = new ƒ.Vector3(4, 1, 2);
            this.addComponent(elementmeshcmp);
            let elementmat = ƒ.Project.resources["Material|2022-05-05T11:30:27.621Z|27233"];
            let elementmatcmp = new ƒ.ComponentMaterial(elementmat);
            elementmatcmp.mtxPivot.scale(new ƒ.Vector2(2, 0.5));
            this.addComponent(elementmatcmp);
            let elementrb = new ƒ.ComponentRigidbody();
            elementrb.initialization = ƒ.BODY_INIT.TO_MESH;
            elementrb.mass = 1;
            elementrb.typeBody = ƒ.BODY_TYPE.STATIC;
            elementrb.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            elementrb.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
            this.addComponent(elementrb);
            this.mtxLocal.translateY(3);
            this.createObstacleElement(new ƒ.Vector3(-2, 0, -0.75), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(1, 0.7, 0.5));
            this.createObstacleElement(new ƒ.Vector3(-2, 0, 0.75), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(1, 0.7, 0.5));
            this.createObstacleElement(new ƒ.Vector3(-2, 0, 0), new ƒ.Vector3(0, 0, 90), new ƒ.Vector3(1, 1, 1));
        }
        createObstacleElement(position, rotation, scale) {
            let obstacleNode = new ƒ.Node("Obstacle");
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
            this.addChild(obstacleNode);
        }
    }
    EndlessMatrixRunnerSoSe22.ObstaclePlatform = ObstaclePlatform;
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
        ctrlJump = new ƒ.Control("Jump", 1, 2 /* DIFFERENTIAL */);
        isJumpPressed = false;
        ctrlForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
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
            this.ctrlForward.setDelay(10);
            //this.groundRB = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0].getComponent(ƒ.ComponentRigidbody);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.cmpPlayerRb = EndlessMatrixRunnerSoSe22.playerNode.getComponent(ƒ.ComponentRigidbody);
            this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.ctrlJump.setDelay(EndlessMatrixRunnerSoSe22.deltaTime * 1000 - 1);
            if (EndlessMatrixRunnerSoSe22.GameState.get().gameRunning) {
                this.ctrlForward.setInput(EndlessMatrixRunnerSoSe22.configurations.initialspeed);
                EndlessMatrixRunnerSoSe22.playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));
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
                    let velocityvector = this.cmpPlayerRb.getVelocity();
                    velocityvector.y = 20;
                    this.cmpPlayerRb.setVelocity(velocityvector);
                    console.log("Jump from ground");
                    return;
                }
                else if (this.isJumpPressed && !isGrounded) {
                    EndlessMatrixRunnerSoSe22.playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunnerSoSe22.playerNode.mtxLocal.getY(), -400));
                    console.log("Dive towards ground");
                }
            }
        };
        respawn = () => {
            //this.node.mtxLocal.translation = new ƒ.Vector3(0, 2.2, 0);
            this.cmpPlayerRb.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.cmpPlayerRb.setPosition(new ƒ.Vector3(0, 2.2, 0));
            EndlessMatrixRunnerSoSe22.GameState.get().gameRunning = false;
            let platforms = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].getChildrenByName("ObstaclePlatform");
            platforms.forEach(platform => {
                platform.removeComponent(platform.getComponent(ƒ.ComponentRigidbody));
                platform.getChildrenByName("Obstacle").forEach(child => {
                    child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
                });
            });
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Obstacles")[0].getChildrenByName("Platforms")[0].removeAllChildren();
            let groundsegments = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("FloorElements")[0].getChildren();
            groundsegments.forEach(groundsegment => {
                groundsegment.removeComponent(groundsegment.getComponent(ƒ.ComponentRigidbody));
            });
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Floorelements")[0].removeAllChildren();
        };
    }
    EndlessMatrixRunnerSoSe22.PlayerMovement = PlayerMovement;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
//# sourceMappingURL=Script.js.map