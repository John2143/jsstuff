var iframe;
var iframetabs;
var redirect = false;
var hasRefreshed = false;
var doRefresh = function(){
	if(hasRefreshed) return;
	hasRefreshed = true;
	gradetab = iframe.find("html > body > form > div > table > tbody > tr > td");
	var docid = /\d+/.exec(gradetab.attr("id"))[0];
	var classdata = {};
	gradetab = gradetab.find("div").children("table");
	classdata.teacher = /: (.+)/.exec(gradetab.eq(1).find("tbody > tr:last-child > td:first-child").html())[1];
	const classname = gradetab.eq(1).find("tbody > tr:first-child > td:first-child").html();
	const classnamedata = /: (.+) \((.+)\)/.exec(classname);
	classdata.id = classnamedata[2];
	classdata.name = classnamedata[1];

	const classstr = gradetab.eq(1).find("tbody > tr:last-child > td:last-child").html();
	classdata.schoolname = /(.+) \(/.exec(classstr)[1];
	classdata.schoolid = /\((\d+)\)/.exec(classstr)[1];
	classdata.categories = {};
	gradetab.eq(2).children().find("tbody > tr:gt(0):lt(-1)").each(function(){
		var $t = $(this).children();
		const ptsmx = $t.eq(2).html();
		var pts, ptsmax;
		if(/\//.exec(ptsmx)) {
			var reg = /\d+\.\d+/g;
			pts = reg.exec(ptsmx)[0];
			ptsmax = reg.exec(ptsmx)[0];
		}else{
			pts = 0;
			ptsmax = 0;
		}
		classdata.categories[$t.eq(0).html()] = {
			weight: Number($t.eq(1).html()),
			points: Number(pts),
			maxpoints: Number(ptsmax),
			grades: []
		};
	});
	classdata.grade = gradetab.eq(2).children().find("tbody > tr:last-child > td:last-child").html();
	gradetab.eq(3).find("tbody > tr > td > table > tbody > tr:gt(1)").each(function(){
		var $t = $(this).find("td");
		if(!$t.eq(2)[0]) return;
		const catname = $t.eq(3).html();
		classdata.categories[catname].grades.push({
			name: $t.eq(1).html(),
			date: $t.eq(2).html(),
			weight: Number($t.eq(4).html()),
			points: Number($t.eq(5).html()),
			maxpoints: Number($t.eq(6).html())
		});
	});
	localStorage["bedl" + docid] = JSON.stringify(classdata);
	console.log("refresh completed", classdata);
	if (redirect) window.location.href = "https://www.edline.net/UserDocList.page";
};
$(window).load(function(){
	iframe = $("#docViewBodyFrame");
	iframe = iframe.contents();
	iframetabs = iframe.find("html > body > form > div > table > tbody > tr > td > div > table");
	if (localStorage.bedlind) {
		redirect = true;
		doRefresh();
	}else{
		var ref, refdo;
		refdo = function(){
			ref.find("span").html("Refreshed successfully");
			doRefresh();
		};
		ref = iframetabs.eq(0).click(refdo)
			.find("tbody > tr > td > b")
				.append("<br/><span>Click to refresh to main page</span>");
	}
});
