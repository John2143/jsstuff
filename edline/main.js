var regex_trim = /\w.*\w/;
var util = {
	trim: function(str){
		return regex_trim.exec(str)[0];
	},
	check: function(ctd){
		return this.trim(ctd.eq(5).html()) === "Current Assignments Report";
	}
};

var betterEdline = function(){
	this.hasGrades = false;
	this.container = $(".ed-formTable")
			.eq(2) //Always second table
			.find("tbody > tr:lt(14)");
	this.util = util;
	this.init();
};

betterEdline.prototype.init = function(){
	this.things = [];
};

betterEdline.prototype.add = function(ind, id){
	this.things.push([id, ind]);
};

betterEdline.prototype.addGrade = function(grade){
	if(this.things[ind]) this.things[ind][2] = grade;
};

var regex_classid = /\'(\d+)\'/;
betterEdline.prototype.load = function(){
	var ind = 0;
	var _t = this;
	this.container.each(function(){
		++ind;
		var $t = $(this).find("td");
		if(!_t.util.check($t)) return;
		const id = regex_classid.exec(
			$t.eq(3).children().attr("href")
		)[1];
		_t.add(ind, id);
	});
};

var gotoPage = function(code){
	rlViewItm(code);
};
var getClassID = function(arr, ind){
	return arr[ind][0];
};
betterEdline.prototype.refresh = function(){
	localStorage.bedl = JSON.stringify(this.things);
	localStorage.bedlind = 0;
	gotoPage(getClassID(this.things, 0));
};

betterEdline.prototype.addrowtext = function(id, text){
	this.container.eq(id).children().eq(0).html(text);
};
betterEdline.prototype.showGrades = function(){
	for(id in this.things){
		var ob = this.things[id];
		this.addrowtext(ob[1]-1, "? (?%)");
	}
};

$(document).ready(function(){
	var docreate = true;
	if(localStorage.bedlind) {
		docreate = false;
		var arr = JSON.parse(localStorage.bedl);
		if (++localStorage.bedlind < arr.length) 
			gotoPage(getClassID(arr, localStorage.bedlind));
		else
			docreate = true;
	}
	if(docreate) {
		delete localStorage.bedlind;
		beobj = new betterEdline();
		beobj.load();
		beobj.addrowtext(0, '<strong>Grade <a href = "javascript:beobj.refresh()">(refresh)</a></strong>');
	}
});
