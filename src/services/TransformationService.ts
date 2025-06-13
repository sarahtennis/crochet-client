import { SingletonService } from "./SingletonService";

export class TransformationService extends SingletonService {
  constructor() {
    super();
  }

  public static destroy() {}
}
