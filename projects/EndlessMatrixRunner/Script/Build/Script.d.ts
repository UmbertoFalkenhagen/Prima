declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class CameraScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    let sceneGraph: ƒ.Node;
    let playerNode: ƒ.Node;
    let groundNode: ƒ.Node;
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class PlayerMovement extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private ctrlJump;
        private ctrlForward;
        private canDash;
        private cmpPlayerRb;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
