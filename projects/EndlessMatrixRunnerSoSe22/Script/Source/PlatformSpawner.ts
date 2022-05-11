namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;

    export class PlatformSpawner extends ƒ.Node { 
        public constructor(distancefromplayer: number) {
            super("PlatformSpawner");
            this.addComponent(new ƒ.ComponentTransform);
            this.mtxLocal.translateX(playerNode.mtxLocal.translation.x + distancefromplayer);
            this.mtxLocal.translateY(2);

            this.addComponent(new PlatformSpawnerScript(distancefromplayer));
        }
    }
}