interface IPoint {
  X: number;
  Y: number;
}

class Point implements IPoint {
  private readonly _x: number;
  private readonly _y: number;

  constructor(x: number = -1, y: number = -1) {
    this._x = x;
    this._y = y;
  }

  get X() {
    return this._x;
  }

  get Y() {
    return this._y;
  }

  static default() {
    return new Point();
  }
}

export {
  IPoint, Point
};
