interface IPoint {
    X: number;
    Y: number;
}
declare class Point implements IPoint {
    private readonly _x;
    private readonly _y;
    constructor(x?: number, y?: number);
    get X(): number;
    get Y(): number;
    static default(): Point;
}
export { IPoint, Point };
//# sourceMappingURL=Point.d.ts.map