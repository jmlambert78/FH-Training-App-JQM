var mapModel = {
	data : null,
	//load local points first and compare hash value with cloud retrieved data. update if cloud version has updated.
	loadPoints : function(callback) {
		$fh.act({
				act : 'mongodbPoints',
				req : {
					timestamp : new Date().getTime()
				}
			}, function(res) {
				if(callback) {
					callback(res);
				}
			},
            function(msg, err) {
                // An error occured during the cloud call. Alert some debugging information
                alert('Cloud call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
                });

	}
}
