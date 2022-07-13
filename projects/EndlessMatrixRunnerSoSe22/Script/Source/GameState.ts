namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
    //import ƒui = FudgeUserInterface;

    export class GameState extends ƒ.Mutable {
        //private static controller: ƒui.Controller;
        private static instance: GameState;
        public name: string = "EndlessMatrixRunnerSoSe22";
        public highscore: number = 0;
        public coinscounter: number = 0;
        public gameRunning: boolean = false;
        public score: HTMLElement;
        public coins: HTMLElement;
        private controller: ƒUi.Controller;

        private constructor() {
            super();
            let domVui: HTMLDivElement = document.querySelector("div#vui");
            console.log(new ƒUi.Controller(this, domVui));
            this.controller = new ƒUi.Controller(this, domVui);
            this.controller.updateUserInterface();
            GameState.instance = this;

            this.score = document.getElementById("score");
            this.score.textContent = "Score: " + Math.floor(this.highscore);
            this.coins = document.getElementById("coins");
            this.coins.textContent = "Coins: " + this.coinscounter;

            //GameState.controller = new ƒui.Controller(this, domHud);
            //console.log("Hud-Controller", GameState.controller);
        }

        public static get(): GameState {
            return GameState.instance || new GameState();
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
}