"use strict";
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
            let playerprefab = ƒ.Project.resources["Graph|2022-05-05T12:50:15.258Z|71678"];
            let prefabinstance = await ƒ.Project.createGraphInstance(playerprefab);
            EndlessMatrixRunnerSoSe22.sceneGraph.addChild(prefabinstance);
            EndlessMatrixRunnerSoSe22.playerNode = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("PlayerBody")[0];
            cameraNode = new ƒ.Node("cameraNode");
            cameraNode.addComponent(cmpCamera);
            cameraNode.addComponent(new ƒ.ComponentTransform);
            cameraNode.addComponent(new EndlessMatrixRunnerSoSe22.CameraScript);
            EndlessMatrixRunnerSoSe22.sceneGraph.addChild(cameraNode);
            viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
            ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        }
        function update(_event) {
            ƒ.Physics.simulate(); // if physics is included and used
            EndlessMatrixRunnerSoSe22.deltaTime = ƒ.Loop.timeFrameReal / 1000;
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
        async function fetchData() {
            try {
                const response = await fetch("../configuration.JSON");
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
            let platforms = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
            platforms.forEach(platform => {
                platform.removeComponent(platform.getComponent(ƒ.ComponentRigidbody));
                platform.getChildrenByName("EdgeObstacle").forEach(child => {
                    child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
                });
            });
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].removeAllChildren();
            let groundsegments = EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildren();
            groundsegments.forEach(groundsegment => {
                groundsegment.removeComponent(groundsegment.getComponent(ƒ.ComponentRigidbody));
            });
            EndlessMatrixRunnerSoSe22.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].removeAllChildren();
        };
    }
    EndlessMatrixRunnerSoSe22.PlayerMovement = PlayerMovement;
})(EndlessMatrixRunnerSoSe22 || (EndlessMatrixRunnerSoSe22 = {}));
//# sourceMappingURL=Script.js.map