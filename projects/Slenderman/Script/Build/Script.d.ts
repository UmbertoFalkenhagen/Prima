declare namespace Slenderman {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Slenderman {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Slenderman {
    import ƒ = FudgeCore;
    class Tree extends ƒ.GraphInstance {
        treepos: ƒ.Vector3;
        scalefactor: ƒ.Vector3;
        constructor(_treepos: ƒ.Vector3, _scalefactor: ƒ.Vector3);
    }
}
declare namespace Slenderman {
    import ƒ = FudgeCore;
    class TreeComponent extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private treepos;
        private scalefactor;
        constructor();
        hndEvent: (_event: Event) => void;
        placeTree(_treepos: ƒ.Vector2, _scalefactor: ƒ.Vector3): void;
    }
}
