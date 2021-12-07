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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let sceneGraph;
    let cart;
    let cameraNode;
    let body;
    let ctrForward = new ƒ.Control("Forward", 7000, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 1000, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
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
        cart = sceneGraph.getChildrenByName("Agent")[0];
        //kart.mtxLocal.translateX(5);
        //sceneGraph.appendChild(cart);
        let kartTransform = cart.getComponent(ƒ.ComponentTransform);
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
        body = cart.getComponent(ƒ.ComponentRigidbody);
        //kart.addComponent(cmpCamera);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateZ(-20);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(10);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(360);
        // cameraNode.getComponent(ƒ.ComponentTransform).mtxLocal.rotateX(20);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        cart.getComponent(ƒ.ComponentRigidbody).applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        cart.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));
        let maxHeight = 0.3;
        let minHeight = 0.2;
        let forceNodes = cart.getChildren();
        let force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -body.mass / forceNodes.length);
        for (let forceNode of forceNodes) {
            let posForce = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
            let height = posForce.y - terrainInfo.position.y;
            if (height < maxHeight)
                body.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
        }
        // let springRestingDistance: number = 1;
        // let forceNodes: ƒ.Node[] = cart.getChildren();
        // let springForce: number = -body.mass * ƒ.Physics.world.getGravity().y;
        // for (let forceNode of forceNodes) {
        //   let posForce: ƒ.Vector3 = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
        //   let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
        //   let currentDeviation: number;
        //   currentDeviation = posForce.y - terrainInfo.position.y;
        //   let force: ƒ.Vector3 = ƒ.Vector3.ZERO();
        //   let currentforce: number = calculateSpringForce(springRestingDistance, springForce, currentDeviation);
        //   // force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), currentforce);
        //   // //force = ƒ.Vector3.SCALE(force, deltaTime);
        //   force.y = currentforce;
        //   body.applyForceAtPoint(force, posForce);
        //   //body.applyForceAtPoint(ƒ.Physics.world.getGravity(), posForce);
        // } 
        placeCameraOnCart();
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function placeCameraOnCart() {
        cameraNode.mtxLocal.mutate({
            translation: cart.mtxWorld.translation,
            rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0)
        });
    }
    // function calculateSpringForce(_restingDistance: number, _springForceConstant: number, _currentDeviation: number): number { 
    // // resting distance describes the height at which the spring does not excert any force
    // // the spring force constant describes the force that is excerted per 1 metre of pulling/compressing the spring by 1 unit
    // // the current deviation describes the current compression/extension of the spring
    //    let currentForce: number = (_restingDistance - _currentDeviation) * _springForceConstant;
    // //   console.log (currentForce);
    //    return currentForce;
    // }
})(MarioKart || (MarioKart = {}));
//# sourceMappingURL=Script.js.map