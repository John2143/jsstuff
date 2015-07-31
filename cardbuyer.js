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

var buyCardAjax = function(hashName, price, quantity, currency, cookies){
	jQuery.ajax({
		type: "POST",
		//This may be contracted to /market/createbuyorder/ but it will not
		//  always be https so this may be a security flaw however it should
		//  be fine
		url: "https://steamcommunity.com/market/createbuyorder/",

		data: "sessionid=" + cookies.sessionid +
				//appid 753 is steam
				"&appid=753" +
				//Hash name has "+" where spaces are
				"&market_hash_name=" + hashName +
				//Price in cents of the currency ie:
				//  $0.09 => price 9 currency 1
				//  £0.34 => price 34 currency 2
				"&price_total=" + price +
				"&quantity=" + quantity +
				"&currency=" + currency,

		//This function may cause all the data to not be garbage collected for a while
		success: function(data){
				console.log("Purchased card");
			},

		dataType: "application/x-www-form-urlencoded; charset=UTF-8",
		xhrFields: {
			//This is required to send many cookies which validate the purchase
			withCredentials: true
		}
	});
}

const delay = 500;
var doBuyCardDelayed = function(i, cardHash, price, quant, curr, cookies){
	setTimeout(function(){
		buyCardAjax(cardHash, price, quant, curr, cookies);
	}, i*delay);
};

function buyCards(set){
	console.log("Trying to buy " + set.length + " cards");
	var cookies = parseCookies();
	set.each(function(i,obj){
		var cardHash = getCardFromURL(obj.href)[2].replace(/%20/g,"+");
		console.log("Buying " + cardHash);
		var price = /\$(\d*)\.(\d+)/.exec(obj.innerHTML);
		if(price){
			price = Number(price[1] + price[2]);
			doBuyCardDelayed(i, cardHash, price, 1, 1, cookies);
		}else{
			console.log("Failed to get price");
		}
	});
}
buyCards(jQuery(".unowned > .es_card_search"));
//buyCard(card[2].replace(/%20/g,"+"), 5, 1, 1, parseCookies());
