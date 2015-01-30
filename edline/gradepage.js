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
	classdata.id = /\((.+)\)/.exec(gradetab.eq(1).find("tbody > tr:first-child > td:first-child").html())[1];
	classdata.school = {}
	const classstr = gradetab.eq(1).find("tbody > tr:last-child > td:last-child").html();
	classdata.school.name = /(.+) \(/.exec(classstr)[1];
	classdata.school.id = /\((\d+)\)/.exec(classstr)[1];
	classdata.categories = [];
	gradetab.eq(2).children().find("tbody > tr:gt(0):lt(-1)").each(function(){
		var $t = $(this).children();
		const ptsmx = $t.eq(2).html();
		var pts, ptsmax;
		if(/\//.exec(ptsmx)) {
			var reg = /\d+\.\d+/g
			pts = reg.exec(ptsmx)[0];
			ptsmax = reg.exec(ptsmx)[0];
		}else{
			pts = 0;
			ptsmax = 0;
		}
		classdata.categories.push({
			name: $t.eq(0).html(),
			weight: Number($t.eq(1).html()),
			points: Number(pts),
			maxpoints: Number(ptsmax)
		})
	});
	classdata.grades = [];
	gradetab.eq(3).find("tbody > tr > td > table > tbody > tr:gt(1)").each(function(){
		var $t = $(this).find("td");
		classdata.grades.push({
			name: $t.eq(1).html()
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
		iframe.load(doRefresh);
	}
	var ref, refdo;
	refdo = function(){
		ref.find("span").html("Refreshed successfully");
		doRefresh();
	}
	ref = iframetabs.eq(0).click(refdo)
		.find("tbody > tr > td > b")
			.append("<br/><span>Click to refresh to main page</span>");
});
