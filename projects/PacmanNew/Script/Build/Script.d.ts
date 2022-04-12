declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace PacmanNew {
    import ƒ = FudgeCore;
    class Ghost extends ƒ.Node {
        name: string;
        direction: ƒ.Vector2;
        speed: number;
        grid: ƒ.Node;
        constructor(_grid: ƒ.Node);
        update: (_event: Event) => void;
        walkInRandomDir(): void;
        blocked(_posCheck: ƒ.Vector2): boolean;
    }
}
declare namespace PacmanNew {
    import ƒ = FudgeCore;
    let playerAgent: ƒ.Node;
}
