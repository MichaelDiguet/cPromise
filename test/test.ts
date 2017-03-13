import * as assert from 'assert';
import {StickyContext} from '../src/stickyContext';
import {CPromise} from '../src/index';

// asyncFunction : resolve promise with value 'Hello World!' after 1ms
function asyncFunction():Promise<string> {
  return new CPromise((resolve)=>{
      setTimeout(()=>resolve("Hello World!"), 1);
  });
}

describe('test cPromise : ', function() {

  it('should create a cPromise', function() {
    let p = new CPromise(function(resolve, reject) {});
    assert.equal('object', typeof(p));
    assert.equal('function', typeof(p.then));
    assert.equal('function', typeof(p['catch']));
  });

  it('should create a chain of CPromise', function() {
    return CPromise.resolve('start')
    .then(function(res) {
      assert.equal('start', res);
      return asyncFunction();
    }).then((res) => {
      assert.equal('Hello World!', res);
    })
  });

  it.only('should create a chain of CPromise and keep a context through it', function(done) {
    // create and init a context
    let myContext = StickyContext.getInstance();
    myContext.initContext({
      'key1' : 'value1',
      'key2' : 'value2'
    });
    // chain of CPromises
    CPromise.resolve('start')
    .then(function(res) {
      assert.equal('start', res);
      assert.equal(StickyContext.getInstance().getContext()['key1'], 'value1');
      return asyncFunction();
    }).then((res) => {
      assert.equal('Hello World!', res);
      assert.equal(StickyContext.getInstance().getContext()['key2'], 'value2');
      done();
    });
    // destroy context
    myContext.destroyContext();
  });

});
