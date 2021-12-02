"use strict";
var MarioKart;
(function (MarioKart) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(MarioKart); // Register the namespace to FUDGE for serialization
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
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    MarioKart.CustomComponentScript = CustomComponentScript;
})(MarioKart || (MarioKart = {}));
var MarioKart;
(function (MarioKart) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(MarioKart); // Register the namespace to FUDGE for serialization
    class HeightMapGenerator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(HeightMapGenerator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "HeightMapGenerator added to ";
        heightMapSource;
        reliefMesh;
        map = new ƒ.Node("ownTarrain");
        graph = ƒ.Project.resources["Graph|2021-11-18T14:33:59.117Z|18376"];
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
            //this.reliefMesh = this.node.getComponent(ƒ.MeshRelief);
            this.generateTerrain();
            //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
        //public update = (_event: Event): void => {
        //}
        async generateTerrain() {
            this.heightMapSource = new ƒ.TextureImage();
            this.heightMapSource = FudgeCore.Project.resources["TextureImage|2021-11-23T10:35:25.413Z|13750"];
            //await this.heightMapSource.load("../Textures/heightmap_3.png");
            /*for (let x = 0; x < this.heightMapSource.; index++) {
              const element = array[index];
              
            }*/
            //let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            let mtrTexFlat = ƒ.Project.resources["Material|2021-11-23T02:36:34.207Z|12139"];
            let material = new ƒ.ComponentMaterial(mtrTexFlat);
            let gridMeshFlat = new ƒ.MeshRelief("HeightMap", this.heightMapSource);
            let grid = new ƒ.ComponentMesh(gridMeshFlat);
            console.log(grid);
            grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100));
            grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y);
            let transfom = new ƒ.ComponentTransform();
            this.map.addComponent(grid);
            this.map.addComponent(material);
            //this.map.addComponent(cmpRigidbody);
            this.map.addComponent(transfom);
            this.graph.addChild(this.map);
            //this.reliefMesh = new ƒ.MeshRelief("HeightMap", this.heightMapSource);
        }
    }
    MarioKart.HeightMapGenerator = HeightMapGenerator;
})(MarioKart || (MarioKart = {}));
var MarioKart;
(function (MarioKart) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let sceneGraph;
    let kart;
    let cameraNode;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Forward", 100, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(50);
    let mtxTerrain;
    let meshTerrain;
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
        sceneGraph = ƒ.Project.resources["Graph|2021-11-18T14:33:59.117Z|18376"];
        // setup Camera
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneGraph, cmpCamera, canvas);
        sceneGraph = viewport.getBranch();
        viewport.calculateTransforms();
        let cmpMeshTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        //console.log(sceneGraph);
        ƒ.AudioManager.default.listenTo(sceneGraph);
        ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(sceneGraph);
        ƒ.AudioManager.default.listenWith(sceneGraph.getComponent(ƒ.ComponentAudioListener));
        kart = ƒ.Project.resources["Graph|2021-11-22T11:02:19.072Z|64411"];
        //kart.mtxLocal.translateX(5);
        sceneGraph.appendChild(kart);
        let kartTransform = kart.getComponent(ƒ.ComponentTransform);
        kartTransform.mtxLocal.translateX(35);
        kartTransform.mtxLocal.translateY(5);
        kartTransform.mtxLocal.translateZ(45);
        kartTransform.mtxLocal.rotateY(-90);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, -12);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        cameraNode = new ƒ.Node("cameraNode");
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform);
        sceneGraph.addChild(cameraNode);
        //kart.addComponent(cmpCamera);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateZ(-20);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(10);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(360);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateX(20);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        kart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        kart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);
        let terrainInfo = meshTerrain.getTerrainInfo(kart.mtxLocal.translation, mtxTerrain);
        kart.mtxLocal.translation = terrainInfo.position;
        kart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);
        placeCameraOnCart();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function placeCameraOnCart() {
        cameraNode.mtxLocal.mutate({
            translation: kart.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, kart.mtxWorld.rotation.y, 0)
        });
    }
})(MarioKart || (MarioKart = {}));
//# sourceMappingURL=Script.js.map