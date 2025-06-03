export abstract class SingletonService {
  private static _instance: unknown;

  protected constructor() {
    // Ensure only one instance per subclass
    const ctor = this.constructor as typeof SingletonService;
    if (ctor._instance) {
      throw new Error(`${ctor.name} is a singleton and already instantiated.`);
    }
    ctor._instance = this;
  }

  protected static getInstance<T extends SingletonService>(this: new () => T): T {
    const self = this as any;
    if (!self._instance) {
      self._instance = new this();
    }
    return self._instance;
  }
}
