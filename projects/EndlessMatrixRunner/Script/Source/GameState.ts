namespace EndlessMatrixRunner {
    import ƒ = FudgeCore;
    //import ƒui = FudgeUserInterface;

    export class GameState extends ƒ.Mutable {
        //private static controller: ƒui.Controller;
        private static instance: GameState;
        public name: string = "EndlessMatrixRunner";
        public highscore: number = 0;
        public gameRunning: boolean = false;

        private constructor() {
            super();
            let domHud: HTMLDivElement = document.querySelector("#Hud");
            GameState.instance = this;
            //GameState.controller = new ƒui.Controller(this, domHud);
            //console.log("Hud-Controller", GameState.controller);
        }

        public static get(): GameState {
            return GameState.instance || new GameState();
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
}