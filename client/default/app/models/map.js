var mapModel = {
	data : null,
	//load local points first and compare hash value with cloud retrieved data. update if cloud version has updated.
	loadPoints : function(callback) {
		$fh.act({
				act : 'getPoints',
				req : {
					timestamp : new Date().getTime()
				}
			}, function(res) {
				this.data = res;
				if(callback) {
					callback(this.data);
				}
			});
		});
	}
}