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
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let sceneGraph;
    let grid;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraPosParameter = 1;
    let direction = ƒ.Vector2.ZERO();
    let speed = 0.05;
    //let root: ƒ.Node;
    let animations;
    let spriteNode;
    let spriteOriginalScale;
    //let agentMoveSpeedFactor: number = 5;
    //let deltaTime: number;
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
        //set up pacman sprite
        await loadSprites();
        spriteNode = new ƒAid.NodeSprite("Sprite");
        spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteNode.mtxLocal.translateZ(0.1);
        //spriteNode.addComponent(new ƒ.ComponentMesh(new ƒ.MeshSprite));
        spriteNode.setAnimation(animations["pacman"]);
        spriteNode.setFrameDirection(1);
        spriteOriginalScale = spriteNode.mtxLocal.scaling.toVector2();
        PacmanNew.playerAgent.addChild(spriteNode);
        console.log(PacmanNew.playerAgent);
        document.addEventListener("keydown", hndKeyDown); //document keyboard event listener
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        //deltaTime = ƒ.Loop.timeFrameReal / 1000;
        ƒ.AudioManager.default.update();
        //movementcontrol
        let sounds = sceneGraph.getChildrenByName("AudioListener")[0].getComponents(ƒ.ComponentAudio); //array with audios
        let posPacman = PacmanNew.playerAgent.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);
        if (nearGridPoint) {
            let directionOld = direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
                direction.set(1, 0);
                changeSpriteLookDirection("east");
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                direction.set(-1, 0);
                changeSpriteLookDirection("west");
            }
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
        }
        PacmanNew.playerAgent.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed).toVector3());
        viewport.draw();
        switchCamMode(cameraPosParameter);
    }
    function switchCamMode(camSetting) {
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
    function hndKeyDown(_e) {
        if (_e.key == " " ||
            _e.code == "Space") {
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
    async function loadSprites() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Script/Sprites/texture.png");
        let spriteSheet = new ƒ.CoatTextured(ƒ.Color.CSS("White"), imgSpriteSheet);
        generateSprites(spriteSheet);
    }
    function generateSprites(_spritesheet) {
        animations = {};
        //this.animations = {};
        let name = "pacman";
        let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 60, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        animations[name] = sprite;
    }
    function changeSpriteLookDirection(lookdirection) {
        //spriteNode.mtxLocal.scaleX = spriteOriginalScale.;
        switch (lookdirection) {
            case "east":
                break;
            case "north":
                break;
            case "west":
                spriteNode.mtxLocal.scaleX(-1);
                break;
            case "south":
                break;
            default:
                break;
        }
    }
})(PacmanNew || (PacmanNew = {}));
//# sourceMappingURL=Script.js.map