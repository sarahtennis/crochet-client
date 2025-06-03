import { GLService } from "./GLService";
import { SingletonService } from "./SingletonService";

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: GLint;
    vertexColor: GLint;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null;
    modelViewMatrix: WebGLUniformLocation | null;
  };
}

// Vertex shader
const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

// Fragment shader
const fsSource = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
`;

export class ShaderService extends SingletonService {
  private programInfo: ProgramInfo;
  constructor() {
    super();
    this.initShaderProgram(vsSource, fsSource);
  }

  public static getProgramInfo() {
    return ShaderService.getInstance().programInfo;
  }

  private initShaderProgram(vSource: string, fSource: string) {
    const context = GLService.getContext();
    const vertexShader = this.loadShader({
      context,
      type: context.VERTEX_SHADER,
      source: vSource,
    });
    const fragmentShader = this.loadShader({
      context,
      type: context.FRAGMENT_SHADER,
      source: fSource,
    });

    // Create the shader program
    const shaderProgram = context.createProgram();
    context.attachShader(shaderProgram, vertexShader);
    context.attachShader(shaderProgram, fragmentShader);
    context.linkProgram(shaderProgram);

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: context.getAttribLocation(
          shaderProgram,
          "aVertexPosition"
        ),
        vertexColor: context.getAttribLocation(shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        projectionMatrix: context.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix"
        ),
        modelViewMatrix: context.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix"
        ),
      },
    };

    // If creating the shader program failed, alert
    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
      throw new Error(
        `Unable to initial shader program: ${context.getProgramInfoLog(
          shaderProgram
        )}`
      );
    }
    return shaderProgram;
  }

  private loadShader(options: {
    context: WebGLRenderingContext;
    type: number;
    source: string;
  }) {
    const { context, type, source } = options;

    const shader = context.createShader(type);

    // Send the source to the shader object
    context.shaderSource(shader, source);

    // Compile the shader program
    context.compileShader(shader);

    // See if it compiled successfully
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${context.getShaderInfoLog(
          shader
        )}`
      );
      context.deleteShader(shader);
      return null;
    }

    return shader;
  }

  public static destroy() {}
}
