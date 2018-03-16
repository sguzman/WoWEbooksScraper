const rp = require('request-promise');
const rxjs = require('rxjs');

const page = require('./page');

rp('http://www.wowebook.co/')
.then(function(body) {
  console.log(page(body));
});
