const rp = require('request-promise');
const rxjs = require('rxjs');
const args = require('minimist')(process.argv.slice(2));

const page = require('./page');

rxjs.Observable.range(1, args.n)
  .flatMap(t => rxjs.Observable.fromPromise(rp(`http://www.wowebook.co/page/${t}/`)))
  .map(t => page(t))
  .subscribe(t => console.log(t));
