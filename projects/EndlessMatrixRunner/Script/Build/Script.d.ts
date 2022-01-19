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
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class GroundControllerScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private groundGraph;
        private groundNodes;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        private checkPlayerPosition;
        private instantiateNewGroundSegmentAtPosition;
    }
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    let sceneGraph: ƒ.Node;
    let playerNode: ƒ.Node;
    let groundNode: ƒ.Node;
    let deltaTime: number;
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class ObstacleScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace EndlessMatrixRunner {
    class PlatformScript extends GroundControllerScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    class PlatformSpawnerScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private spawnactivationcounter;
        private platformGraph;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        spawnNewPlatform: (xposfrombottomline: number, yposfrombottomline: number) => Promise<void>;
    }
}
declare namespace EndlessMatrixRunner {
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
