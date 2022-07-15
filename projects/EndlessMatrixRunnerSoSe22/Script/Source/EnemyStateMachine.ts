namespace EndlessMatrixRunnerSoSe22 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum JOB {
        IDLE, ATTACK, DIE
    }

    export class EnemyStateMachine extends ƒAid.ComponentStateMachine<JOB> {
        private static instructions: ƒAid.StateMachineInstructions<JOB> = EnemyStateMachine.get();
        public timePeriod: number = 0;
        constructor() {
            super();
            this.instructions = EnemyStateMachine.instructions;

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);

        }

        public static get(): ƒAid.StateMachineInstructions<JOB> {
            let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
            setup.transitDefault = EnemyStateMachine.transitDefault;
            setup.actDefault = EnemyStateMachine.actDefault;
            setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
            setup.setAction(JOB.ATTACK, <ƒ.General>this.actAttack);
            setup.setAction(JOB.DIE, <ƒ.General>this.actDie);

            return setup;
        }

        private static actDefault(): void {
            //dconsole.log("Goomba default");
        }

        private static actAttack(_machine: EnemyStateMachine): void {
            
            _machine.node.getComponent(ƒ.ComponentRigidbody).applyForce(new ƒ.Vector3 (-100, 0, 0));

            if (playerNode.mtxLocal.translation.x - 10 >= _machine.node.mtxLocal.translation.x) {
                _machine.transit(JOB.DIE);
            }
        }

        private static actIdle(_machine: EnemyStateMachine): void {
            _machine.node.getComponent(ƒ.ComponentRigidbody).applyTorque(new ƒ.Vector3(5, 0, 0));
            let pushforce: ƒ.Vector3 = playerNode.getComponent(ƒ.ComponentRigidbody).getVelocity();
            pushforce.y = 0;
            pushforce.z = 0;
            _machine.node.getComponent(ƒ.ComponentRigidbody).setVelocity(pushforce);
            //console.log("Hallo ich lebe!");
            if (_machine.timePeriod >= 6) {
                _machine.transit(JOB.ATTACK);
            } else if (_machine.timePeriod >= 3 && _machine.timePeriod < 5) {
                let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-07-15T12:15:38.997Z|21886"];
                _machine.node.removeComponent( _machine.node.getComponent(ƒ.ComponentMaterial));
                let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
                _machine.node.addComponent(elementmatcmp);
            } else if (_machine.timePeriod >= 5 && _machine.timePeriod < 6) {
                let elementmat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2022-07-15T12:10:50.126Z|04547"];
                _machine.node.removeComponent( _machine.node.getComponent(ƒ.ComponentMaterial));
                let elementmatcmp: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(elementmat);
                _machine.node.addComponent(elementmatcmp);
                _machine.node.dispatchEvent(new CustomEvent("enemyEvent", { bubbles: true }));
            }
            _machine.timePeriod += deltaTime;
            
        }

        private static actDie(_machine: EnemyStateMachine): void {
            
            _machine.node.getParent().removeChild(_machine.node);
        }

        private static transitDefault(_machine: EnemyStateMachine): void {
            //console.log("Transit to", _machine.stateNext);
        }

        private hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    this.transit(JOB.IDLE);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    break;
            }
        }

        private update = (_event: Event): void => {
            this.act();
        }
    }
}