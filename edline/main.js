var regex_trim = /\w.*\w/;
var gradeBorders = [
	100.01, "I",
	96.21, "A+",
	92.88, "A",
	89.55, "A-",
	86.21, "B+",
	82.88, "B",
	79.55, "B-",
	76.21, "C+",
	72.88, "C",
	69.55, "C-",
	66.21, "D+",
	62.88, "D",
	59.55, "D-",
	39.70, "E+",
	19.85, "E",
	0, "E-"
];
var gradeBorderVals = [], gradeBorderLetters = [];
for (var i = 0; i < gradeBorders.length; i++)
	if(i%2 === 0)
		gradeBorderVals.push(gradeBorders[i]);
	else
		gradeBorderLetters.push(gradeBorders[i]);
delete gradeBorders;

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
		for (i in cat){
			var c = cat[i];
			if(c.maxpoints > 0 && c.weight > 0){
				total += (c.points/c.maxpoints)*(c.weight);
				totalw += c.weight;
			}
		}
		if (totalw === 0) return "100.01";
		return (total*100/totalw).toFixed(2);
	},
	pctToLetter: function(pct){
		for (var i = 0; i < gradeBorders.length; i++)
			if(pct >= gradeBorderVals[i])
				return gradeBorderLetters[i];

		return "?";
	},
	getDiscrepancy: function(gradeletter, classgrade){
		if(!classgrade || gradeletter == "I") return gradeletter;
		const gl = gradeletter[0];
		if(gl != classgrade)
			return "!!" + gradeletter + " > " + classgrade + "!!";
		return gradeletter;
	},
	letterAndPct: function(cl, format){
		const pct = this.getClassGrade(cl);
		return (format || "{0} ({1}%)").format(
			this.getDiscrepancy(
				this.pctToLetter(pct),
				cl.grade
			), 
			pct
		);
	}
};
if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0];
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    };
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
	var ind = -1;
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
		$t.parent().hover(
			function(){$(this).addClass("bedlHover");},
			function(){$(this).removeClass("bedlHover");}
		);
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
		this.addrowtext(ob[1], this.util.letterAndPct(ob[2]));
	}
};
var iClass;
betterEdline.prototype.showClassDetails = function(classind){
	var data;
	for (i in this.things)
		if (this.things[i][1] == classind)
			data = this.things[i];
	if(!data) return;
	var cl = data[2];
	if(!cl) return;
	if(!iClass) iClass = $("<div>").appendTo($(".ed-tdEnd:first"));
	iClass.html([
		'Teacher: {0}',
		'Class: <a href = "javascript:rlViewItm(\'{4}\')">{1} ({2})</a>',
		'Grade: {3}',
	].join("<br>").format(
		cl.teacher,
		cl.name,
		cl.id,
		this.util.letterAndPct(cl),
		data[0]
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
		beobj.showGrades();

		$("#bedlref").click(function(){beobj.refresh();});

		$('.ed-formTable').eq(2).find("tbody > tr:gt(0)")
			.click(function(){
				beobj.showClassDetails($(this).index());
			})
			;

		$('.ed-formTable').eq(2).find("tbody > tr > td:first-child").eq(0)
			.attr("width", "15%");

		const style = (".bedlHover {background-color: #CCC;}");
		var styleelem = document.createElement('style');
		styleelem.type = 'text/css';
		styleelem.innerHTML = style;
		document.getElementsByTagName('head')[0]
			.appendChild(styleelem);
	}
});
