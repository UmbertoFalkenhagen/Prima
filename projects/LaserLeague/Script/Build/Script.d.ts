declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor();
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class CollisionDetector extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        viewport: ƒ.Viewport;
        deltaTime: number;
        agents: ƒ.Node[];
        sceneGraph: ƒ.Graph;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        checkCollision: (collider: ƒ.Node) => boolean;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class GameManager extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private static instance;
        message: string;
        deltaTime: number;
        agent: ƒ.Node;
        sceneGraph: ƒ.Node;
        constructor();
        static getInstance(): GameManager;
        hndEvent: (_event: Event) => void;
        start: () => void;
        update: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class LaserRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        rotationSpeed: number;
        deltaTime: number;
        sceneGraph: ƒ.Node;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        hndRotationChangeEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
