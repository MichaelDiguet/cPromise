# cPromise

"cPromise" for "Context Promise"

cPromise is a Promises library, based on es6 Promises, allowing to implicitely pass a context through promises chain.

In some situations, when processing an operation, it is useful to have access to a context that can be referred globally without having to pass it from method to method.

In synchronous programming, this is something that can be easily implemented using static (or global) variables:
(The following code is not the best way to implement this of course, but keeped simple for sake of clarity)

```
let globalCtx = '';

let debug = function(s) {
  console.log(globalCtx + s);
}

let f = function(a, b) {
  let c = a + b;
  debug('adding ' + a + ' and ' + b + ' , result is ' + c);
}

// Starting first treatment
globalCtx = 'Fist treatment: ';
f(1, 2);
f(2, 3);
// Starting second treatment
globalCtx = 'Second treatment: ';
f(3, 4);
f(4, 5);
globalCtx = '';
```

This is not so easy to reproduce this in asynchronous programing. For instance, the following code won't work :

```
// Starting first async treatment
globalCtx = 'Fist treatment: ';
Promise.resolve().then(function() {
  return f(1, 2);
}).then(function(r1) {
  debug(f(r1, 3));
});

// Starting second async treatment
globalCtx = 'Second treatment: ';
Promise.resolve().then(function() {
  return f(3, 4);
}).then(function(r1) {
  debug(f(r2, 5));
});

// Cleaning global context
globalCtx = '';
```

Obviously it is possible to explicitely pass the context in every asynchronous function, but it is very heavy, and when the usage is very global (like for debug function) it has to be done in the whole project. This code shows what can be done by explicitely passing the context :

```
// Starting first async treatment
Promise.resolve('Fist treatment: ').then(function(ctx) {
  globalCtx = ctx;
  let result = f(1, 2);
  globalCtx = '';
  return [result, ctx];
}).then(function(t) {
  globalCtx = t[1];
  debug(f(t[0], 3));
  globalCtx = '';
});
```

With cPromise, you can do it as easily as you would with synchronous code :

```
// Starting first async treatment
globalCtx = 'Fist treatment: ';
cPromise.resolve().then(function() {
  return f(1, 2);
}).then(function(r1) {
  debug(f(r1, 3));
})

// Starting second async treatment
globalCtx = 'Second treatment: ';
cPromise.resolve().then(function() {
  return f(3, 4);
}).then(function(r1) {
  debug(f(r2, 5));
})

// Cleaning global context
globalCtx = '';
```
