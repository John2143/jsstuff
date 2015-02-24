var disp = function(){
	this.data = JSON.parse($("pre").html());
	this.div = $("<div>");
	$("body").html(this.div);
	this.buttonArea = $("<div>");
	this.dataArea = $("<div>");

	this.div.append(this.buttonArea);
	this.div.append(this.dataArea);

	this.layoutButtons();
	this.cleanup()
};

disp.prototype.cleanup = function(){
	console.log(this.data);
};

disp.prototype.buttons = {};

var button = function(name, callback, addto){
	this.name = name;
	this.callback = callback;
	var _this = this;
	this.button = $("<button>")
		.text(name)
		.click(function(){_this.click();})
		;
	if(addto)
		addto.append(this.button);
	return button
}

button.prototype.click = function(){
	console.log(this.name + " was clicked");
	this.callback(this);
};

disp.prototype.splitTables = function(tab1, tab2){
	this.dataArea.empty().append(
		$("<table>").append($("<tr>").css("width", "100%")
			.append($("<td>").css("width", "45%").append(tab1.jq))
			.append($("<td>").css("width", "45%").append(tab2.jq))
		)
	);
};
disp.prototype.setTable = function(tab){
	this.dataArea.empty().append(
		tab.jq
	);
	console.log("set table");
};

disp.prototype.layoutButtons = function(){
	var _this = this;
	new button("Show all", function(){_this.showAll();}, this.buttonArea);
	new button("TSET", function(){console.log("bbb");}, this.buttonArea);
};

disp.prototype.showAll = function(button){
	var tab = new table(4, function(row){console.log(row.data[4])});
	tab.jq.css("border", "1px black solid");
	this.setTable(tab);
	tab.addRow(["Class", "Module", "name", "id"]);
	for(var i = 0; i < this.data.default.elements.length; i++){
		var elem = this.data.default.elements[i];
		tab.addRow([elem.class, elem.module, elem.editor_name, elem.id, elem]);
	}
};

$(document).load(function(){
	window.displayer = new disp();
});
