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
            this.node.mtxLocal.translation.z = EndlessMatrixRunner.playerNode.mtxLocal.translation.z + 20;
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
        viewport.calculateTransforms();
        ƒ.AudioManager.default.listenTo(EndlessMatrixRunner.sceneGraph);
        ƒ.AudioManager.default.listenWith(EndlessMatrixRunner.sceneGraph.getComponent(ƒ.ComponentAudioListener));
        EndlessMatrixRunner.playerNode = EndlessMatrixRunner.sceneGraph.getChildrenByName("Player")[0];
        EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_1;
        EndlessMatrixRunner.groundNode = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0];
        EndlessMatrixRunner.groundNode.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
        let platformNode = EndlessMatrixRunner.sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Platforms")[0].getChildrenByName("Platform");
        platformNode.forEach(platform => {
            platform.getComponent(ƒ.ComponentRigidbody).collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
        });
        //cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
        //cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        cameraNode = new ƒ.Node("cameraNode");
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform);
        cameraNode.addComponent(new EndlessMatrixRunner.CameraScript);
        EndlessMatrixRunner.sceneGraph.addChild(cameraNode);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let forward = 1;
        ctrForward.setInput(forward);
        let movementVector = ƒ.Vector3.ZERO();
        movementVector.x = ctrForward.getOutput();
        EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(movementVector);
        controllGround();
        //setUpCamera();
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controllGround() {
    }
    function setUpCamera() {
        cameraNode.mtxLocal.mutate({
            translation: EndlessMatrixRunner.playerNode.mtxWorld.translation
        });
    }
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
        ctrlJump = new ƒ.Control("Jump", 1, 0 /* PROPORTIONAL */);
        ctrlForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
        canDash = true;
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
            //this.ctrlJump.setDelay(250);
            this.ctrlForward.setDelay(10);
            //this.groundRB = sceneGraph.getChildrenByName("Terrain")[0].getChildrenByName("Ground")[0].getComponent(ƒ.ComponentRigidbody);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.cmpPlayerRb = EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody);
            this.cmpPlayerRb.effectRotation = new ƒ.Vector3(0, 0, 0);
            let deltaTime = ƒ.Loop.timeFrameReal / 1000;
            this.ctrlForward.setInput(10);
            let isGrounded = false;
            let canJumpMidair;
            let playerCollisions = this.cmpPlayerRb.collisions;
            playerCollisions.forEach(collider => {
                if (collider.collisionGroup == ƒ.COLLISION_GROUP.GROUP_2) {
                    isGrounded = true;
                    canJumpMidair = true;
                    console.log("Is grounded");
                }
            });
            // = this.checkCollision(groundNode);
            let isJumpPressed = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]);
            if (isJumpPressed && isGrounded) {
                this.ctrlJump.setInput(30);
                EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunner.playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
                console.log("Jumped from ground");
                return;
            }
            else if (isJumpPressed && !isGrounded) {
                this.ctrlJump.setInput(-30);
                EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(EndlessMatrixRunner.playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
                console.log("Jumped midair");
            }
            //playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(playerNode.mtxLocal.getY(), this.ctrlJump.getOutput()));
            //playerNode.mtxLocal.translateX(this.ctrlForward.getOutput() * deltaTime);
            EndlessMatrixRunner.playerNode.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(EndlessMatrixRunner.playerNode.mtxLocal.getX(), this.ctrlForward.getOutput()));
        };
    }
    EndlessMatrixRunner.PlayerMovement = PlayerMovement;
})(EndlessMatrixRunner || (EndlessMatrixRunner = {}));
//# sourceMappingURL=Script.js.map