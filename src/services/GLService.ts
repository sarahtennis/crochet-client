import { SingletonService } from "./SingletonService";

export class GLService extends SingletonService {
  constructor() {
    super();
  }

  public static test() {
    GLService.getInstance().consoleLogTest();
  }

  private consoleLogTest() {
    console.log('Tested abstract SingletonService in GLService');
  }

  public static destroy() {}
}
