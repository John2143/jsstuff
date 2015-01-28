// ==UserScript==
// @name         One way reddit
// @namespace    http://reddit.com/
// @version      1.0
// @description  click rank to hide post
// @author       John2143
// @match        http://www.reddit.com/
// @grant        none
// ==/UserScript==


function oneWayReddit(mh){
	this.MAXHIST = mh || 250;
	this._loaded = false;
	this.showHidden = false;
}
const getSiteTablePtr = function(){
	return $(".sitetable > div.thing");
};
const getLinkID = function(jqlink){
	return jqlink.attr("data-fullname");
};
oneWayReddit.prototype.isHidden = function(lname){
	return $.inArray(lname, this.tohide) != -1;
};
oneWayReddit.prototype.hide = function(d){
	d.hide();
	d.addClass("OWRHidden");
};
oneWayReddit.prototype.hideSeen = function(){
	if(!this._loaded) return;
	var owr = this;
	getSiteTablePtr()
		.each(function(_ind){
			var $this = $(this);
			if (owr.isHidden(getLinkID($this))){
				owr.hide($this);
			}
		});
};
oneWayReddit.prototype.toggleSeen = function(){
	var objs = $(".OWRHidden");
	if(this.showHidden)
		objs.hide();
	else
		objs.show();
	this.showHidden = !this.showHidden;

};
oneWayReddit.prototype.save = function(){
	if(!this._loaded) return;
	localStorage.setItem("owred", JSON.stringify(this.tohide));
	localStorage.setItem("owredi", this.index);
};
oneWayReddit.prototype.add = function(data){
	if(!this._loaded) return false;
	if(this.isHidden(data)) return false;
	this.tohide[this.index++] = data;
	if (this.index > this.MAXHIST) this.index = 0;
	return true;
};
oneWayReddit.prototype.addRankButton = function(){
	if(!this._loaded) return;
	var owr = this;
	$(".rank").click(function(){
		var par = $(this).parent();
		var save = owr.add(getLinkID(par));
		owr.hide(par);
		if(save) owr.save();
	});
};


oneWayReddit.prototype.load = function(){
	this._loaded = true;
	this.tohide = JSON.parse(localStorage.getItem("owred") || JSON.stringify([]));
	this.index = localStorage.getItem("owredi") || 0
	this.hideSeen();
};

oneWayReddit.prototype.doinit = function(){
	this.hideSeen();
	this.addRankButton();
};
oneWayReddit.prototype._clear = function(){
	this.index = 0;
	this.tohide = [];
	//No this.save() in case it was an accident
};
var owr = new oneWayReddit(250);
const style = (".OWRHidden {background-color: #EEE;}"); //Show visited as grey when unhidden
var styleelem = document.createElement('style');
styleelem.type = 'text/css';
styleelem.innerHTML = style;
$(document).ready(function(){
	owr.load();
	owr.doinit();
	document.getElementsByTagName('head')[0]
		.appendChild(styleelem);
	console.log("One way reddit loaded");
});
$(document).keyup(function(e){
	var kc = e.keyCode;
	if(kc == "66") //b
		owr.doinit();
	else if (kc == "68")
		owr.toggleSeen();
});
