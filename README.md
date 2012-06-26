responseFaker.js
================

High-level abstractions over [Sinon.js](http://sinonjs.org/)
[`fakeServer`](http://sinonjs.org/docs/#fakeServer) to make your tests
less noisy.

There are two helpers:

* `fakeResponse` which returns the same response for all AJAX requests.
* `fakeResponses` which returns different responses based on specified
  URLs.

fakeResponse
------------

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
  // the response defaults to JSON with status code 200
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

fakeResponses
-------------

```javascript
var responses = {
  // as object which can be JSON stringified
  "/emails": [{ from: "mail@kimjoar.net", subject: "Testing" }],

  // as JSON string
  "/user": '{ "username": "kimjoar" }',

  // object which contain response, statuscode, and/or headers
  "/fail": {
    response: { error: "Not found"},
    statusCode: 404
  }
}

fakeResponses(responses, function() {
  // perform ajax requests to `/emails`, `/user` and `/fail`
});
```

Include the helpers
-------------------

You can include `fakeResponse` and `fakeResponses` in any object,
including the global object:

```javascript
var obj = {};
responseFaker.call(obj)
// you now have `obj.fakeResponse` and `obj.fakeResponses`

// or, to the global object, i.e. `window` in browsers
responseFaker.call(window);
// you can now call `fakeResponse` and `fakeResponses` directly all over
// your code
```
