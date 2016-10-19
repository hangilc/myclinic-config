"use strict";

var fs = require("fs");
var path = require("path");
var init = require("ini");

function Config(){
	this.config = {};
}

Config.prototype.get = function(key){
	return this.config[key];
};

Config.prototype.set = function(key, value){
	this.config[key] = value;
};

Config.prototype.extend = function(key, obj){
	if( this.config[key] === undefined ){
		this.config[key] = {};
	}
	var dst = this.config[key];
	Object.keys(obj).forEach(function(key){
		dst[key] = obj[key];
	});
};

Config.prototype.addDefaults = function(key, obj){
	if( this.config[key] === undefined ){
		this.config[key] = {};
	}
	var dst = this.config[key];
	Object.keys(obj).forEach(function(key){
		if( !(key in dst) ){
			dst[key] = obj[key];
		}
	});
};

var re = /^config-(.+)\.([^.]*)/;

function isConfigFile(filename){
	var m = filename.match(re);
	if( m ){
		return {
			name: m[1],
			ext: m[2]
		};
	}	
}

Config.prototype.readJs = function(key, pathname){
	console.log(pathname);
	var obj = require(pathname);
	this.set(key, obj);
};

Config.prototype.readIni = function(key, pathname){
	var src = fs.readFileSync(pathname);
	console.log(src);
	throw new Error("not implemented yet");
};

Config.prototype.readJson = function(key, pathname){
	var src = fs.readFileSync(pathname);
	this.set(key, JSON.parse(src));
};

Config.prototype.readDir = function(dirpath){
	fs.readdirSync(dirpath).forEach(function(filename){
		var m = isConfigFile(filename);
		if( !m ){
			return;
		}
		var key = m.name;
		var fullpath = path.join(dirpath, filename);
		switch(m.ext){
			case "js": this.readJs(key, fullpath); break;
			case "ini": this.readIni(key, fullpath); break;
			case "json": this.readJson(key, fullpath); break;
			default: throw new Error("cannot handle config file: " + fullpath);
		}
	}, this);
};

exports.create = function(){
	var config = new Config();
	var configDir = process.env.MYCLINIC_CONFIG_DIR;
	if( configDir ){
		config.readDir(configDir);
	}
	return config;
};

