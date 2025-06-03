import { GLService } from "./GLService";
import { SingletonService } from "./SingletonService";

export interface Buffers {
  position: WebGLBuffer;
  color: WebGLBuffer;
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
    const colorBuffer = this.createColorBuffer(context);

    return {
      position: positionBuffer,
      color: colorBuffer,
    };
  }

  private createPositionBuffer(context: WebGLRenderingContext) {
    const positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
    return positionBuffer;
  }

  private createColorBuffer(context: WebGLRenderingContext) {
    const colors = [
      1.0,
      1.0,
      1.0,
      1.0, // white
      1.0,
      0.03,
      0.53,
      1.0, // pink
      0.33,
      1.0,
      0.14,
      1.0, // lime green
      0.0,
      0.46,
      1.0,
      1.0, // blue
    ];
  
    const colorBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.STATIC_DRAW);
  
    return colorBuffer;
  }
}
