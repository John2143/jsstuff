// ==UserScript==
// @name         One way reddit
// @namespace    http://reddit.com/
// @version      1.1
// @description  click rank to hide post
// @author       John2143
// @match        *://www.reddit.com/
// @grant        none
// ==/UserScript==
console.log("WE DID IT");

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
    getSiteTablePtr()
        .each(() => {
            const $this = $(this);
            if (owr.isHidden(getLinkID($this))){
                owr.hide($this);
            }
        });
};
oneWayReddit.prototype.toggleSeen = function(){
    let objs = $(".OWRHidden");
    if(this.showHidden){
        objs.hide();
    }else{
        objs.show();
    }
    this.showHidden = !this.showHidden;

};
oneWayReddit.prototype.save = function(){
    if(!this._loaded) return;
    localStorage.owrData = JSON.stringify({
        tohide: this.tohide,
        index: this.index,
    });
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
    const owr = this;
    $(".rank").click(function(){
        let par = $(this).parent();
        let save = owr.add(getLinkID(par));
        owr.hide(par);
        if(save) owr.save();
    });
};
oneWayReddit.prototype.load = function(){
    const realLoad = (data) => {
        this.tohide = data.tohide || [];
        this.index = data.index || 0;
        this.hideSeen();
    };
    const getcb = (data) => {
        if(data){
            realLoad(data);
        }else{
            realLoad(localStorage.owrData);
        }
    };

    if(this._loaded){
        if(this.hasServer){
            this.get(getcb);
        }else{
            realLoad(localStorage.owrData);
        }
    }else{
        this.get(true, getcb);
    }
    this._loaded = true;
};

oneWayReddit.prototype.get = function(force, cb){
    //TODO
    if(!cb) cb = force;
    return cb(false);

    if(!this.serverURL) return cb(false);
    if(!force && !this.hasServer) return cb(false);

    let htp = new XMLHttpRequest();
    htp.onreadystatechange = function(){
        if(htp.readyState === 4 && htp.status === 200){
            this.hasServer = true;
            cb(htp.responseText);
        }else if(htp.readyState === 4 && htp.status === 404){
            this.hasServer = false;
            cb(false);
        }
    };
    htp.open("GET", this.serverURL, true);
    htp.send();
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

const style = (".OWRHidden {background-color: #EEE;}"); //Show visited as grey when unhidden
let styleelem = document.createElement('style');
styleelem.type = 'text/css';
styleelem.innerHTML = style;

let owr = new oneWayReddit(250);
window.owr = owr;

const init = function(){
    owr.serverURL = localStorage.serverURL;
    owr.load();
    owr.doinit();
    document.getElementsByTagName('head')[0]
        .appendChild(styleelem);
    console.log("One way reddit loaded");
};

$(function(){
    init();
});

console.log("One way reddit activated");
$(document).keyup(function(e){
    const kc = e.keyCode;
    if(kc == "66"){
        owr.doinit();
    }else if (kc == "68"){
        owr.toggleSeen();
    }
});
