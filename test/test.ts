import * as assert from 'assert';
import {StickyContext} from '../src/stickyContext';
import {CPromise} from '../src/index';

describe('test cPromise : ', function() {

  it('should create a cPromise', function() {
    let p = new CPromise(function(resolve, reject) {});
    assert.equal('object', typeof(p));
    assert.equal('function', typeof(p.then));
    assert.equal('function', typeof(p['catch']));
  });

  it('should create a chain of CPromise', function() {

    // asyncFunction : resolve promise with value 'Hello World!' after 1s
    function asyncFunction():Promise<string> {
      return new CPromise((resolve)=>{
          setTimeout(()=>resolve("Hello World!"), 1000);
      });
    }
    // chain of CPromises
    return CPromise.resolve('start')
    .then(function(res) {
      assert.equal('start', res);
      return asyncFunction();
    }).then((res) => {
      assert.equal('Hello World!', res);
    })
  });

  it('should create a chain of CPromise and keep a context through it', function(done) {
    //async function : resolve promise with value 'Hello World!' after 1s
    function asyncFunction():Promise<string> {
      return new CPromise((resolve)=>{
          setTimeout(()=>resolve("Hello World!"), 1000);
      });
    }

    // create and init a context
    let myContext = StickyContext.getInstance();
    myContext.initContext({
      'key1' : 'value1',
      'key2' : 'value2'
    });

    // chain of CPromises
    let promise = new CPromise(function(resolve, reject) {
      resolve('start');
    });
    assert.deepEqual(myContext.getContext(), promise.getContext());
    promise.then((res) => {
      assert.equal('start', res);
      return asyncFunction();
    })
    assert.deepEqual(myContext.getContext(), promise.getContext());
    promise.then((res) => {
      assert.equal('Hello World!', res);
    })
    // destroy context
    myContext.destroyContext();
    done();
  });

});
