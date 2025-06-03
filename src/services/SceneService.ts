import { mat4 } from 'gl-matrix';

import { Buffers, BufferService } from "./BufferService";
import { GLService } from "./GLService";
import { SingletonService } from "./SingletonService";
import { ProgramInfo, ShaderService } from './ShaderService';

export class SceneService extends SingletonService {
  constructor() {
    super();
  }

  public static drawScene() {
    const context = GLService.getContext();
    if (!context) return;

    context.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    context.clearDepth(1.0);                // Clear everything
    context.enable(context.DEPTH_TEST);     // Enable depth testing
    context.depthFunc(context.LEQUAL);      // Near things obscure far things
    
    // Clear the canvas
    context.clear(context.COLOR_BUFFER_BIT || context.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = context.canvas.width / context.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    // note: glMatrix always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
    
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [-0.0, 0.0, -6.0],
    ); // amount to translate
    
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    const buffers = BufferService.getBuffers();
    const programInfo = ShaderService.getProgramInfo();
    SceneService.setPositionAttribute(context, buffers, programInfo);
    SceneService.setColorAttribute(context, buffers, programInfo);
    
    // Tell WebGL to use our program when drawing
    context.useProgram(programInfo.program);
    
    // Set the shader uniforms
    context.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    context.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );
      {
        const offset = 0;
        const vertexCount = 4;
        context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount);
      }
    }

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  private static setPositionAttribute(context: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
    const numComponents = 2; // pull out 2 values per iteration
    const type = context.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    context.bindBuffer(context.ARRAY_BUFFER, buffers.position);
    context.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    context.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  private static setColorAttribute(context: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
    const numComponents = 4;
    const type = context.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.color);
    context.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    context.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }
}
