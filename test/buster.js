var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser",
    src: ["responseFaker.js"],
    specs: ["test/*-spec.js"],
    extensions: [require("sinon")]
};

