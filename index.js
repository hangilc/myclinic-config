"use strict";

var fs = require("fs");
var path = require("path");
var ini = require("ini");

exports.readJs = function(filepath){
	return require(path.resolve(filepath));
}

exports.readJson = function(filepath){
	var content = fs.readFileSync(filepath, "utf-8");
	return JSON.parse(content);
}

exports.readIni = function(filepath){
	var content = fs.readFileSync(filepath, "utf-8");
	return ini.parse(content);
};

exports.readText = function(filepath){
	return fs.readFileSync(filepath, { encoding: "utf-8" });
};

exports.readDir = function(dirpath){
	return exports.readJs(path.join(dirpath, "index.js"));
};

exports.readGlob = function(dirpath){
	var items = fs.readdirSync(dirpath, { encoding: "utf-8" });
	var obj = {};
	items.forEach(function(item){
		if( item[0] === "." ){
			return;
		}
		var comps = path.parse(item);
		var key = comps.name;
		var val = exports.read(path.join(dirpath, item));
		obj[key] = val;
	});
	return obj;
};

exports.read = function(confpath){
	var cp = confpath;
	if( fs.existsSync(cp) ){
		var stat = fs.statSync(cp);
		if( stat.isDirectory() ){
			return exports.readDir(cp);
		} else if( stat.isFile() ){
			var p = path.parse(cp);
			switch(p.ext){
				case ".js": return exports.readJs(cp);
				case ".json": return exports.readJson(cp);
				case ".ini": return exports.readIni(cp);
				case ".txt": return exports.readText(cp);
			}
		}
		throw new Error("cannot handle config file: " + cp);
	}
	cp = confpath + ".js";
	if( fs.existsSync(cp) ){
		return exports.readJs(cp);
	}
	cp = confpath + ".json";
	if( fs.existsSync(cp) ){
		return exports.readJson(cp);
	}
	cp = confpath + ".ini";
	if( fs.existsSync(cp) ){
		return exports.readIni(cp);
	}
	cp = confpath + ".txt";
	if( fs.existsSync(cp) ){
		return exports.readText(cp);
	}
	return {};
};

