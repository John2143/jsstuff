var docid;
var gradetab = $("#docViewBodyFrame").contents().find("html > body > form > div > table > tbody > tr > td");
var classdata = {};
var doRefresh = function(){
	if (!docid)
		docid = /\d+/.exec(gradetab.attr("id"))[0];
	gradetab = gradetab.find("div");
};
$(document).ready(function(){
	if (localStorage.bedlind) {
		doRefresh();
		window.location.href = "https://www.edline.net/UserDocList.page";
	}
});
