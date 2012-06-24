//     responseFaker.js 0.1.0
//     A high-level API for sinon.js fakeServer
//
//     Copyright 2012, Kim Joar Bekkelund, MIT Licensed
//     http://kimjoar.net
//
// responseFaker.js can be mixed into any object:
//
//     responseFaker.call(obj);
//
// If you want responseFaker.js globally available in your tests:
//
//     responseFaker.call(window);
//
// In both cases the `fakeResponse` helper will be available.
var responseFaker = (function(root, sinon) {

  // fakeResponse
  // ------------
  //
  // High-level helper for responding equally to all Ajax requests.
  //
  // Parameters:
  //
  // `response` specifies the response to all Ajax requests. If can be
  //   specified both as a string and as an object. In the latter case, the
  //   object is transformed into JSON using `JSON.stringify`.
  //
  // `options` is an optional hash with two keys:
  //
  // - `statusCode` which specify the status code for all requests. Defaults
  //   to 200 OK.
  // - `headers` which specify the headers for all requests. Defaults to
  //   specifying JSON as the content type.
  //
  // `callback` is the callback which should trigger an Ajax request, i.e. this
  // callback should include those Ajax requests that should have the specified
  // response.
  function fakeResponse(response, options, callback) {
    // As options are optional, `callback` can be the second argument.
    if (typeof callback === "undefined" && typeof options === "function") {
      callback = options;
      options = {};
    }

    // The response is either a string or transformed to a string
    if (typeof response !== "string") {
      response = JSON.stringify(response);
    }

    // Set default options
    options || (options = {});
    if (!options.statusCode) options.statusCode = 200;
    if (!options.headers) options.headers = { "Content-Type": "application/json" };

    // Set up the response
    var server = sinon.fakeServer.create();
    server.respondWith([options.statusCode, options.headers, response]);

    // Trigger callback, which should include all the Ajax requests we want to
    // fake the response for.
    callback();

    server.respond();
    server.restore();
  }

  // The mixin which include the helpers on the passed object.
  return function() {
    this.fakeResponse = fakeResponse;

    return this;
  };

})(this, sinon);