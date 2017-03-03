var actionList = {
	"#" : function(str) {
		return document.getElementById(str);
	},
	"." : function(str) {
		return document.getElementsByClassName(str);
	},
	":" : function(str) {
		return document.getElementsByName(str);
	},
	"@" : function(str) {
		return document.getElementsByTagName(str);
	}
};

function getElements(str) {
	var elementsResult = [];
	if(typeof(str) !== "string" || str == null){
		return elementsResult;
	}
	var getElementFun = actionList[str.substring(0, 0+1)];
	
	return  getElementFun ? getElementFun(str.substring(1)) : undefined;
}


(function() {
	if(document.getElementsByClassName) {
		return;
	}
	document.getElementsByClassName = function(clazzName){
		if(typeof document.classMap === 'undefined'){
			document.classMap = {};
		}
		var resultElements = document.classMap[clazzName];
		if(typeof resultElements === 'undefined'){
			resultElements = [];
			var ele = document.getElementsByTagName('*');
			for(var i = 0; i < ele.length; i++){
				var classString = ele[i].className;
				if(classString.length > 0){
					var strArray = classString.split(' ');
					for(var j = 0; j < strArray.length; j++){
						if(strArray[j] === clazzName){
							resultElements.push(ele[i]);
							break;
						}
					}
				}
			}
			document.classMap[clazzName] = resultElements;
		}
		return resultElements;
	}
})();

function addEvents(eventList) {
	var addEventAction;
	if(window.attachEvent){
		addEventAction = function(elementObj, eventName, eventAction){
			elementObj.attachEvent("on" + eventName, eventAction);
		};
	}else if(window.addEventListener){
		addEventAction = function(elementObj, eventName, eventAction){
			elementObj.addEventListener(eventName, eventAction, false);
		};
	}else{
		addEventAction = function(elementObj, eventName, eventAction){
			elementObj["on" + eventName] = eventAction;
		};
	}
	
	addEvents = function(eList){
		if(typeof eList !== 'object' || eList == null || eList.length <= 0){
			return;
		}
		
		for(var i = 0; i < eList.length; i++){
			var eventArg = eList[i];
			var elementObj = getElements(eventArg[0]);
			if(isHTMLCollection(elementObj)){
				for(var j = 0; j < elementObj.length; j++){
					console.log("---------- : ", elementObj[j]);
					addEventAction(elementObj[j], eventArg[1], eventArg[2]);
				}
			}else{
				addEventAction(elementObj, eventArg[1], eventArg[2]); 
			}
		}
	};

	addEvents(eventList);
}

function isHTMLCollection(obj) {
	return Object.prototype.toString.call(obj) === '[object HTMLCollection]';
}

function checkUseful(obj) {
	return !(typeof obj === 'undefined' || obj == null);
}

function getStyle(ele, attr) {
	if(!checkUseful(ele) || !checkUseful(attr)) {
		return null;
	}
	ele = typeof ele === 'string' ? getElements(ele) : ele;
	return window.getComputedStyle ? window.getComputedStyle(ele, false)[attr] : ele.currentStyle[attr];
}

function setCss(htmlElement, obj){
	if(!checkUseful(htmlElement) || !checkUseful(obj)){
		return;
	}
	if(typeof htmlElement == 'string') {
		htmlElement = getElements(htmlElement);
	}
	
	for(var e in obj){
		htmlElement.style[e] = obj[e];
	}
}

function getStyle(ele, attr){
	if(!checkUseful(ele) || !checkUseful(attr)){
		return null;
	}
	ele = typeof ele === 'string' ? getElements(ele) : ele;
	return window.getComputedStyle ? window.getComputedStyle(ele, false)[attr] :
		ele.currentStyle[attr];
}
