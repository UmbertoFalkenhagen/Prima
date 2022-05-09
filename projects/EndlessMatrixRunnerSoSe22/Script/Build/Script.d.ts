declare namespace EndlessMatrixRunnerSoSe22 {
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
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static instance;
        name: string;
        highscore: number;
        gameRunning: boolean;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    let sceneGraph: ƒ.Node;
    let playerNode: ƒ.Node;
    let configurations: any;
    let deltaTime: number;
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class PlayerMovement extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private ctrlJump;
        private isJumpPressed;
        private ctrlForward;
        private cmpPlayerRb;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        respawn: () => void;
    }
}
