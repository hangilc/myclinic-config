"use strict";

var fs = require("fs");
var path = require("path");
var ini = require("ini");

function readIndex (config, pathname){
	var conf = require(pathname);
	Object.keys(conf).forEach(function(key){
		config[key] = conf[key];
	});
}

function readDir (config, dirpath){
	fs.readdirSync(dirpath).forEach(function(filename){
		var fullpath = path.join(dirpath, filename);
		if( filename === "index.js" ){
			readIndex(config, fullpath);
			return;
		}
		var m = isConfigFile(filename);
		if( !m ){
			return;
		}
		var key = m.name;
		switch(m.ext){
			case "js": this.readJs(key, fullpath); break;
			case "ini": this.readIni(key, fullpath); break;
			case "json": this.readJson(key, fullpath); break;
			default: throw new Error("cannot handle config file: " + fullpath);
		}
	}, this);
};

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
	var prefix = "config-";
	var prefixSize = prefix.length;
	fs.readdirSync(dirpath).forEach(function(filename){
		var fullpath = path.join(dirpath, filename);
		var c, p, key;
		if( filename === "index.js" ){
			c = exports.readJs(fullpath);
			exports.extend(config, c);
			return;
		}
		if( filename.substring(0, prefixSize) === prefix ){
			p = path.parse(filename);
			key = p.name.substring(prefixSize);
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

