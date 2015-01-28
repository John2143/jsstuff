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

betterEdline.prototype.add = function(ind, id, cname){
	this.things[ind] = ([id, cname]);
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
		const cname = _t.util.trim($t.eq(4).children().html());
		_t.add(ind, id, cname);
	});
};


betterEdline.prototype.addrowtext = function(id, text){
	this.container.eq(id).children().eq(0).html(text);
};
betterEdline.prototype.showGrades = function(){
	for(id in this.things){
		this.addrowtext(id-1, this.things[id][2] || "? (?%)");
	}
};
beobj = new betterEdline();
beobj.load();
beobj.addrowtext(0, "<strong>Grade</strong>");
