buster.spec.expose();

buster.assertions.add("respondedWith", {
    assert: function (server) {
        var spy = server.respondWith;
        return spy.calledWith.apply(spy, Array.prototype.slice.call(arguments, 1));
    },
    assertMessage: "Expected ${0} to be foo!",
    refuteMessage: "Expected not to be foo!",
    expectation: "toHaveRespondedWith"
});

describe("Response faker", function() {
  beforeEach(function() {
    this.obj = {};
    this.noOp = function() {};

    responseFaker.call(this.obj);
  });

  describe("fake response", function() {
    beforeEach(function() {
      this.response = "{}";
      this.options = {};
    });

    it("is mixed in", function() {
      expect(this.obj.fakeResponse).toBeDefined();
    });

    it("executes the callback", function() {
      var spy = this.spy();

      this.obj.fakeResponse(this.response, this.options, spy);

      expect(spy).toHaveBeenCalledOnce();
    });

    it("executes the callback when options is not specified", function() {
      var spy = this.spy();

      this.obj.fakeResponse(this.response, spy);

      expect(spy).toHaveBeenCalledOnce();
    });

    it("defaults to status code 200 OK and content type application/json", function() {
      var server = sinon.fakeServer.create();
      sinon.stub(server, "respondWith");
      sinon.stub(sinon.fakeServer, "create").returns(server);

      this.obj.fakeResponse(this.response, this.options, this.noOp);

      expect(server).toHaveRespondedWith(createResponse(this.response));

      sinon.fakeServer.create.restore();
    });

    it("has the same response for all Ajax requests", function() {
      var response = this.response;
      this.obj.fakeResponse(response, this.options, function() {
        request("/some-url",  expectResponse(response));
        request("/other-url", expectResponse(response));
        request("/third-url", expectResponse(response));
      });
    });

    it("JSON stringifies object responses", function() {
      var server = sinon.fakeServer.create();
      sinon.stub(server, "respondWith");
      sinon.stub(sinon.fakeServer, "create").returns(server);
      var response = { name: "Kim" };
      var jsonResponse = JSON.stringify(response);

      this.obj.fakeResponse(response, this.options, this.noOp);

      expect(server).toHaveRespondedWith(createResponse(jsonResponse));

      sinon.fakeServer.create.restore();
    });
  });

  describe("fakeResponses", function() {
    beforeEach(function() {
      this.responses = {
        "/some-url": '{ "name": "Kim Joar" }',
        "/other-url": '{ "company": "BEKK" }',
        "/third-url": '{ "country": "Norway" }'
      };
    });

    it("is mixed in", function() {
      expect(this.obj.fakeResponses).toBeDefined();
    });

    it("executes the callback", function() {
      var spy = this.spy();

      this.obj.fakeResponses(this.responses, spy);

      expect(spy).toHaveBeenCalledOnce();
    });

    it("gives different responses for different URLs", function() {
      var responses = this.responses;

      this.obj.fakeResponses(responses, function() {
        request("/some-url",  expectResponse(responses["/some-url"]));
        request("/other-url", expectResponse(responses["/other-url"]));
        request("/third-url", expectResponse(responses["/third-url"]));
      });
    });

    it("JSON stringifies object responses", function() {
      var response = { name: "Kim Joar" };
      var responses = {
        "/some-url": response
      };

      this.obj.fakeResponses(responses, function() {
        request("/some-url", expectResponse(JSON.stringify(response)));
      });
    });

    it("allows status code and headers to be specified to a url", function() {
      var response = { error: "Not found" };
      var response2 = '{ to: "mail@kimjoar.net" }';
      var responses = {
        "/user": {
          response: response,
          statusCode: 404
        },
        "/email": {
          response: response2
        }
      };

      this.obj.fakeResponses(responses, function() {
        request("/user", expectResponse(JSON.stringify(response), 404));
        request("/email", expectResponse(response2, 200));
      });
    });
  });

  function expectResponse(response, statusCode) {
    return function(responseStatus, responseText) {
      expect(responseStatus).toEqual(statusCode || 200);
      expect(responseText).toEqual(response);
    };
  }

  function request(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        callback(httpRequest.status, httpRequest.responseText, url);
      }
    };
    httpRequest.open('GET', 'http://www.example.org' + url);
    httpRequest.send();
  }

  function createResponse(response) {
    return [200, { "Content-Type": "application/json" }, response];
  }
});
