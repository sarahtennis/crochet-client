main();

function main() {
  const canvas = <HTMLCanvasElement>document.getElementById("gl-canvas");
  const gl = canvas.getContext("webgl");

  // If WebGL is unavailable, getContext returns null.
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}
