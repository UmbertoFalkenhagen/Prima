"use strict";
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Slenderman); // Register the namespace to FUDGE for serialization
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
    Slenderman.CustomComponentScript = CustomComponentScript;
})(Slenderman || (Slenderman = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let sceneGraph;
    let avatar;
    let cmpCamera;
    let speedRotY = -0.2;
    let speedRotX = 0.2;
    let rotationX = 0;
    let ctrlWalk = new ƒ.Control("ctrlWalk", 2, 0 /* PROPORTIONAL */);
    let ctrlStrafe = new ƒ.Control("ctrlStrafe", 2, 0 /* PROPORTIONAL */);
    let exhaustion = 0;
    let canSprint = true;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Slenderman.viewport = _event.detail;
        sceneGraph = Slenderman.viewport.getBranch();
        avatar = Slenderman.viewport.getBranch().getChildrenByName("PlayerAgent")[0];
        //console.log(avatar);
        Slenderman.viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        console.log(Slenderman.viewport.camera);
        let treepos = new ƒ.Vector2(40, 10);
        let treescale = new ƒ.Vector3(5, 10, 10);
        createTree(treepos, treescale);
        //console.log(treenode);
        Slenderman.viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        controlWalk();
        controlSpeed();
        Slenderman.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrlWalk.setInput(input);
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrlStrafe.setInput(strafe);
        //console.log(canSprint);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
            ctrlWalk.setFactor(20);
            ctrlStrafe.setFactor(20);
            ctrlWalk.setDelay(500);
            ctrlStrafe.setDelay(500);
        }
        else {
            ctrlWalk.setFactor(8);
            ctrlStrafe.setFactor(8);
            ctrlWalk.setDelay(200);
            ctrlStrafe.setDelay(200);
        }
        if (input == 0 && strafe == 0) {
            ctrlWalk.setDelay(200);
            ctrlStrafe.setDelay(200);
        }
        avatar.mtxLocal.translateZ(ctrlWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        avatar.mtxLocal.translateX(ctrlStrafe.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        /* cntWalk.setInput(strafe);
        avatar.mtxLocal.translateX(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000); */
    }
    function hndPointerMove(_event) {
        avatar.mtxLocal.rotateY(_event.movementX * speedRotY);
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function controlSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
            exhaustion += ƒ.Loop.timeFrameGame / 1000;
            if (exhaustion > 10) {
                canSprint = false;
                setTimeout(function () {
                    canSprint = true;
                    exhaustion = 0;
                }, 7000);
            }
        }
    }
    async function createTree(_treepos, _scalefactor) {
        //instantiate new tree from prefab
        let treegraph = ƒ.Project.resources["Graph|2022-04-26T14:32:47.257Z|97095"];
        let instance = await ƒ.Project.createGraphInstance(treegraph);
        sceneGraph.addChild(instance);
        //add treecomponent and place/scale tree
        let treecomponent = new Slenderman.TreeComponent;
        instance.addComponent(treecomponent);
        treecomponent.placeTree(_treepos, _scalefactor);
    }
})(Slenderman || (Slenderman = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    class Tree extends ƒ.GraphInstance {
        treepos = new ƒ.Vector3;
        scalefactor = new ƒ.Vector3;
        constructor(_treepos, _scalefactor) {
            super();
            this.treepos = _treepos;
            this.scalefactor = _scalefactor;
            //let treegraph: ƒ.Graph = <ƒ.Graph> ƒ.Project.resources["Graph|2022-04-26T14:32:47.257Z|97095"]; 
        }
    }
    Slenderman.Tree = Tree;
})(Slenderman || (Slenderman = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Slenderman); // Register the namespace to FUDGE for serialization
    class TreeComponent extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(TreeComponent);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "TreeComponent added to ";
        treepos = new ƒ.Vector3;
        scalefactor = new ƒ.Vector3;
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
        placeTree(_treepos, _scalefactor) {
            //place tree at given x and z coordinates
            this.treepos.x = _treepos.x;
            this.treepos.z = _treepos.y;
            this.node.mtxLocal.translation.x = this.treepos.x;
            this.node.mtxLocal.translation.z = this.treepos.y;
            //scale tree according to given values
            this.scalefactor = _scalefactor;
            this.node.mtxLocal.scaling = this.scalefactor;
            //place tree on terrain height at coordinates
            let mtxTerrain;
            let meshTerrain;
            let cmpMeshTerrain = Slenderman.viewport.getBranch().getChildrenByName("Floor")[0].getComponent(ƒ.ComponentMesh);
            meshTerrain = cmpMeshTerrain.mesh;
            mtxTerrain = cmpMeshTerrain.mtxWorld;
            let posStem = this.node.getChildrenByName("Stem")[0].getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posStem, mtxTerrain);
            console.log(terrainInfo);
            let height = posStem.y - terrainInfo.position.y;
            this.node.mtxLocal.translateY((-height / this.node.mtxLocal.scaling.y) - 0.2);
        }
    }
    Slenderman.TreeComponent = TreeComponent;
})(Slenderman || (Slenderman = {}));
//# sourceMappingURL=Script.js.map