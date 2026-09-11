export interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

export interface Stick {
  p1: Point;
  p2: Point;
  len: number;
}

export interface MouseState {
  x: number;
  y: number;
  down: boolean;
  target: Point | null;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}
