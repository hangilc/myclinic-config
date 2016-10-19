"use strict";

var fs = require("fs");

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

Config.prototype.readDir = function(dirpath){
	fs.readdirSync(dirpath).forEach(function(path){
		console.log(path);
	});
};

module.exports = Config;

