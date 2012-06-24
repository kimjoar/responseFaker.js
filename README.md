responseFaker.js
================

A high-level abstraction over [Sinon.js](http://sinonjs.org/)
[`fakeServer`](http://sinonjs.org/docs/#fakeServer) to make your test
code less noisy.

Instead of writing:

```javascript
var response = '[{"id":12,"comment":"Hey there"}]';
var server = sinon.fakeServer.create();
server.respondWith([200, { "Content-Type": "application/json" }, response]);

// perform ajax request

server.respond();
server.restore();
```

… you can write:

```javascript
var response = { id: 12, comment: "Hey there"; };
fakeResponse(response, function() {
  // perform ajax request
};
```

You can also specify status code and headers yourself:

```javascript
var response = { id: 12, comment: "Hey there"; };
var options = {
  statusCode: 200,
  headers: { "Content-Type": "application/json" }
}
fakeResponse(response, options, function() {
  // perform ajax request
};
```

You can include the `fakeResponse` helper in any object, also the global
object:

```javascript
var obj = {};
responseFaker.call(obj)
// you now have `obj.fakeResponse`

// or, to the global object, i.e. `window` in browsers
responseFaker.call(window);
// you can now call `fakeResponse` directly all over your code
```
