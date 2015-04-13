# get-promise

HTTP(S) GET with promises. Handles redirects transparently, but
notifies about them.

Treats all responses as UTF-8 encoded text.

## Usage

    var get = require('get-promise');

    http.get('http://brainshave.com').then(function (result) {
        // result is:
        // {
        //     status: statusCode,
        //     headers: { … },
        //     data: responseBody
        // }
        }
    }, function (error) {
        // error is either:
        // - same as 'result' above for HTTP error
        // - an exception for other errors
    }, function (notice) {
        // notice is either:
        // {
        //     got: uri,
        //     status: statusCode,
        //     headers: { … }
        // }
        // or in case of redirect
        // {
        //     got: uri,
        //     redirect: headers.location
        //     status: statusCode,
        //     headers: { … }
        // }
    });

## LICENSE

MIT
