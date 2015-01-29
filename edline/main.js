var regex_trim = /\w.*\w/;
var util = {
	trim: function(str){
		return regex_trim.exec(str)[0];
	},
	check: function(ctd){
		return this.trim(ctd.eq(5).html()) === "Current Assignments Report";
	},
	getClassGrade: function(cd){
		var cat = cd.categories;
		var total = 0;
		var totalw = 0;
		for(var i = 0; i < cat.length; i++){
			var c = cat[i];
			if(c.maxpoints > 0 && c.weight > 0){
				total += (c.points/c.maxpoints)*(c.weight);
				totalw += c.weight
			} 
		}
		if (totalw == 0) return 100;
		return total*100/totalw;
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

betterEdline.prototype.add = function(ind, id, cls){
	this.things.push([id, ind, cls]);
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
		var cls = localStorage["bedl" + id];
		if (cls) cls = JSON.parse(cls);
		_t.add(ind, id, cls);
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
		this.addrowtext(ob[1]-1, ob[2] ? this.util.getClassGrade(ob[2]) + "%" : "? (?%)");
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
		delete localStorage.bedl;
		var beobj = new betterEdline();
		beobj.load();
		beobj.addrowtext(0, '<strong>Grade</strong> <a id = "bedlref"> &lt;refresh&gt;</a>');
		$("#bedlref").click(function(){beobj.refresh();});
		beobj.showGrades();
	}
});
