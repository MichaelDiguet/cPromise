import {StickyContext} from './stickyContext';

export class CPromise extends Promise<any> {

  public getContext: () => Object;

  constructor(executor: (resolve, reject) => void) {
    super((resolve, reject) => {
      function contextExecutor () {
        let internContext = StickyContext.getInstance().getContext();
        executor(resolve, reject);
        return internContext;
      }
      return contextExecutor();
    })
    this.getContext = () => {
      return StickyContext.getInstance().getContext();
    }
  }
}

export default CPromise;
