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
                if (response.statusCode < 300) {
                    notify({
                        got: url,
                        status: response.statusCode,
                        headers: response.headers
                    });

                    resolve({
                        status: response.statusCode,
                        headers: response.headers,
                        data: data.join('')
                    });
                } else if (response.statusCode < 400) {
                    notify({
                        got: url,
                        status: response.statusCode,
                        headers: response.headers,
                        redirect: response.headers.location
                    });

                    resolve(get(response.headers.location));
                } else {
                    notify({
                        got: url,
                        status: response.statusCode,
                        headers: response.headers
                    });

                    reject({
                        status: response.statusCode,
                        headers: response.headers,
                        data: data.join('')
                    });
                }
            });
        }).on('error', reject);
    });
}
