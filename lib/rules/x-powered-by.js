const _ = require('underscore');

/**
* Checks that ASPNET does not include the value
**/
module.exports = exports = function(payload, fn) {

  // get the response
  payload.getResponse(function(err, response) {

    // check if it's a error
    if(err) {

      // output error
      payload.error('Something went wrong while trying to find the response', err);

      // done
      return fn(null);

    }

    // sanity check
    if(!(response || {}).headers) 
      return fn(null);
    if(Array.isArray( (response || {}).headers ) === false) 
      return fn(null);

    // find the header to check
    var header = _.find(response.headers || [], function(item) {

      return ((item || {}).name || '').toLowerCase() === 'x-powered-by';

    });

    // if we found the header
    if(!header)
      return fn(null);

    // add the actual rule
    payload.addRule({

      message:        'X-Powered-By header found',
      type:           'warning',
      key:            'poweredby'

    }, {

      display:        'text',
      header:         'HTTP Header X-Powered-By should be removed',
      message:        'Remove $: $',
      identifiers:    [ header.name, header.value ]

    })

    fn(null);

  });

};