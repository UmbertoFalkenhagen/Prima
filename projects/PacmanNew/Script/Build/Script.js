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
    let grid;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraPosParameter = 1;
    let direction = ƒ.Vector2.ZERO();
    let speed = 0.5;
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
        cameraNode = new ƒ.Node("cameraNode");
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform);
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.translateZ(-20);
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
        grid = sceneGraph.getChildrenByName("Grid")[0];
        document.addEventListener("keydown", hndKeyDown); //document keyboard event listener
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        deltaTime = ƒ.Loop.timeFrameReal / 1000;
        ƒ.AudioManager.default.update();
        //movementcontrol
        // let playerposition: ƒ.Vector3 = playerAgent.mtxLocal.translation;
        // let playerradius: number = playerAgent.getComponent(ƒ.ComponentMesh).radius;
        // let gridwidth: number = sceneGraph.getChildrenByName("Grid")[0].getChildrenByName("GridRow(1)")[0].getChildren().length * 1.1;
        // let gridheight: number = sceneGraph.getChildrenByName("Grid")[0].getChildren().length * 1.1;
        let sounds = sceneGraph.getChildrenByName("AudioListener")[0].getComponents(ƒ.ComponentAudio); //array with audios
        // let inputYvalue: number = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) 
        // + (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        // if (inputYvalue < 0) {
        //   if (!((playerposition.y - playerradius) < 0)) {
        //     ctrlY.setInput(inputYvalue);
        //     playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
        //     } else {
        //       console.log("collision bottom");
        //       if (!sounds[1].isPlaying) {
        //         sounds[1].play(true);
        //       }
        //     }
        // } else if (inputYvalue > 0) {
        //   if (!((playerposition.y + playerradius) >  gridheight)) {
        //     ctrlY.setInput(inputYvalue);
        //     playerAgent.mtxLocal.translateY(ctrlY.getOutput() * deltaTime * agentMoveSpeedFactor);
        //   } else {
        //     console.log("collision top");
        //     if (!sounds[1].isPlaying) {
        //       sounds[1].play(true);
        //     }
        //   }
        // }
        // let inputXvalue: number = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
        // + (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        // if (inputXvalue < 0) {
        //   if (!((playerposition.x - playerradius) < 0)) {
        //     ctrlX.setInput(inputXvalue);
        //     playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
        //     } else {
        //       console.log("collision left");
        //       if (!sounds[1].isPlaying) {
        //         sounds[1].play(true);
        //       }
        //     }
        // } else if (inputXvalue > 0) {
        //   if (!((playerposition.x + playerradius) >  gridwidth)) {
        //     ctrlX.setInput(inputXvalue);
        //     playerAgent.mtxLocal.translateX(ctrlX.getOutput() * deltaTime * agentMoveSpeedFactor);
        //   } else {
        //     console.log("collision right");
        //     if (!sounds[1].isPlaying) {
        //       sounds[1].play(true);
        //     }
        //   }
        // }
        let posPacman = PacmanNew.playerAgent.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);
        if (nearGridPoint) {
            let directionOld = direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                direction.set(1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                direction.set(-1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                direction.set(0, 1);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                direction.set(0, -1);
            if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
                if (direction.equals(directionOld)) { // did not turn
                    direction.set(0, 0); // full stop
                    if (!sounds[1].isPlaying) {
                        sounds[1].play(true);
                    }
                }
                else {
                    if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) { // wrong turn and dead end
                        direction.set(0, 0); // full stop
                        if (!sounds[1].isPlaying) {
                            sounds[1].play(true);
                        }
                    }
                    else
                        direction = directionOld; // don't turn but continue ahead
                }
            if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
                PacmanNew.playerAgent.mtxLocal.translation = nearestGridPoint.toVector3();
            // if (direction.equals(ƒ.Vector2.ZERO()))
            //   waka.play(false);
            // else if (!waka.isPlaying)
            //   waka.play(true);
        }
        PacmanNew.playerAgent.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed * deltaTime * 5).toVector3());
        viewport.draw();
        switchCamMode(cameraPosParameter);
    }
    function switchCamMode(camSetting) {
        //let cmpCamera: ƒ.ComponentCamera  = cameraNode.getComponent(ƒ.ComponentCamera);
        switch (camSetting) {
            case 0:
                cameraNode.mtxLocal.mutate({
                    translation: new ƒ.Vector3(PacmanNew.playerAgent.mtxWorld.translation.x, PacmanNew.playerAgent.mtxWorld.translation.y, -10)
                });
                break;
            case 1:
                cameraNode.mtxLocal.mutate({
                    translation: new ƒ.Vector3(2, 2, -10)
                });
                break;
            default:
                console.log("Invalid camera position parameter");
                break;
        }
    }
    function hndKeyDown(e) {
        if (e.key == " " ||
            e.code == "Space") {
            if (cameraPosParameter == 0) {
                cameraPosParameter = 1;
            }
            else {
                cameraPosParameter = 0;
            }
        }
    }
    function blocked(_posCheck) {
        let check = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
        return (!check || check.name == "Wall");
    }
})(PacmanNew || (PacmanNew = {}));
//# sourceMappingURL=Script.js.map