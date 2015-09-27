/*
 *       Steam card autobuyer
 * Created by John2143 (john2143.com)
 */

var parseCookies = function(cookies){
	cookies = cookies || document.cookie;

	var unparsedcookies = document.cookie.split("; ");
	var cookies = {};
	for(var i = 0; i < unparsedcookies.length; i++){
		var b = unparsedcookies[i].split("=");
		cookies[b[0]] = b[1];
	};
	return cookies;
};

var getCardFromURL = function(str){
	//Returns
	//  1 => appid (753 for trading cards)
	//  2 => hashName
	return /market\/listings\/(\d+)\/([^#]+)/.exec(str);
};

var getLowestPrice = function(callback, hash, appid, currency){
	jQuery.ajax({
		type: "GET",
		//http for simple gets
		url: "http://steamcommunity.com/market/priceoverview/",
		data: "market_hash_name=" + hash +
				"&currency=" + currency +
				"&appid=" + appid,
		success: callback
	});
};
var buyCardAjax = function(callback, hashName, price, quantity, currency, appid, cookies){
	jQuery.ajax({
		type: "POST",
		//This may be contracted to /market/createbuyorder/ but it will not
		//  always be https so this may be a security flaw however it should
		//  be fine
		url: "https://steamcommunity.com/market/createbuyorder/",

		data: "sessionid=" + cookies.sessionid +
				//appid 753 is steam
				"&appid=" + appid+
				//Hash name has "+" where spaces are
				"&market_hash_name=" + hashName +
				//Price in cents of the currency ie:
				//  $0.09 => price 9 currency 1
				//  £0.34 => price 34 currency 2
				"&price_total=" + price +
				"&quantity=" + quantity +
				"&currency=" + currency,

		//This function may cause all the data to not be garbage collected for a while
		success: callback,
		dataType: "application/x-www-form-urlencoded; charset=UTF-8",
		xhrFields: {
			//This is required to send many cookies which validate the purchase
			withCredentials: true
		}
	});
}

var cards = [];
jQuery(".unowned > .es_card_search").each(function(i,obj){
	console.log("DOING THINGS ON " + i);
	var cardHash = getCardFromURL(obj.href)[2].replace(/%20/g,"+");
	getLowestPrice((function(hash, data){
		if(!data || data.success === false){
			console.log("error getting card");
		}else{
			cards.push({
				hash: hash,
				lowest: Number(
					/(\d*)[.,]?(\d+)/
					.exec(data.lowest_price)
					.splice(1,2)
					.join("")
				),
			});
			console.log(cards);
		}
	}).bind(null, cardHash), cardHash, 753, 1);
});
buyCard(card[2].replace(/%20/g,"+"), 5, 1, 1, parseCookies());
