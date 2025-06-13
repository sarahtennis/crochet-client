import { SingletonService } from "./SingletonService";

import { GLService } from "./GLService";
import { TextureService } from "./TextureService";

// Vertex colors (white -> pink -> lime green -> blue)
const vertexColors4Vertices = [
  1.0, 1.0, 1.0, 1.0, 1.0, 0.03, 0.53, 1.0, 0.33, 1.0, 0.14, 1.0, 0.0, 0.46,
  1.0, 1.0,
];

// Vertices, 2D
const positions2Components = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

// Colors for 6 faces
const faceColors: Colors[] = [
  [1.0, 1.0, 1.0, 1.0], // Front face: white
  [1.0, 0.0, 0.0, 1.0], // Back face: red
  [0.0, 1.0, 0.0, 1.0], // Top face: green
  [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
  [1.0, 1.0, 0.0, 1.0], // Right face: yellow
  [1.0, 0.0, 1.0, 1.0], // Left face: purple
];

// Face vertices (3 coordinates per vertex per face)
const positions3Components = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];

type Colors = number[];

export interface Buffers {
  position: WebGLBuffer;
  indices: WebGLBuffer;
  color?: WebGLBuffer;
  textureCoord?: WebGLBuffer;
}

export class BufferService extends SingletonService {
  private buffers: Buffers;

  constructor() {
    super();
    const context = GLService.getContext();
    if (!context) return;

    this.buffers = this.initializeBuffers(context);
    // Load texture
    TextureService.loadTexture(
      context,
      __dirname + 'images/circuit-board.svg',
    );
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
  }

  public static getBuffers() {
    return BufferService.getInstance().buffers;
  }

  public static destroy() {}

  private initializeBuffers(context: WebGLRenderingContext) {
    return {
      position: BufferService.createPositionBuffer(context),
      // color: BufferService.createColorBuffer(context),
      indices: BufferService.createIndexBuffer(context),
      textureCoord: BufferService.createTextureBuffer(context),
    };
  }

  private static transformFaceColorsToVertexColors(
    faceColors: Colors[],
    vertexCountPerFace: number
  ) {
    // Convert the array of colors into a table for all the vertices.
    let vertexColors: Colors = [];

    for (const color of faceColors) {
      // Repeat each color four times for the four vertices of the face
      for (let x = 0; x < vertexCountPerFace; x++) {
        vertexColors = vertexColors.concat(color);
      }
    }

    return vertexColors;
  }

  private static createIndexBuffer(context: WebGLRenderingContext) {
    const indexBuffer = context.createBuffer();
    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    // prettier-ignore
    const indices = [
         0,  1,  2,      0,  2,  3,    // front
         4,  5,  6,      4,  6,  7,    // back
         8,  9,  10,     8,  10, 11,   // top
         12, 13, 14,     12, 14, 15,   // bottom
         16, 17, 18,     16, 18, 19,   // right
         20, 21, 22,     20, 22, 23,   // left
      ];

    // Now send the element array to GL
    context.bufferData(
      context.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      context.STATIC_DRAW
    );

    return indexBuffer;
  }

  private static createPositionBuffer(context: WebGLRenderingContext) {
    const positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

    const positions = positions3Components;

    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array(positions),
      context.STATIC_DRAW
    );
    return positionBuffer;
  }

  private static createColorBuffer(context: WebGLRenderingContext) {
    const colorBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);

    const colors = BufferService.transformFaceColorsToVertexColors(
      faceColors,
      4
    );

    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array(colors),
      context.STATIC_DRAW
    );

    return colorBuffer;
  }

  private static createTextureBuffer(context: WebGLRenderingContext) {
    const textureCoordBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      context.STATIC_DRAW
    );

    return textureCoordBuffer;
  }
}
