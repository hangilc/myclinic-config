"use strict";

var Config = require("./index");
var expect = require("chai").expect;
var fs = require("fs");
var ini = require("ini");

describe("testing readX", function(){
	it("readJs", function(){
		var path = "./test-config/index.js";
		var config = Config.readJs(path);
		var content = require(path);
		expect(config).eql(content);
	});

	it("readJson", function(){
		var path = "./test-config/a.json";
		var config = Config.readJson(path);
		var content = JSON.parse(fs.readFileSync(path));
		expect(config).eql(content);
	});

	it("readIni", function(){
		var path = "./test-config/b.ini";
		var config = Config.readIni(path);
		var content = ini.parse(fs.readFileSync(path, "utf-8"));
		expect(config).eql(content);
	});

	it("readDir", function(){
		var config = Config.readDir("./test-config");
		var content = Config.readJs("./test-config/index.js");
		content["a"] = Config.readJson("./test-config/a.json");
		content["b"] = Config.readIni("./test-config/b.ini");
		content["c"] = Config.readJs("./test-config/c.js");
		content["d"] = fs.readFileSync("./test-config/d.txt");
		content["e"] = Config.readDir("./test-config/e");
		expect(config).eql(content);
	});
});

describe("testing read", function(){
	it("read .js", function(){
		var path = "./test-config/index.js";
		var config = Config.read(path);
		var content = require(path);
		expect(config).eql(content);
	});

	it("read .json", function(){
		var path = "./test-config/a.json";
		var config = Config.read(path);
		var content = JSON.parse(fs.readFileSync(path));
		expect(config).eql(content);
	});

	it("read .ini", function(){
		var path = "./test-config/b.ini";
		var config = Config.read(path);
		var content = ini.parse(fs.readFileSync(path, "utf-8"));
		expect(config).eql(content);
	});

	it("readDir", function(){
		var config = Config.read("./test-config");
		var content = Config.readJs("./test-config/index.js");
		content["a"] = Config.readJson("./test-config/a.json");
		content["b"] = Config.readIni("./test-config/b.ini");
		content["c"] = Config.readJs("./test-config/c.js");
		content["d"] = fs.readFileSync("./test-config/d.txt");
		content["e"] = Config.readDir("./test-config/e");
		expect(config).eql(content);
	});
});
