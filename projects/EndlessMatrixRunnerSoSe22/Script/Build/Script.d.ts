declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor(position: ƒ.Vector3);
    }
}
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
    class Coin extends ƒ.Node {
        constructor(parenplatform: ƒ.Node);
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class CoinRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private minheight;
        private maxheight;
        private moveDir;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        hndPlayerCollision(): void;
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
    class Enemy extends ƒ.Node {
        constructor(position: ƒ.Vector3);
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ATTACK = 1,
        DIE = 2
    }
    class EnemyStateMachine extends ƒAid.ComponentStateMachine<JOB> {
        private static instructions;
        timePeriod: number;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static actDefault;
        private static actAttack;
        private static actIdle;
        private static actDie;
        private static transitDefault;
        private hndEvent;
        private update;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class FloorElement extends ƒ.Node {
        constructor(position: ƒ.Vector3);
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static instance;
        name: string;
        highscore: number;
        coinscounter: number;
        gameRunning: boolean;
        score: HTMLElement;
        coins: HTMLElement;
        private controller;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class GroundControllerScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private groundNodes;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        private checkPlayerPosition;
        private instantiateNewGroundSegmentAtPosition;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    let sceneGraph: ƒ.Node;
    let playerNode: Agent;
    let difficulty: number;
    let configurations: any;
    let deltaTime: number;
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class ObstaclePlatform extends ƒ.Node {
        receivedCoin: boolean;
        constructor(position: ƒ.Vector3, receiveEdgeObstacles: boolean);
        private createObstacleElement;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class PlatformRemover extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private platformnodes;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        private checkPlayerPosition;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class PlatformSpawner extends ƒ.Node {
        constructor(distancefromplayer: number);
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class PlatformSpawnerScript extends ƒ.ComponentScript {
        message: string;
        private distancefromplayer;
        private spawnactivationcounter;
        private currentplatforms;
        private spawnobstacles;
        constructor(_distancefromplayer: number);
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        createRandomPlatformAmount(): void;
        spawnNewPlatform: (xposfrombottomline: number, yposfrombottomline: number, receiveEdgeObstacles: boolean) => Promise<void>;
        spawnWithObstacles(): boolean;
        addCoinsToPlatforms(): void;
        spawnEnemy(iterator: number): void;
    }
}
declare namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    class PlayerMovement extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        ctrlForward: ƒ.Control;
        private ctrlJump;
        private isJumpPressed;
        private cmpPlayerRb;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
        respawn: () => void;
    }
}
