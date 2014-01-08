var http = require('http')
  , url = require('url')
  , _ = require('lodash')
  , util = require("util")
  , PrerenderEngine = require("./engine");

// Gets the URL to prerender from a request, stripping out unnecessary parts
function getUrl(req) {
    var decodedUrl
      , parts;

    try {
        decodedUrl = decodeURIComponent(req.url);
    } catch (e) {
        decodedUrl = req.url;
    }

    parts = url.parse(decodedUrl, true);

    // Remove the _escaped_fragment_ query parameter
    if (parts.query.hasOwnProperty('_escaped_fragment_')) {
        if(parts.query['_escaped_fragment_']) parts.hash = '#!' + parts.query['_escaped_fragment_'];
        delete parts.query['_escaped_fragment_'];
        delete parts.search;
    }

    var newUrl = url.format(parts);
    if(newUrl[0] == '/') newUrl = newUrl.substr(1);
    return newUrl;
}

function PrerenderServer(phantom) {
    PrerenderEngine.call(this, phantom);
}

util.inherits(PrerenderServer, PrerenderEngine);

// Starts the server
PrerenderServer.prototype.start = function() {
    this.phantom.start();
    http.createServer(_.bind(this.onRequest, this)).listen(process.env.PORT || 3000);
    console.log('Server running on port ' + (process.env.PORT || 3000));
};

// Called when a web request comes in
PrerenderServer.prototype.onRequest = function(req, res) {
    var _this = this;

    // Create a partial out of the _send method for the convenience of plugins
    res.send = _.bind(this._send, this, req, res);

    req.prerender = {
        url: getUrl(req),
        start: new Date()
    };

    console.log('getting', req.prerender.url);

    this._pluginEvent("beforePhantomRequest", [req, res], function() {
        // Add the request to the queue
        var item = _this.phantom.enqueue(req.prerender);
        
        item.on("timeout", function() {
            console.log("request " + item.id + " timed out");
            res.send(500);
        });

        item.on("response", function() {
            res.send(item.response.statusCode, item.response.documentHTML);
        });
    });
};

PrerenderServer.prototype._send = function(req, res, statusCode, documentHTML) {
    req.prerender.statusCode = statusCode;
    req.prerender.documentHTML = documentHTML;

    this._pluginEvent("beforeSend", [req, res], function() {
        if (req.prerender.redirectURL) {
            res.setHeader('Location', req.prerender.redirectURL);
        }

        if (req.prerender.documentHTML) {
            res.setHeader('Content-Length', Buffer.byteLength(req.prerender.documentHTML, 'utf8'));
        }

        res.writeHead(req.prerender.statusCode || 404, {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 86400
        });
        
        if (req.prerender.documentHTML) res.write(req.prerender.documentHTML);

        res.end();

        var ms = new Date().getTime() - req.prerender.start.getTime();
        console.log('got', req.prerender.statusCode, 'in', ms + 'ms', 'for', req.prerender.url);
    });
};

module.exports = PrerenderServer;

