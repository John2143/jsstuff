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
		if (totalw == 0) return "100.01";
		return (total*100/totalw).toFixed(2);
	}
};
if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}

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
var iClass;
betterEdline.prototype.showClassDetails = function(classind){
	var data = this.things[classind];
	if(!data) return;
	var cl = data[2];
	if(!iClass) iClass = $("<div>").appendTo($(".ed-tdEnd:first"));
	iClass.html([
		'Teacher: {0}',
		'Class: <a href = "javascript:rlViewItm(\'{2}\')">{1} ({2})</a>',
		'Grade: {3}',
	].join("<br>").format(
		cl.teacher,
		"CLASSNAME",
		data[0],
		this.util.getClassGrade(cl)
	));
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
		window.beobj = new betterEdline();
		beobj.load();
		beobj.addrowtext(0, '<strong>Grade</strong> <a id = "bedlref"> &lt;refresh&gt;</a>');
		$("#bedlref").click(function(){beobj.refresh();});
		beobj.showGrades();
		$('.ed-formTable').eq(2).find("tbody > tr:gt(0)")
			.click(function(){
				beobj.showClassDetails($(this).index() - 1);
			});
	}
});
