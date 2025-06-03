import { SingletonService } from "./SingletonService";

export class ShaderService extends SingletonService {
  constructor() {
    super();
  }

  public static test() {
    ShaderService.getInstance().consoleLogTest();
  }

  private consoleLogTest() {
    console.log('Tested abstract SingletonService in ShaderService');
  }

  public static destroy() {}
}
