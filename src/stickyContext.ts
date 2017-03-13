export class StickyContext {
  private static instance: StickyContext;

  // singleton's body
  public contextBody: any = {};

  private constructor() {
    if(StickyContext.instance) {
      throw console.log('Error : Instanciation failed');
    }
    StickyContext.instance = this;
  }

  public static getInstance() {
    if(this.instance === null || this.instance === undefined) {
      this.instance = new StickyContext();
    }
    return this.instance;
  }

  public initContext(body: any):void {
    this.contextBody = body;
  }

  public destroyContext():void {
    this.contextBody = null;
  }

  public getContext():Object {
    return this.contextBody;
  }
}
