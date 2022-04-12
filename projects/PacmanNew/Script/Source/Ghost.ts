namespace PacmanNew {
    import ƒ = FudgeCore;

    export class Ghost extends ƒ.Node {
        public name: string = "Ghost";
        public direction: ƒ.Vector2 = ƒ.Vector2.ZERO();
        public speed: number = 0.02;
        public grid: ƒ.Node;

        constructor(_grid: ƒ.Node) {
            super("Ghost");
            let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
            let material: ƒ.Material = new ƒ.Material("MaterialGhost", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");

            this.addComponent(cmpMaterial);
            this.addComponent(cmpMesh);
            this.addComponent(cmpTransfrom);

            this.mtxLocal.translateX(3);
            cmpTransfrom.mtxLocal.translateY(2);

            this.grid = _grid;
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        public update = (_event: Event): void => {
            this.walkInRandomDir();
        }

        public walkInRandomDir(): void {
            let randomDirection: number = Math.floor(Math.random() * 4);
            let posPacman: ƒ.Vector3 = this.mtxLocal.translation;
            let nearestGridPoint: ƒ.Vector2 = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
            let nearGridPoint: boolean = posPacman.toVector2().equals(nearestGridPoint, 2 * this.speed);

            if (nearGridPoint) {
                let directionOld: ƒ.Vector2 = this.direction.clone;
                if (randomDirection == 1) {
                    this.direction.set(1, 0);
                }
                if (randomDirection == 2) {
                    this.direction.set(-1, 0);
                }
                if (randomDirection == 3)
                    this.direction.set(0, 1);
                if (randomDirection == 0)
                    this.direction.set(0, -1);


                if (this.blocked(ƒ.Vector2.SUM(nearestGridPoint, this.direction)))
                    if (this.direction.equals(directionOld)) {// did not turn
                        //this.direction.set(0, 0); // full stop
                        this.walkInRandomDir();

                    } else {
                        if (this.blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) { // wrong turn and dead end
                            //this.direction.set(0, 0); // full stop
                            this.walkInRandomDir();
                        } else
                            this.direction = directionOld; // don't turn but continue ahead
                    }

                if (!this.direction.equals(directionOld) || this.direction.equals(ƒ.Vector2.ZERO()))
                    this.mtxLocal.translation = nearestGridPoint.toVector3();

            }

            this.mtxLocal.translate(ƒ.Vector2.SCALE(this.direction, this.speed).toVector3());

        }

        public blocked(_posCheck: ƒ.Vector2): boolean {
            let check: ƒ.Node = this.grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
            return (!check || check.name == "Wall");
          }



    }

}