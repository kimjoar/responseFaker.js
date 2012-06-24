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
    this.response = "{}";
    this.options = {};
    this.noOp = function() {};

    responseFaker.call(this.obj);
  });

  it("can be mixed in to an object", function() {
    expect(this.obj.fakeResponse).toBeDefined();
  });

  describe("fake response", function() {
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
      var expectedResponse = this.response;
      var check = function(responseStatus, responseText) {
        expect(responseStatus).toEqual(200);
        expect(responseText).toEqual(expectedResponse);
      };

      this.obj.fakeResponse(expectedResponse, this.options, function() {
        performRequest("/some-url", check);
        performRequest("/other-url", check);
        performRequest("/third-url", check);
      });
    });

    it("handles object responses by JSON stringifying them", function() {
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

  function performRequest(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        callback(httpRequest.status, httpRequest.responseText);
      }
    };
    httpRequest.open('GET', 'http://www.example.org' + url);
    httpRequest.send();
  }

  function createResponse(response) {
    return [200, { "Content-Type": "application/json" }, response];
  }
});
