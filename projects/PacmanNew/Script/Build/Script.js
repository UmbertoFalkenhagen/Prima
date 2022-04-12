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
    class Ghost extends ƒ.Node {
        name = "Ghost";
        direction = ƒ.Vector2.ZERO();
        speed = 0.02;
        grid;
        constructor(_grid) {
            super("Ghost");
            let mesh = new ƒ.MeshSphere();
            let material = new ƒ.Material("MaterialGhost", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpTransfrom = new ƒ.ComponentTransform();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
            this.addComponent(cmpMaterial);
            this.addComponent(cmpMesh);
            this.addComponent(cmpTransfrom);
            this.mtxLocal.translateX(3);
            cmpTransfrom.mtxLocal.translateY(2);
            this.grid = _grid;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.walkInRandomDir();
        };
        walkInRandomDir() {
            let randomDirection = Math.floor(Math.random() * 4);
            let posPacman = this.mtxLocal.translation;
            let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
            let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * this.speed);
            if (nearGridPoint) {
                let directionOld = this.direction.clone;
                if (randomDirection == 1) {
                    this.direction.set(1, 0);
                }
                if (randomDirection == 2) {
                    this.direction.set(-1, 0);
                }
                if (randomDirection == 3)
                    this.direction.set(0, 1);
                if (randomDirection == 0)
                    this.direction.set(0, -1);
                if (this.blocked(ƒ.Vector2.SUM(nearestGridPoint, this.direction)))
                    if (this.direction.equals(directionOld)) { // did not turn
                        //this.direction.set(0, 0); // full stop
                        this.walkInRandomDir();
                    }
                    else {
                        if (this.blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) { // wrong turn and dead end
                            //this.direction.set(0, 0); // full stop
                            this.walkInRandomDir();
                        }
                        else
                            this.direction = directionOld; // don't turn but continue ahead
                    }
                if (!this.direction.equals(directionOld) || this.direction.equals(ƒ.Vector2.ZERO()))
                    this.mtxLocal.translation = nearestGridPoint.toVector3();
            }
            this.mtxLocal.translate(ƒ.Vector2.SCALE(this.direction, this.speed).toVector3());
        }
        blocked(_posCheck) {
            let check = this.grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
            return (!check || check.name == "Wall");
        }
    }
    PacmanNew.Ghost = Ghost;
})(PacmanNew || (PacmanNew = {}));
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
    let ghost;
    let direction = ƒ.Vector2.ZERO();
    let speed = 0.05;
    //let root: ƒ.Node;
    let spriteNode;
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
        spriteNode = await createSprite();
        PacmanNew.playerAgent.addChild(spriteNode);
        console.log(PacmanNew.playerAgent);
        ghost = new PacmanNew.Ghost(grid);
        sceneGraph.addChild(ghost);
        document.addEventListener("keydown", hndKeyDown); //document keyboard event listener
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        //return null;
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
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                direction.set(-1, 0);
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
        if (direction.magnitudeSquared != 0) {
            spriteNode.mtxLocal.reset();
            spriteNode.mtxLocal.translateZ(0.1);
            spriteNode.mtxLocal.rotation = new ƒ.Vector3(0, direction.x < 0 ? 180 : 0, direction.y * 90);
        }
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
    async function createSprite() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Script/Sprites/texture.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("Pacman", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        let sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 15;
        let cmpTransfrom = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        sprite.mtxLocal.translateZ(0.1);
        return sprite;
    }
})(PacmanNew || (PacmanNew = {}));
//# sourceMappingURL=Script.js.map