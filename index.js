'use strict';

var Q = require('q');

module.exports = get;

function get (url) {
    return Q.Promise(function (resolve, reject, notify) {
        var http = require(url.match(/^https?/)[0]);

        http.get(url, function (response) {
            response.setEncoding('utf8');
            var data = [];

            response.on('data', function (chunk) {
                data.push(chunk);
            });

            response.on('end', function () {
                notify({ got: url, code: response.statusCode });

                if (response.statusCode < 300) {
                    resolve({
                        status: response.statusCode,
                        data: data.join('')
                    });
                } else if (response.statusCode < 400) {
                    notify({ redirect: response.headers.location });
                    resolve(get(response.headers.location));
                } else {
                    reject({
                        status: response.statusCode,
                        data: data.join('')
                    });
                }
            });
        }).on('error', reject);
    });
}
