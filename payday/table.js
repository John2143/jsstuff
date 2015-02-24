var table = function(width, rowcallback){
	this.jq = $("<table>");
	this.sizew = width || 1;
	this.populated = false;
	this.callback = rowcallback;
};

var tableRow = function(tab, data){
	this.jq = $("<tr>");
	this.tab = tab;
	this.data = data;
	var _this = this;
	if(tab.callback)
		this.jq.click(function(){
			tab.callback(_this);
		});
	for(var ind = 0; ind < tab.sizew; ind++){
		var td = $("<td>");
		this.jq.append(td);
		if(data && data[ind])
			td.html(data[ind]);
	}
	tab.jq.append(this.jq);
}

table.prototype.rowN = function(row){
	if(row > this.height) return null;
	var crow = this.firstRow;
	while(row--)
		crow = crow.next;
	return crow;
};

tableRow.prototype.remove = function(){
	if(this.last) this.last.next = this.next;
	if(this.next) this.next.last = this.last;
	if(this.tab) this.tab.height--;
};


table.prototype.addRow = function(data){
	var newrow = new tableRow(this, data);
	if(!this.populated){
		this.firstRow = newrow;
		this.lastRow = newrow;
		this.height = 0;
	}
	this.height++;
	this.lastRow.next = newrow;
	newrow.last = this.lastRow;
	this.lastRow = newrow;

	this.jq.append(
		newrow.jq
	);
	return newrow;
};
