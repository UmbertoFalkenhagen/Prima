"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
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
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var PacmanNew;
(function (PacmanNew) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let sceneGraph;
    let cameraNode = new ƒ.Node("cameraNode");
    let ctrlY = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrlY.setDelay(50);
    let ctrlX = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrlX.setDelay(50);
    let agentMoveSpeedFactor = 5;
    let deltaTime;
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
        sceneGraph = ƒ.Project.resources["Graph|2022-03-25T15:44:46.847Z|42436"];
        // setup Camera
        let cmpCamera = new ƒ.ComponentCamera();
        cameraNode = new ƒ.Node("cameraNode");
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform);
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.translateZ(-10);
        sceneGraph.addChild(cameraNode);
        //create new viewport with the camera node as main camera
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
        sceneGraph = viewport.getBranch();
        viewport.calculateTransforms();
        ƒ.AudioManager.default.listenTo(sceneGraph);
        ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));
        PacmanNew.playerAgent = sceneGraph.getChildrenByName("PlayerAgent")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        deltaTime = ƒ.Loop.timeFrameReal / 1000;
        ƒ.AudioManager.default.update();
        //movementcontrol
        let playerposition = PacmanNew.playerAgent.mtxLocal.translation;
        let playerradius = PacmanNew.playerAgent.getComponent(ƒ.ComponentMesh).radius;
        let gridwidth = sceneGraph.getChildrenByName("Grid")[0].getChildrenByName("GridRow(1)")[0].getChildren().length * 1.1;
        let gridheight = sceneGraph.getChildrenByName("Grid")[0].getChildren().length * 1.1;
        let inputYvalue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        if (inputYvalue < 0) {
            if (!((playerposition.y - playerradius) < 0)) {
                ctrlY.setInput(inputYvalue);
                PacmanNew.playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
            }
            else {
                console.log("collision bottom");
            }
        }
        else if (inputYvalue > 0) {
            if (!((playerposition.y + playerradius) > gridheight)) {
                ctrlY.setInput(inputYvalue);
                PacmanNew.playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
            }
            else {
                console.log("collision top");
            }
        }
        let inputXvalue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            + (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        if (inputXvalue < 0) {
            if (!((playerposition.x - playerradius) < 0)) {
                ctrlX.setInput(inputXvalue);
                PacmanNew.playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
            }
            else {
                console.log("collision left");
            }
        }
        else if (inputXvalue > 0) {
            if (!((playerposition.x + playerradius) > gridwidth)) {
                ctrlX.setInput(inputXvalue);
                PacmanNew.playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
            }
            else {
                console.log("collision right");
            }
        }
        //bordercollisionscanner();
    }
})(PacmanNew || (PacmanNew = {}));
//# sourceMappingURL=Script.js.map