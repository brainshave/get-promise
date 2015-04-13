'use strict';

var Q = require('q');
var parseURL = require('url').parse;

module.exports = get;

function get (url, options) {
    options = options || {};

    var config = parseURL(url);
    config.method = options.method || 'GET';

    return Q.Promise(function (resolve, reject, notify) {
        var http = require(url.match(/^https?/)[0]);

        http.request(config, function (response) {
            response.setEncoding('utf8');
            var data = [];

            response.on('data', function (chunk) {
                data.push(chunk);
            });

            response.on('end', function () {
                if (response.statusCode < 300) {
                    notify({
                        url: url,
                        options: options,
                        status: response.statusCode,
                        headers: response.headers
                    });

                    resolve({
                        url: url,
                        options: options,
                        status: response.statusCode,
                        headers: response.headers,
                        data: data.join('')
                    });
                } else if (response.statusCode < 400) {
                    notify({
                        url: url,
                        options: options,
                        status: response.statusCode,
                        headers: response.headers,
                        redirect: response.headers.location
                    });

                    resolve(get(response.headers.location));
                } else {
                    notify({
                        url: url,
                        options: options,
                        status: response.statusCode,
                        headers: response.headers
                    });

                    reject({
                        url: url,
                        options: options,
                        status: response.statusCode,
                        headers: response.headers,
                        data: data.join('')
                    });
                }
            });
        }).on('error', reject).end();
    });
}
