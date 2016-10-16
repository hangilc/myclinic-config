"use strict";

var fs = require("fs");
var ini = require("ini");

var config = ini.parse(fs.readFileSync("./default-config.ini", "utf-8"));

function composeStringReturnValue(src){
	if( src.lastIndexOf("env:", 0) === 0 ){
		return process.env[src.substr(4)];
	} else {
		return src;
	}
}

function composeObjectReturnValue(src){
	var ret = {};
	Object.keys(src).forEach(function(key){
		var val = src[key];
		ret[key] = composeReturnValue(val);
	});
	return ret;
}

function composeReturnValue(src){
	switch(typeof src){
		case "string": return composeStringReturnValue(src);
		case "object": return composeObjectReturnValue(src);
		default: return src;
	}
}

function parseStringValue(value){
	return value;
}

function mergeConfig(dst, src){
	Object.keys(src).forEach(function(key){
		var srcValue = src[key];
		if( typeof srcValue === "object" ){
			var dstValue = dst[key];
			if( typeof dstValue === "object" && dstValue !== null ){
				mergeConfig(dstValue, srcValue);
			} else {
				dst[key] = srcValue;
			}
		} else {
			dst[key] = srcValue;
		}
	});
}

exports.get = function(key){
	var value = config[key];
	return composeReturnValue(value);
};

exports.read = function(path){
	var content = fs.readFileSync(path, "utf-8");
	var newConfig = ini.parse(content);
	mergeConfig(config, newConfig);
};
