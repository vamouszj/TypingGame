function SettingBtnClick() {	//游戏设置按下的处理事件
	var oBtCurrentStyle = getEleCurrentDisplay("Sllsetting");
	if(oBtCurrentStyle == "none") {
		listDisplayBlock("Sllsetting");
	}else if(oBtCurrentStyle == "block") {
		listDisplayNone("Sllsetting");
	}
}

function getEleCurrentDisplay(eleId) {   //得到指定id或者id数组的display的值
	return getElements("#" + eleId).style.display;
}


function getObjList(nameArray) {   //得到指定name属性组的元素构成的对象
	if(typeof(nameArray) !== "object") {
		return;
	}
	var sllList = {};
	for(var index = 0, len = nameArray.length; index < len; index++) {
		var nameStr = ":" + nameArray[index];
		sllList[nameArray[index]] = getElements(nameStr);
	}
	return sllList;
}

function initSllSetting() {    //初始化score, level, life选择第一个
	var sllList = getObjList(["score", "level", "life"]);
	if(sllList === {}) {
		return;
	}
	for(var item in sllList) {
		sllList[item][0].checked = "checked";
	}

}

function listDisplayNone(eleId) { //传递过来的id元素的display改为none
	if(typeof(eleId) === "string") {
		getElements("#" + eleId).style.display = "none";		
	}else if(typeof(eleId) === "object") {
		var len = eleId.length;
		for(var i = 0; i < len; i++) {
			getElements("#" + eleId[i]).style.display = "none";
		}
	}	
}


function initDisplay() {  //初始化游戏界面
	/*
	将游戏设置和可暂停的模块隐藏
	gameProcessChoose
	Sllsetting   display: none
	*/
	listDisplayNone(["gameProcessChoose", "Sllsetting"]);
	initSllSetting();

}

function StartBtnClick() {   //开始游戏按下之后
	listDisplayBlock("gameProcessChoose");
	listDisplayNone("gameInitChoose");
	var ssLCurrentDisplay = getEleCurrentDisplay("Sllsetting");
	if(ssLCurrentDisplay == "block") {
		listDisplayNone("Sllsetting");
	}
	initGame();

}

function listDisplayBlock(eleId) {  //传递过来的id元素的display改为block
	if(typeof(eleId) === "string") {
		getElements("#" + eleId).style.display = "block";		
	}else{
		var len = eleId.length;
		for(var i = 0; i < len; i++) {
			getElements("#" + eleId[i]).style.display = "block";
		}
	}

}


var constNumberObj = {
	"score" : [100, 200, 300],
	"level" : [1, 3, 5],
	"life" : [1, 3, 5]
}

function changeGameStatus(checkedIndexObj) {  //在“确认”按钮点击之后，修改Id为gameStatus的内容
	for(var item in checkedIndexObj) {
		switch(item) {
			case "score":	
				getElements("#show" + item).innerHTML = "分数：" + constNumberObj[item][checkedIndexObj[item]];
				break;
			case "life":	
				getElements("#show" + item).innerHTML = "生命：" + constNumberObj[item][checkedIndexObj[item]];
				break;
			case "level":
				getElements("#show" + item).innerHTML = "等级：" + constNumberObj[item][checkedIndexObj[item]];
				break;
		}

	}
}

function okBtnClick() {
	var sllList = getObjList(["score", "level", "life"]);
	var checkedIndexObj = {};

	if(sllList !== {}) {
		checkedIndexObj = checkWhichChecked(sllList);
	}

	changeGameStatus(checkedIndexObj);
	listDisplayNone("Sllsetting");
}

function checkWhichChecked(radioList) {
	var checkedIndexObj = {};
	for(var item in radioList) {
		var oneList = radioList[item];

		for(var i = 0; i < oneList.length; i++) {
			if(oneList[i].checked == true){
				checkedIndexObj[item] = i;
				break;
			}
		}
	}
	return checkedIndexObj;
}

function getBlockColor() {
	var colorIndex = Math.floor(Math.random() * game.blockColor.length);
	return game.blockColor[colorIndex];
}

function getBlockPositionLeft() {
	var positionLeft = Math.floor(Math.random() * (game.gameWidth - 30));
	return positionLeft;
}

function getBlockAlpha() {
	var alphaIndex = Math.floor(Math.random() * game.blockAlpha.length);
	return game.blockAlpha.charAt(alphaIndex, alphaIndex+1);
}

function getBlockFallSpeed() {
	var speed = (9 - game.gameConfig.inConfigLevel) * 160;
	return speed;
}

function Block(blockInfo) {
	this.blockInformation = blockInfo;
}

function createOneBlock() {
	var blockColor = getBlockColor();
	var blockInfo = {
		positionTop 	: 60,
		positionLeft 	: getBlockPositionLeft(),
		blockAlpha 		: getBlockAlpha(),
		blockBackground : blockColor[0],
		blockForcecolor : blockColor[1],
		fallSpeed 		: getBlockFallSpeed(),
		me				: null,
		intervalId		: null	
	};
	//block含有blockInfo
	var block = new Block(blockInfo);  
	var divBlock = document.createElement('div');
	block.blockInformation.me = divBlock;
	divBlock.setAttribute('class', 'alphaBlock');
	setCss(divBlock, {
		"top"	: blockInfo["positionTop"] + "px",
		"left"	: blockInfo["positionLeft"]+"px",
	});
	
	divBlock.innerHTML = blockInfo["blockAlpha"];
	game.parentDiv.appendChild(divBlock);
	block.blockInformation.intervalId = setInterval(function() {
		falldownBlock.call(block);
	}, block.blockInformation.fallSpeed);
	
	game.blocks.push(block);
}

function falldownBlock() {
	var currentTop = this.blockInformation["positionTop"];
	var score = constNumberObj.score[checkWhichChecked(getObjList(["score"])).score];
	currentTop += game.pause ? 0 : 10;
	if(currentTop > game.gameHeight) {
		var score = incScore(-10);
		removeBlockAt(this);
		if(score <= 0) {
			//生命-1；分数重置。若生命==0，游戏结束！
			var lifeObj = getElements("#showlife");
			var life = lifeObj.innerText.split('：')[1];			
			if(life == 0) {
				alert("很遗憾，请重新开始游戏");
				window.location = "index.html";
				return; 
			}else {				
				game.gameConfig["inConfigLife"] = --life;
				game.gameConfig["inConfigScore"] = score;
				lifeObj.innerText = "生命：" + life;
				getElements("#showscore").innerText = "分数：" + score;
			}
		}
	}else{
		setCss(this.blockInformation.me, {"top" : currentTop + "px"});
		this.blockInformation["positionTop"] = currentTop;
	}
}


function removeBlockAt(blockIndex) {
	//在game的blocks里面找到传入的block,保存其下标
	if(typeof blockIndex === 'object'){
		var index = game.blocks.indexOf(blockIndex);
	}
	//将该block先清除定时器，再将该block从blocks中移除
	var divBlock = blockIndex.blockInformation.me;
	clearInterval(game.blocks[index].blockInformation.intervalId);
	game.parentDiv.removeChild(divBlock);
	game.blocks.splice(index, 1);
}

function incScore(incScore){
	var inConfigScore = getElements("#showscore");
	var score = game.gameConfig["inConfigScore"];
	score += incScore;
	game.gameConfig["inConfigScore"] = score;
	inConfigScore.innerHTML = "分数：" + score;
	return score;
}


function startGame() {
	game.blocks = [];
	game.intervalId = setInterval(function(){
		createOneBlock();
	}, game.createBlockSpeed);
	
}
function createBlockSpeed(level) {
	return (9 - level) * 240;
}

function Game() {
	var sllList = getObjList(["score", "level", "life"]);
	var checkedIndexObj = {};

	if(sllList !== {}){
		checkedIndexObj = checkWhichChecked(sllList);
	}
	
	this.gameConfig = {
		inConfigLife	: constNumberObj.life[checkedIndexObj.life],
		inConfigLevel	: constNumberObj.level[checkedIndexObj.level],
		inConfigScore	: constNumberObj.score[checkedIndexObj.score]
	};
	this.blocks = null;
	this.pause = false;
	this.blockColor = [['#000000', '#FFFFFF'], ['#084385', '#F0F0F0'], ['#E5E503', '#F02E3B']];
	this.blockAlpha = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	this.gameWidth;
	this.gameHeight;
	this.intervalId;
	this.parentDiv = getElements(".bodyer")[0];
	
	this.btnStartGame = getElements("#StartBtn");
	this.btnPause = getElements("#PauseBtn");
	this.btnRestart = getElements("#ReStartBtn");
	this.btnSetConfig = getElements("#SettingBtn"); 
	this.createBlockSpeed = createBlockSpeed(this.gameConfig.inConfigLevel);
}

function onUserKeyPressed(eventArg) {
	if(game.pause == true) {
		return;
	}
	eventArg.key = eventArg.key;
	var blockIndex = searchBlockByAlpha(eventArg.key);
	if(blockIndex === -1){
		//无效的按键盘,暂时不做任何操作
	}else{
		//成功消除，加分
		removeBlockAt(game.blocks[blockIndex]);
		incScore(10);
	}
}

function searchBlockByAlpha(alpha) {
	var blocks = game.blocks;
	
	if(blocks.lenght <= 0) {
		return -1;
	}
	
	for(var i = 0; i < blocks.length; i++) {
		if(blocks[i].blockInformation["blockAlpha"] == alpha) {
			return i;
		}
	}
	
	return -1;
}

window.onkeypress = function(eventArg) {
	eventArg = eventArg || window.event;
	onUserKeyPressed(eventArg);
}

function initGame() {
	game = new Game();
	
	game.gameWidth = parseInt(getStyle(game.parentDiv, "width"));
	game.gameHeight = parseInt(getStyle(game.parentDiv, "height"));

	startGame();
}

function restartGame() {
	listDisplayBlock("gameInitChoose");
	initDisplay();
	okBtnClick();
	restartClickControl();
}

/*
 点击重新开始之后，页面应该清除掉所有的小块，并且游戏设置应该还原到最开始的状态
 * */
function restartClickControl() {
	game.pause = true;
	clearInterval(game.intervalId);
	for(var i = 0; i < game.blocks.length; i++) {
		clearInterval(game.blocks[i].blockInformation.intervalId);
		game.parentDiv.removeChild(game.blocks[i].blockInformation.me);
	}
}
/*
 暂停按钮按下去之后，暂停按钮需要变为开始按钮，物块停止下落，且不再产生新物块
 * */
function pauseBtnClick() {
	if(getElements("#PauseBtn").innerText == "暂停") {
		getElements("#PauseBtn").innerText = "开始";
		game.pause = true;
		clearInterval(game.intervalId);
	}else {
		getElements("#PauseBtn").innerText = "暂停";
		game.pause = false;
		game.intervalId = setInterval(function() {
					createOneBlock();
				}, game.createBlockSpeed);
	}
}

function init() {
	initDisplay();
	addEvents([
			["#SettingBtn", "click", SettingBtnClick],
			["#StartBtn", "click", StartBtnClick],
			["#ok", "click", okBtnClick],
			["#notOk", "click", initSllSetting],
			["#ReStartBtn", "click", restartGame],
			["#PauseBtn", "click", pauseBtnClick]
		]);
	var divGameBody = getElements(".bodyer")[0];
	var bodyHeight = parseFloat(getStyle(divGameBody, "height"));
}