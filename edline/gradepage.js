var iframe;
var redirect = false;
doRefresh = function(){
	var gradetab = iframe.contents().find("html > body > form > div > table > tbody > tr > td");
	var docid = /\d+/.exec(gradetab.attr("id"))[0];
	var classdata = {};
	gradetab = gradetab.find("div").children("table");
	classdata.teacher = /: (.+)/.exec(gradetab.eq(1).find("tbody > tr:last-child > td:first-child").html())[1];
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
			pts = "0.0";
			ptsmax = "0.0";
		}
		classdata.categories.push({
			name: $t.eq(0).html(),
			weight: Number($t.eq(1).html()),
			points: Number(pts),
			maxpoints: Number(ptsmax)
		})
	});
	cd = classdata;
	gt = gradetab;
	localStorage["bedl" + docid] = JSON.stringify(classdata);
	if (redirect) window.location.href = "https://www.edline.net/UserDocList.page";
};
$(document).ready(function(){
	iframe = $("#docViewBodyFrame");
	if (localStorage.bedlind) {
		redirect = true;
		iframe.load(doRefresh);
	}
});
