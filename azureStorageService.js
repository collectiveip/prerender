var blobService = new (require('azure-storage')).createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);
var containerName = process.env.AZURE_CONTAINER_NAME;

module.exports = {

	requestReceived: function(req, res, next) {
		if(req.method !== 'GET') {
			return next();
		}

		var key = req.prerender.url + '.html';

		blobService.getBlobToText(containerName, key, function(err, result, response) {
			if (!err && result) {
				return res.send(200, result);
			}

			next();
		});
	},

	pageLoaded: function(req, res, next) {
		if(req.prerender.statusCode !== 200) {
			return next();
		}

		var key = req.prerender.url + '.html';
		
		console.log(key);
		blobService.createBlockBlobFromText(containerName,
			key,
			req.prerender.content,
			{ contentType: 'text/html;charset=UTF-8'}, function(err, result) {
                if (err) console.error(err);

                next();
        });
	}
};
