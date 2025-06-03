import { SingletonService } from "./SingletonService";

export class GLService extends SingletonService {
  private canvas: HTMLCanvasElement;
  private context: WebGLRenderingContext;

  constructor() {
    super();
    this.initializeContext();
  }

  private initializeContext() {
    this.canvas = <HTMLCanvasElement>document.getElementById("gl-canvas");
    if (this.canvas) {
      this.context = this.canvas.getContext("webgl");
    }
    if (!this.context) {
      throw new Error("Unable to initialize WebGL");
    }
    this.canvas.addEventListener(
      "webglcontextlost",
      () => {
        // Context lost
        throw new Error("Context lost");
      },
      false
    );
  }

  public static getContext() {
    return GLService.getInstance().context || null;
  }

  public static destroy() {}
}
