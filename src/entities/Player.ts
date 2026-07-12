import { Animation } from "@/engine/animation/Animation";
import { Input } from "@/engine/input/Input";
import { Key } from "@/engine/input/Key";
import { Sprite } from "@/engine/animation/Sprite";

import { Direction } from "./Direction";
import { Entity } from "./Entity";

export class Player extends Entity {
  private static readonly SPEED = 1;
  private static readonly JUMP_DURATION = 260;
  private static readonly JUMP_FRAME = 3;

  private readonly idleAnimation = new Animation([0], 150);
  private readonly walkAnimation = new Animation([0, 1, 0, 2], 150);

  private nextX = 0;
  private nextY = 0;
  private jumping = false;
  private jumpElapsed = 0;
  private jumpStartX = 0;
  private jumpStartY = 0;
  private jumpTargetX = 0;
  private jumpTargetY = 0;
  private scriptedMoving = false;
  private scriptedElapsed = 0;
  private scriptedDuration = 0;
  private scriptedStartX = 0;
  private scriptedStartY = 0;
  private scriptedTargetX = 0;
  private scriptedTargetY = 0;
  private scriptedFadeOut = false;
  private renderOpacity = 1;

  private warpCooldown = 0;

  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly shadow: HTMLImageElement,
    private readonly input: Input,
  ) {
    super(x, y, 16, 16, sprite);
    this.nextX = x;
    this.nextY = y;
  }

  public update(deltaTime: number): void {
    if (this.warpCooldown > 0) {
      this.warpCooldown -= deltaTime;
    }

    if (this.scriptedMoving) {
      this.updateScriptedMove(deltaTime);
      return;
    }

    if (this.jumping) {
      this.updateJump(deltaTime);
      return;
    }

    let moving = false;

    this.nextX = this.x;
    this.nextY = this.y;

    if (this.input.isPressed(Key.Up)) {
      this.direction = Direction.Up;
      this.nextY -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Down)) {
      this.direction = Direction.Down;
      this.nextY += Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Left)) {
      this.direction = Direction.Left;
      this.nextX -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Right)) {
      this.direction = Direction.Right;
      this.nextX += Player.SPEED;
      moving = true;
    }

    if (moving) {
      this.walkAnimation.update(deltaTime);
    } else {
      this.walkAnimation.reset();
    }
  }

  public canWarp(): boolean {
    return this.warpCooldown <= 0;
  }

  public resetWarpCooldown(): void {
    this.warpCooldown = 500;
  }

  public override getCurrentFrame(): HTMLImageElement {
    if (this.jumping) {
      return this.sprite.getFrame(this.direction, Player.JUMP_FRAME);
    }

    return this.sprite.getFrame(
      this.direction,
      this.scriptedMoving || this.inputMoving()
        ? this.walkAnimation.getFrame()
        : this.idleAnimation.getFrame(),
    );
  }

  private inputMoving(): boolean {
    return (
      this.input.isPressed(Key.Up) ||
      this.input.isPressed(Key.Down) ||
      this.input.isPressed(Key.Left) ||
      this.input.isPressed(Key.Right)
    );
  }

  public getNextPosition(): { x: number; y: number } {
    return {
      x: this.nextX,
      y: this.nextY,
    };
  }

  public override setPosition(x: number, y: number): void {
    super.setPosition(x, y);

    this.nextX = x;
    this.nextY = y;
    this.renderOpacity = 1;
  }

  public isJumping(): boolean {
    return this.jumping;
  }

  public getJumpShadowFrame(): HTMLImageElement {
    return this.shadow;
  }

  public getJumpShadowX(): number {
    return this.x + this.width / 2 - this.shadow.width / 2;
  }

  public getJumpShadowY(): number {
    return this.y + 12;
  }

  public isScriptedMoving(): boolean {
    return this.scriptedMoving;
  }

  public getRenderOpacity(): number {
    return this.renderOpacity;
  }

  public face(direction: Direction): void {
    this.direction = direction;
  }

  public startScriptedMove(
    targetX: number,
    targetY: number,
    direction: Direction,
    duration: number,
    fadeOut: boolean,
  ): void {
    this.direction = direction;
    this.scriptedMoving = true;
    this.scriptedElapsed = 0;
    this.scriptedDuration = Math.max(1, duration);
    this.scriptedStartX = this.x;
    this.scriptedStartY = this.y;
    this.scriptedTargetX = targetX;
    this.scriptedTargetY = targetY;
    this.scriptedFadeOut = fadeOut;
    this.nextX = this.x;
    this.nextY = this.y;
    this.renderOpacity = 1;
    this.walkAnimation.reset();
  }

  public startJump(targetX: number, targetY: number): void {
    if (this.jumping) {
      return;
    }

    this.direction = Direction.Down;
    this.jumping = true;
    this.jumpElapsed = 0;
    this.jumpStartX = this.x;
    this.jumpStartY = this.y;
    this.jumpTargetX = targetX;
    this.jumpTargetY = targetY;
    this.nextX = this.x;
    this.nextY = this.y;
    this.walkAnimation.reset();
  }

  private updateJump(deltaTime: number): void {
    this.jumpElapsed += deltaTime;

    const progress = Math.min(this.jumpElapsed / Player.JUMP_DURATION, 1);
    const x = this.jumpStartX + (this.jumpTargetX - this.jumpStartX) * progress;
    const y = this.jumpStartY + (this.jumpTargetY - this.jumpStartY) * progress;

    super.setPosition(x, y);
    this.nextX = x;
    this.nextY = y;

    if (progress >= 1) {
      this.jumping = false;
      this.setPosition(this.jumpTargetX, this.jumpTargetY);
    }
  }

  private updateScriptedMove(deltaTime: number): void {
    this.scriptedElapsed += deltaTime;
    this.walkAnimation.update(deltaTime);

    const progress = Math.min(this.scriptedElapsed / this.scriptedDuration, 1);
    const x = this.scriptedStartX + (this.scriptedTargetX - this.scriptedStartX) * progress;
    const y = this.scriptedStartY + (this.scriptedTargetY - this.scriptedStartY) * progress;

    super.setPosition(x, y);
    this.nextX = x;
    this.nextY = y;
    this.renderOpacity = this.scriptedFadeOut ? 1 - progress : 1;

    if (progress >= 1) {
      this.scriptedMoving = false;
      super.setPosition(this.scriptedTargetX, this.scriptedTargetY);
      this.nextX = this.scriptedTargetX;
      this.nextY = this.scriptedTargetY;
      this.renderOpacity = this.scriptedFadeOut ? 0 : 1;
      this.walkAnimation.reset();
    }
  }

  public getFacingTile(): { x: number; y: number } {
    let column = Math.floor(this.getCollisionX() / 16);
    let row = Math.floor(this.getCollisionY() / 16);

    switch (this.direction) {
      case Direction.Up:
        row--;
        break;

      case Direction.Down:
        row++;
        break;

      case Direction.Left:
        column--;
        break;

      case Direction.Right:
        column++;
        break;
    }

    return {
      x: column * 16,
      y: row * 16,
    };
  }

  public override getCollisionX(): number {
    return this.x + 4;
  }

  public override getCollisionY(): number {
    return this.y + 6;
  }

  public override getCollisionWidth(): number {
    return 8;
  }

  public override getCollisionHeight(): number {
    return 7;
  }

  public getDirection(): Direction {
    return this.direction;
  }
}
