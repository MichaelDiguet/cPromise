import { StickyContext } from './stickyContext';

export class CPromise<T> extends Promise<any> {

  public then(onfulfilled?: ((value: T) => T | PromiseLike<T>) | undefined | null, onrejected?: ((reason: any) => T | PromiseLike<T>) | undefined | null): Promise<T> {
    let ctxSav = StickyContext.getInstance().getContext();
    return super.then(
      (value: T) => {
        StickyContext.getInstance().initContext(ctxSav);
        let res = onfulfilled(value);
        StickyContext.getInstance().destroyContext();
        return res;
      },
      (reason: any) => {
        StickyContext.getInstance().initContext(ctxSav);
        let res = onrejected(reason);
        StickyContext.getInstance().destroyContext();
        return res;
      },
    );
  };

}

export default CPromise;
