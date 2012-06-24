var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser",
    src: ["lib/responseFaker.js"],
    specs: ["test/*-spec.js"],
    extensions: [require("sinon")]
};

