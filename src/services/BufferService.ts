import { GLService } from "./GLService";
import { SingletonService } from "./SingletonService";

export interface Buffers {
  position: WebGLBuffer;
}

export class BufferService extends SingletonService {
  private buffers: Buffers;

  constructor() {
    super();
    this.buffers = this.initializeBuffers();
  }

  public static getBuffers() {
    return BufferService.getInstance().buffers;
  }

  public static destroy() {}

  private initializeBuffers() {
    const context = GLService.getContext();
    if (!context) return;

    const positionBuffer = this.createPositionBuffer(context);

    return {
      position: positionBuffer
    };
  }

  private createPositionBuffer(context: WebGLRenderingContext) {
    const positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
    return positionBuffer;
  }
}
