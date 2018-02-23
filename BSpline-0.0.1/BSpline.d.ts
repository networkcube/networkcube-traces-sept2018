export = BSpline
export as namespace BSpline;

declare namespace BSpline {
    types Point: number[];
    export class BSpline {
        constructor(points: Point[], degree: number, copy: boolean);
        seqAt(dim: number): Point;
        basisDeg2(x: number): number;
        basisDeg3(x: number): number;
        basisDeg4(x: number): number;
        basisDeg5(x: number): number;
        getInterpol(seq: number[], t: number): number;
        calcAt(t: number): Point;
    }
}

