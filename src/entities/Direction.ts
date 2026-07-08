export enum Direction {
  Down,
  Left,
  Right,
  Up,
}

export function opposite(direction: Direction): Direction {
  switch (direction) {
    case Direction.Up:
      return Direction.Down;

    case Direction.Down:
      return Direction.Up;

    case Direction.Left:
      return Direction.Right;

    case Direction.Right:
      return Direction.Left;
  }
}
