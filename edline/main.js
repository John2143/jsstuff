var GRADE_ALPHA = 0.3;

var regex_trim = /\w.*\w/;
var gradeBorders = [
	1.0001, "-",
	0.9621, "A+",
	0.9288, "A",
	0.8955, "A-",
	0.8621, "B+",
	0.8288, "B",
	0.7955, "B-",
	0.7621, "C+",
	0.7288, "C",
	0.6955, "C-",
	0.6621, "D+",
	0.6288, "D",
	0.5955, "D-",
	0.3970, "E+",
	0.1985, "E",
	0.001, "E-",
	0, "0"
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
	getPct: function(a, b){
		return b === 0 ? 1.01 : a/b;
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
		return (this.getPct(total, totalw));
	},
	pctToLetter: function(pct){
		for (var i = 0; i < gradeBorders.length; i++)
			if(pct >= gradeBorderVals[i])
				return gradeBorderLetters[i];

		return "?";
	},
	getDiscrepancy: function(gradeletter, classgrade){
		if(!classgrade || gradeletter == gradeBorderLetters[0]) return gradeletter;
		const gl = gradeletter[0];
		if(gl != classgrade)
			return "!!" + gradeletter + " > " + classgrade + "!!";
		return gradeletter;
	},
	letterAndPct: function(cl, nolerp){
		const pct = this.getClassGrade(cl);
		var str = "{0} ({1}%)".format(
			this.pctToLetter(pct),
			(pct*100).toFixed(2)
		);
		if(!nolerp)
			str = $("<span>")
				.html(str)
				.css("background-color",
					this.gradeLerp(pct).RGB(GRADE_ALPHA)
				)
				.prop("outerHTML");
		return str;
	},
	formatGrade: function(pts, ptsmx, pct){
		return "{0}/{1} ({2}%)".format(
			pts,
			ptsmx,
			(pct*100).toFixed(1)
		);
	},
	gradeLerp: function(pct){
		return Color.lerp(
			new Color(0xff0000),
			new Color(0x00dd11),
			(pct*2 - 1).clamp(0,1)
		);
	}
};
if (!Math.clamp) {
	Math.clamp = function(x,a,b) {
		return this.max(a, this.min(x, b));
	};
	Number.prototype.clamp = function(a, b) {
		return Math.clamp(this, a, b);
	};
}
if (!Math.lerp) {
	Math.lerp = function(a, b, t) {
		return a + t.clamp(0,1) * (b - a);
	};
}
window.Color = function(r, g, b) { //Color library
	if(g === undefined){
		this.bits = r;
		r -= (this.r = r >> 0x10) << 0x10;
		this.b = r - ((this.g = (r >> 0x8)) << 0x8);
	}else{
		this.r = r;
		this.g = g;
		this.b = b;
		this.bits = (r << 0x10) + (g << 0x8) + b;
	}
};
Color.prototype.toString = function(pre) {
	var str = Number(this.bits).toString(16).toUpperCase();
	return (pre ? pre === true ? '' :  pre : '#') + str.pad0(6);
};
Color.prototype.RGB = function(a) {
	var isa = a !== undefined;
	return "rgb" + (isa ? "a" : "") + "(" + [this.r, this.g, this.b].join(", ") + (isa ? ", " + a : "") + ")";
};

Color.lerp = function(a, b, t) {
	return new Color(
		Math.floor(Math.lerp(a.r, b.r, t)),
		Math.floor(Math.lerp(a.g, b.g, t)),
		Math.floor(Math.lerp(a.b, b.b, t))
	);
};
Color.grey = Color.gray = function(pct) {return Color.lerp(new Color(0), new Color(0xffffff), pct);};
//end color library
if (!String.prototype.pad0)
	String.prototype.pad0 = function(n) {
		return '0'.repeat(n-this.length) + this;
	};
if (!String.prototype.repeat) { //from stackoverflow
	String.prototype.repeat = function(times) {
		return (new Array(times + 1)).join(this);
	};
}
if (!String.prototype.format) { //from stackoverflow
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
		if(ob[2])
			this.addrowtext(ob[1], this.util.letterAndPct(ob[2]));
	}
};

betterEdline.prototype.showCategoryGrade = function(unused__, cl){
	var div = $("#bedlGrades").empty();
	for(var i in cl) {
		var assgn = cl[i];
		var bg, letter, pctge, alpha = GRADE_ALPHA;
		switch(assgn.points){
			case "Z":
				pctge = "Missing: -{0} points".format(assgn.maxpoints);
				letter = "Z";
				bg = new Color(0xff7700);
				break;
			case "X":
				pctge = "Excused: {0} points".format(assgn.maxpoints);
				letter = "X";
				bg = new Color(0x4a4aff);
				break;
			case "U":
				pctge = "Ungraded: {0} points".format(assgn.maxpoints);
				letter = "~";
				bg = new Color(0xbbbbbb);
				break;
			default:
				var pct = this.util.getPct(assgn.points, assgn.maxpoints);
				pctge = this.util.formatGrade(assgn.points, assgn.maxpoints, pct);
				letter = this.util.pctToLetter(pct);
				bg = this.util.gradeLerp(pct);
				break;
		}
		var tr = $("<tr>")
			.append($("<td>").html(letter))
			.append($("<td>").html(assgn.name))
			.append($("<td>").html(pctge))
			.css("background-color", bg.RGB(alpha))
			.appendTo(div);
	}
};

var iClass;
const categoryNames = ["Name", "Weight", "Grade", "Z", "Upcoming", "Graded/Excused"];
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
		'Grade: <span>{3}</span>',
		'Categories: <br/><table border id="bedlCategories" cellspacing=0 cellpadding=0>{5}</table><hr/><table id = "bedlGrades"></table>',
	].join("<br>").format(
		cl.teacher,
		cl.name,
		cl.id,
		this.util.letterAndPct(categoryNames.length),
		data[0],
		'<tr></tr>'.repeat(5) //.repeat(x) -> x = number of rows
	));
	var trs = $("#bedlCategories tr");
	for(i = 0; i < categoryNames.length; i++)
		trs.eq(i).append($("<td>").html(categoryNames[i]));
	for(i in cl.categories){
		var cat = cl.categories[i];
		var ind = 0;
		trs.eq(ind++).append($("<td>").html(i));
		trs.eq(ind++).append($("<td>").html(cat.weight));
		var pct = this.util.getPct(cat.points, cat.maxpoints);
		trs.eq(ind++).append($("<td>")
			.css("background-color",
				this.util.gradeLerp(pct).RGB(GRADE_ALPHA)
			)
			.html(
				this.util.formatGrade(cat.points, cat.maxpoints, pct)
			)
		);

		var z=0, upcoming=0, excused=0, zero=0, graded=0;
		for(v in cat.grades) {
			var assgn = cat.grades[v];
			switch(assgn.points){
				case "Z":
					z++; break;
				case "U":
					upcoming++; break;
				case "X":
					excused++; break;
				case 0:
					zero++; break;
				default: //Anything with a positive grade
					graded++; break;
			}
		}
		trs.eq(ind++).append($("<td>")
			.html(z)
			.css("background-color", new Color(0xff00000).RGB(z > 0 ? GRADE_ALPHA : 0))
		);
		trs.eq(ind++).append($("<td>")
			.html(upcoming)
		);
		trs.eq(ind++).append($("<td>")
			.html(graded + " + " + excused)
		);
		trs.find("td:last-child")
			.click(function(k, cl){
				this.showCategoryGrade(k, cl);
			}.bind(this, i, cat.grades));
			//.hover(function(){
				//var $t = $(this);
				//$t.parent().addClass("bedlHover");
				//$t.parent().parent().find("tr > td:nth-child(" + ($t.index() + 1) + ")").addClass("bedlHover");
			//}, function(){
				//var $t = $(this);
				//$t.parent().removeClass("bedlHover");
				//$t.parent().parent().find("tr > td:nth-child(" + ($t.index() + 1) + ")").removeClass("bedlHover");
			//});
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

		const style = (".bedlHover {background-color: #CCC !important;}");
		var styleelem = document.createElement('style');
		styleelem.type = 'text/css';
		styleelem.innerHTML = style;
		document.getElementsByTagName('head')[0]
			.appendChild(styleelem);
		$("#ed-pageFooter").append($("<div>")
			.append($("<a>")
				.html("Clear local storage")
				.click(function(){
					localStorage.clear();
				})
			)
		);
	}
});
