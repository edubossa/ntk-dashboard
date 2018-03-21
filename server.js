var throng = require('throng');
var constants = require('./server/util/constants');
throng({
    start: startApp,
    workers: constants.workers,
    lifetime: Infinity
});

function startApp(id) {
    var compression = require('compression');
    var vhost = require('vhost');
    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();
    var port = constants.port;
    var cacheMaxAge = constants.cacheMaxAge;

    app.use(bodyParser.json({
        limit: "5mb"
    }));

    app.use(compression());
    var get_ip = require('ipware')().get_ip;
    app.use(function(req, res, next) {
        var ip_info = get_ip(req);
        ip_info.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log(JSON.stringify(ip_info));
        next();
    });
    app.use('/public', express.static(__dirname + '/public', {
        maxAge: cacheMaxAge
    }));
    app.use('/components', express.static(__dirname + '/node_modules', {
        maxAge: cacheMaxAge
    }));
    app.use(vhost(constants.adminHost, express.static(__dirname + '/app')));
    app.use(express.static(__dirname + '/app'));
    app.listen(port, onListen());

    function onListen() {
        console.log("Worker " + id + " loaded with success listening on " + port + "! Good :)");
    }
}
