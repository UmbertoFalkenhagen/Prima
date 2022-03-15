"use strict";
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
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
            this.node.mtxLocal.translation.y = EndlessMatrixRunner.playerNode.mtxLocal.translation.y + 7.5;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.node.mtxLocal.translation.x = EndlessMatrixRunner.playerNode.mtxLocal.translation.x;
            this.node.mtxLocal.translation.z = EndlessMatrixRunner.playerNode.mtxLocal.translation.z + 30;
            this.node.mtxLocal.lookAt(EndlessMatrixRunner.playerNode.mtxLocal.translation);
        };
    }
    EndlessMatrixRunner.CameraScript = CameraScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
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
        };
    }
    EndlessMatrixRunner.CustomComponentScript = CustomComponentScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    //import ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        //private static controller: ƒui.Controller;
        static instance;
        name = "EndlessMatrixRunner";
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
    EndlessMatrixRunner.GameState = GameState;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
    class GroundControllerScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(GroundControllerScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "GroundControllerScript added to ";
        groundGraph;
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
            this.node.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
        }
        update = (_event) => {
            if (EndlessMatrixRunner.GameState.get().gameRunning) {
                this.groundNodes = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground");
                //console.log(this.groundNodes.length);
                this.checkPlayerPosition();
            }
        };
        checkPlayerPosition = () => {
            if ((EndlessMatrixRunner.playerNode.mtxLocal.translation.x + 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2)
                && this.node == this.groundNodes[this.groundNodes.length - 1]) {
                let newgroundposition = this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x;
                this.instantiateNewGroundSegmentAtPosition(newgroundposition);
            }
            else if (EndlessMatrixRunner.playerNode.mtxLocal.translation.x - 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2
                && this.node == this.groundNodes[0]) {
                this.node.removeComponent(this.node.getComponent(ƒ.ComponentRigidbody));
                EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].removeChild(this.node);
                console.log("Removed ground segment");
            }
        };
        instantiateNewGroundSegmentAtPosition = async (xtranslation) => {
            this.groundGraph = ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
            let newGroundNode = await ƒ.Project.createGraphInstance(this.groundGraph);
            newGroundNode.mtxLocal.translation =
                new ƒ.Vector3(xtranslation, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.y, this.groundNodes[this.groundNodes.length - 1].mtxLocal.translation.z);
            newGroundNode.name = "Ground";
            EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
            console.log("Added ground segment");
        };
    }
    EndlessMatrixRunner.GroundControllerScript = GroundControllerScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    let viewport;
    let cameraNode;
    let ctrForward = new ƒ.Control("Forward", 100, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    ƒ.Debug.info("Main Program Template running!");
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
    }
    async function start() {
        await ƒ.Project.loadResourcesFromHTML();
        EndlessMatrixRunner.sceneGraph = ƒ.Project.resources["Graph|2021-12-21T17:37:49.295Z|21356"];
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", EndlessMatrixRunner.sceneGraph, cmpCamera, canvas);
        EndlessMatrixRunner.sceneGraph = viewport.getBranch();
        EndlessMatrixRunner.configurations = await fetchData();
        viewport.calculateTransforms();
        ƒ.AudioManager.default.listenTo(EndlessMatrixRunner.sceneGraph);
        ƒ.AudioManager.default.listenWith(EndlessMatrixRunner.sceneGraph.getComponent(ƒ.ComponentAudioListener));
        EndlessMatrixRunner.playerNode = EndlessMatrixRunner.sceneGraph.getChildrenByName("Player")[0];
        EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
        // groundNode = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0];
        // groundNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
        //cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
        //cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        cameraNode = new ƒ.Node("cameraNode");
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform);
        cameraNode.addComponent(new EndlessMatrixRunner.CameraScript);
        EndlessMatrixRunner.sceneGraph.addChild(cameraNode);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //make sure all terrain objects have a proper collisiongroup assigned
        let platformNode = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
        platformNode.forEach(platform => {
            platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2; //all ground objects are collision group 2
            platform.getChildrenByName("EdgeObstacle").forEach(edgeobstacle => {
                edgeobstacle.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_3; //all obstacles are collision group 3
                //console.log("EdgeObstacle received collision group");
            });
        }); //all items should have collision group 4 and all npcs have collision group 5
        EndlessMatrixRunner.deltaTime = ƒ.Loop.timeFrameReal / 1000;
        if (EndlessMatrixRunner.GameState.get().gameRunning) {
            //controllGround();
            EndlessMatrixRunner.GameState.get().highscore += 1 * EndlessMatrixRunner.deltaTime;
            //console.log(Math.floor(GameState.get().highscore));
        }
        else if (!EndlessMatrixRunner.GameState.get().gameRunning) {
            startGame();
        }
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function startGame() {
        console.log(EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length);
        if (EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildrenByName("Ground").length == 0) {
            console.log("#1");
            let ground = ƒ.Project.resources["Graph|2022-01-11T12:17:14.316Z|01096"];
            let newGroundNode = await ƒ.Project.createGraphInstance(ground);
            newGroundNode.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
            newGroundNode.name = "Ground";
            EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].addChild(newGroundNode);
            console.log("Created first ground segment");
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ENTER])) {
            EndlessMatrixRunner.GameState.get().gameRunning = true;
            EndlessMatrixRunner.GameState.get().highscore = 0;
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
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
    class ObstacleScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ObstacleScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "ObstacleScript added to ";
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
            this.node.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_3;
        }
        update = (_event) => {
        };
    }
    EndlessMatrixRunner.ObstacleScript = ObstacleScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
    class PlatformScript extends EndlessMatrixRunner.GroundControllerScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PlatformScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "PlatformScript added to ";
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
        update = (_event) => {
            if (EndlessMatrixRunner.playerNode.mtxLocal.translation.x - 15 >= this.node.mtxLocal.translation.x + this.node.mtxLocal.scaling.x / 2
                && this.node == EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform")[0]) {
                this.node.getChildren().forEach(child => {
                    child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
                });
                this.node.removeComponent(this.node.getComponent(ƒ.ComponentRigidbody));
                EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].removeChild(this.node);
                console.log("Removed platform");
            }
        };
    }
    EndlessMatrixRunner.PlatformScript = PlatformScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
    class PlatformSpawnerScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PlatformSpawnerScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "PlatformSpawnerScript added to ";
        spawnactivationcounter = 0;
        platformGraph;
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
            this.node.mtxLocal.translation.x = EndlessMatrixRunner.playerNode.mtxLocal.translation.x + 60;
            if (EndlessMatrixRunner.GameState.get().gameRunning) {
                this.spawnactivationcounter++;
                //console.log(this.spawnactivationcounter);
                if (this.spawnactivationcounter >= 300) {
                    let random = new ƒ.Random();
                    let randomnumber = random.getRangeFloored(0, 100);
                    //console.log(randomnumber);
                    switch (true) {
                        case (randomnumber < 25):
                            this.spawnactivationcounter = 0;
                            break;
                        case (25 <= randomnumber && randomnumber < 45):
                            this.spawnNewPlatform(0, 0);
                            console.log("Spawned one platform");
                            this.spawnactivationcounter = 0;
                            break;
                        case (45 <= randomnumber && randomnumber < 60):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            console.log("Spawned two platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (60 <= randomnumber && randomnumber < 73):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            this.spawnNewPlatform(30, 0);
                            console.log("Spawned three platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (73 <= randomnumber && randomnumber < 83):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            this.spawnNewPlatform(30, 0);
                            this.spawnNewPlatform(25, 9);
                            console.log("Spawned four platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (83 <= randomnumber && randomnumber < 90):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            this.spawnNewPlatform(30, 0);
                            this.spawnNewPlatform(25, 9);
                            this.spawnNewPlatform(35, 6);
                            console.log("Spawned five platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (90 <= randomnumber && randomnumber < 96):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            this.spawnNewPlatform(30, 0);
                            this.spawnNewPlatform(25, 9);
                            this.spawnNewPlatform(35, 6);
                            this.spawnNewPlatform(45, 9);
                            console.log("Spawned six platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        case (96 <= randomnumber && randomnumber < 100):
                            this.spawnNewPlatform(0, 0);
                            this.spawnNewPlatform(15, 6);
                            this.spawnNewPlatform(30, 0);
                            this.spawnNewPlatform(25, 9);
                            this.spawnNewPlatform(35, 6);
                            this.spawnNewPlatform(45, 9);
                            this.spawnNewPlatform(60, 6);
                            console.log("Spawned seven platforms");
                            this.spawnactivationcounter = 0;
                            break;
                        default:
                            break;
                    }
                }
            }
        };
        spawnNewPlatform = async (xposfrombottomline, yposfrombottomline) => {
            this.platformGraph = ƒ.Project.resources["Graph|2022-01-17T13:48:06.765Z|97422"];
            let newPlatformNode = await ƒ.Project.createGraphInstance(this.platformGraph);
            newPlatformNode.mtxLocal.translation =
                new ƒ.Vector3(this.node.mtxLocal.translation.x + xposfrombottomline, this.node.mtxLocal.translation.y + yposfrombottomline, this.node.mtxLocal.translation.z);
            newPlatformNode.name = "Platform";
            EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].addChild(newPlatformNode);
            console.log("Added platform segment");
        };
    }
    EndlessMatrixRunner.PlatformSpawnerScript = PlatformSpawnerScript;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
var EndlessMatrixRunner;
(function (EndlessMatrixRunner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(EndlessMatrixRunner); // Register the namespace to FUDGE for serialization
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
            this.cmpPlayerRb = EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody);
            this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.ctrlJump.setDelay(EndlessMatrixRunner.deltaTime * 1000 - 1);
            if (EndlessMatrixRunner.GameState.get().gameRunning) {
                this.ctrlForward.setInput(EndlessMatrixRunner.configurations.initialspeed);
                EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(EndlessMatrixRunner.playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));
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
                    EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunner.playerNode.mtxLocal.getY(), -400));
                    console.log("Dive towards ground");
                }
            }
        };
        respawn = () => {
            //this.node.mtxLocal.translation = new ƒ.Vector3(0, 2.2, 0);
            this.cmpPlayerRb.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.cmpPlayerRb.setPosition(new ƒ.Vector3(0, 2.2, 0));
            EndlessMatrixRunner.GameState.get().gameRunning = false;
            let platforms = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
            platforms.forEach(platform => {
                platform.removeComponent(platform.getComponent(ƒ.ComponentRigidbody));
                platform.getChildrenByName("EdgeObstacle").forEach(child => {
                    child.removeComponent(child.getComponent(ƒ.ComponentRigidbody));
                });
            });
            EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].removeAllChildren();
            let groundsegments = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].getChildren();
            groundsegments.forEach(groundsegment => {
                groundsegment.removeComponent(groundsegment.getComponent(ƒ.ComponentRigidbody));
            });
            EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("GroundSegments")[0].removeAllChildren();
        };
    }
    EndlessMatrixRunner.PlayerMovement = PlayerMovement;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
//# sourceMappingURL=Script.js.map