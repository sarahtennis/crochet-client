// This began as a structed version of the sample project from:

import { SceneService } from "./services/SceneService";

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
type Milliseconds = number;
type Seconds = number;

(() => {
  let then: Seconds = 0;
  // let squareRotation = 0.0;
  let cubeRotation = 0.0;

  const render = (now: Milliseconds) => {
    const secondsNow = now * 0.001;
    const timeChange = secondsNow - then;
    then = secondsNow;

    SceneService.drawScene(cubeRotation);
    cubeRotation += timeChange;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
