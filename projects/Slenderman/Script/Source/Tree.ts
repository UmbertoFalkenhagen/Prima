namespace Slenderman {
    import ƒ = FudgeCore;

    export class Tree extends ƒ.GraphInstance {
        treepos: ƒ.Vector3 = new ƒ.Vector3;
        scalefactor: ƒ.Vector3 = new ƒ.Vector3;

        constructor(_treepos: ƒ.Vector3, _scalefactor: ƒ.Vector3) {
            super();
            this.treepos = _treepos;
            this.scalefactor = _scalefactor;

            //let treegraph: ƒ.Graph = <ƒ.Graph> ƒ.Project.resources["Graph|2022-04-26T14:32:47.257Z|97095"]; 
          }
    }
}