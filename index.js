"use strict";

var fs = require("fs");
var path = require("path");
var ini = require("ini");

exports.readJs = function(filepath){
	return require(path.resolve(filepath));
}

exports.readJson = function(path){
	var content = fs.readFileSync(path, "utf-8");
	return JSON.parse(content);
}

exports.readIni = function(path){
	var content = fs.readFileSync(path, "utf-8");
	return ini.parse(content);
};

exports.extend = function(dst){
	var n = arguments.length, i;
	for(i=1;i<n;i++){
		var src = arguments[i];
		Object.keys(src).forEach(function(key){
			dst[key] = src[key];
		});
	}
};

exports.readDir = function(dirpath){
	var config = {};
	fs.readdirSync(dirpath).forEach(function(filename){
		var fullpath = path.join(dirpath, filename);
		var c, p, stat, key;
		p = path.parse(filename);
		if( p.name == "index" ){
			c = exports.read(fullpath);
			exports.extend(config, c);
			return;
		}
		if( filename[0] === "." ){
			return;
		}
		stat = fs.statSync(fullpath);
		if( stat.isDirectory() ){
			config[filename] = exports.readDir(fullpath);	
		} if( stat.isFile() ){
			key = p.name;
			switch(p.ext){
				case ".js": config[key] = exports.readJs(fullpath); break;
				case ".json": config[key] = exports.readJson(fullpath); break;
				case ".ini": config[key] = exports.readIni(fullpath); break;
				case ".txt": config[key] = fs.readFileSync(fullpath); break;
				default: throw new Error("cannot handle config file: " + fullpath);
			}
		}
	});
	return config;
}

exports.read = function(fpath){
	var stat = fs.statSync(fpath);
	if( stat.isDirectory() ){
		return exports.readDir(fpath);
	} else if( stat.isFile() ){
		var p = path.parse(fpath);
		switch(p.ext){
			case ".js": return exports.readJs(fpath);
			case ".json": return exports.readJson(fpath);
			case ".ini": return exports.readIni(fpath);
		}
	}
	throw new Error("cannot handle config file: " + fpath);
};

