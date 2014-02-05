//on document is loaded
$(document).ready(function() {
	if(false){ //Remove as required by fh support
			$fh.init({
		  "host": "https://gemalto.feedhenry.com",
		  "appid": "45nPpnbA_yvd5EQZ1OuZKYpJ",
		  "appkey": "2406f7df7f71bc9f2cd9bac7c04774829c691701"
			}, function(res) {
				// Init call was successful. Alert the response
				alert('Got response from init:' + JSON.stringify(res));
			}, function(msg, err) {
				// An error occured during the init call. Alert some debugging information
				alert('Init call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
			});
		}
	importViews(function() {
		changeView("home");
		bindEvent();
	});
});
