!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.nba=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[]
},{}],2:[function(require,module,exports){
module.exports=require(1)
},{"/Users/nickbottomley/Documents/dev/github/nick/nba-api/data/players.json":1}],3:[function(require,module,exports){
var qs = require( "query-string" );

var Promise = require( "./promise" );

var PREFIX = "__jsonp__";

module.exports = function jsonpStrategy ( url, query ) {
  return new Promise( function ( resolve, reject ) {
    var fnName, script, src;

    function cleanup () {
      document.body.removeChild( script );
      script = null;
      delete window[fnName];
    }

    if ( query == null ) {
      query = {};
    }

    fnName = PREFIX + Math.random().toString( 36 ).slice( 2 );
    script = document.createElement( "script" );

    script.onerror = function () {
      cleanup();
      reject();
    };

    window[fnName] = function ( data ) {
      cleanup();
      resolve( data );
    };

    query.callback = fnName;
    script.src = url + "?" + qs.stringify( query );
    document.body.appendChild( script );
  });
};

},{"./promise":9,"query-string":26}],4:[function(require,module,exports){
var Promise = require( "./promise" );

module.exports = function scriptTagStrategy ( url, globalName ) {
  return new Promise( function ( resolve, reject ) {
    var script, prev, temp;

    function cleanup () {
      document.body.removeChild( script );
      script = null;
      window[globalName] = prev;
    }

    prev = window[globalName];
    script = document.body.createElement( "script" );

    Object.assign( script, {
      src: url,
      onload: function () {
        temp = window[globalName];
        cleanup();
        resolve( temp );
      },
      onerror: function () {
        cleanup();
        reject();
      }
    });

    document.body.appendChild( script );
  });
};

},{"./promise":9}],5:[function(require,module,exports){
var getJSON = require( "./get-json" );
var util = require( "./util" );

var CURRENT_SEASON = "2014-15";
var PLAYERS_URL = "http://stats.nba.com/stats/commonallplayers/";

var query = {
  LeagueID: "00",
  IsOnlyCurrentSeason: "1",
  Season: CURRENT_SEASON
};

module.exports = function() {
  return getJSON( PLAYERS_URL, query ).then( function ( resp ) {
    return util.playersResponseTransform( resp );
  });
};

},{"./get-json":3,"./util":12}],6:[function(require,module,exports){
var Promise = require( "./promise" );

var getJSON = require( "./get-json" );
var maps = require( "./maps" );
var util = require( "./util" );

var TEAM_STAT_URL = "http://stats.nba.com/stats/leaguedashteamstats";
var TEAM_STAT_QUERY = maps.teamStatDefaults();

var TEAM_INFO_URL = "http://stats.nba.com/stats/commonteamyears";
var TEAM_INFO_QUERY = {
  "LeagueID": "00"
};

module.exports = function () {
  var statReq = getJSON( TEAM_STAT_URL, TEAM_STAT_QUERY );
  var infoReq = getJSON( TEAM_INFO_URL, TEAM_INFO_QUERY );
  return Promise.all([ statReq, infoReq ]).then( function ( responses ) {
    responses = responses.map( util.baseResponseTransform );
    return util.pickKeys( util.mergeCollections( "teamId", responses ),
      "teamId", "abbreviation", "teamName" );
  });
};

},{"./get-json":3,"./maps":7,"./promise":9,"./util":12}],7:[function(require,module,exports){
var extend = require( 'extend' );

// all maps are actually map-returning functions.
// We need to absolutely prevent modules requiring these maps from altering them.
// Options:
//  - Return a "frozen" version (Object.freeze)
//  - Return a copy
//  - Return a new object
//
//  Frozen objects are sub-optimal, primarily since they don't always throw errors.
//  Also, when 'extending' them you need to pass in a new object first. Not a problem with copies.

// TODO: DRY up params
// TODO: Settle on how to pass out these objects

function nbaParams () {
  return {
    "Season": 1,
    "AllStarSeason": 1,
    "SeasonType": 1,
    "LeagueID": 1,
    "MeasureType": 1,
    "PerMode": 1,
    "PlusMinus": 1,
    "PaceAdjust": 1,
    "Rank": 1,
    "Outcome": 1,
    "Location": 1,
    "Month": 1,
    "SeasonSegment": 1,
    "DateFrom": 1,
    "DateTo": 1,
    "OpponentTeamID": 1,
    "VsConference": 1,
    "VsDivision": 1,
    "GameSegment": 1,
    "Period": 1,
    "LastNGames": 1,
    "GameScope": 1,
    "PlayerExperience": 1,
    "PlayerPosition": 1,
    "StarterBench": 1,
    "TeamID": 1,
    "GameID": 1,
    "Position": 1,
    "RookieYear": 1,
    "ContextFilter": 1,
    "ContextMeasure": 1,
    "zone-mode": 1,
    "GroupQuantity": 1,
    "pageNo": 1,
    "rowsPerPage": 1
  };
}

function jsParams () {
  return {
    "season": 1,
    "allStarSeason": 1,
    "seasonType": 1,
    "leagueId": 1,
    "measureType": 1,
    "perMode": 1,
    "plusMinus": 1,
    "paceAdjust": 1,
    "rank": 1,
    "outcome": 1,
    "location": 1,
    "month": 1,
    "seasonSegment": 1,
    "dateFrom": 1,
    "dateTo": 1,
    "opponentTeamId": 1,
    "vsConference": 1,
    "vsDivision": 1,
    "gameSegment": 1,
    "period": 1 ,
    "lastNGames": 1,
    "gameScope": 1,
    "playerExperience": 1,
    "playerPosition": 1,
    "starterBench": 1,
    "teamId": 1,
    "gameId": 1,
    "position": 1,
    "rookieYear": 1,
    "contextFilter": 1,
    "contextMeasure": 1,
    "zoneMode": 1,
    "groupQuantity": 1,
    "pageNo": 1,
    "rowsPerPage": 1
  };
}

function twoWayMap () {
  return {
    "Season": "season",
    "season": "Season",
    "AllStarSeason": "allStarSeason",
    "allStarSeason": "AllStarSeason",
    "SeasonType": "seasonType",
    "seasonType": "SeasonType",
    "LeagueID": "leagueId",
    "leagueId": "LeagueID",
    "MeasureType": "measureType",
    "measureType": "MeasureType",
    "PerMode": "perMode",
    "perMode": "PerMode",
    "PlusMinus": "plusMinus",
    "plusMinus": "PlusMinus",
    "PaceAdjust": "paceAdjust",
    "paceAdjust": "PaceAdjust",
    "Rank": "rank",
    "rank": "Rank",
    "Outcome": "outcome",
    "outcome": "Outcome",
    "Location": "location",
    "location": "Location",
    "Month": "month",
    "month": "Month",
    "SeasonSegment": "seasonSegment",
    "seasonSegment": "SeasonSegment",
    "DateFrom": "dateFrom",
    "dateFrom": "DateFrom",
    "DateTo": "dateTo",
    "dateTo": "DateTo",
    "OpponentTeamID": "opponentTeamId",
    "opponentTeamId": "OpponentTeamID",
    "VsConference": "vsConference",
    "vsConference": "VsConference",
    "VsDivision": "vsDivision",
    "vsDivision": "VsDivision",
    "GameSegment": "gameSegment",
    "gameSegment": "GameSegment",
    "Period": "period",
    "period": "Period",
    "LastNGames": "lastNGames",
    "lastNGames": "LastNGames",
    "GameScope": "gameScope",
    "gameScope": "GameScope",
    "PlayerExperience": "playerExperience",
    "playerExperience": "PlayerExperience",
    "PlayerPosition": "playerPosition",
    "playerPosition": "PlayerPosition",
    "StarterBench": "starterBench",
    "starterBench": "StarterBench",
    "TeamID": "teamId",
    "teamId": "TeamID",
    "GameID": "gameId",
    "gameId": "GameID",
    "Position": "position",
    "position": "Position",
    "RookieYear": "rookieYear",
    "rookieYear": "RookieYear",
    "ContextFilter": "contextFilter",
    "contextFilter": "ContextFilter",
    "ContextMeasure": "contextMeasure",
    "contextMeasure": "ContextMeasure",
    "zone-mode": "zoneMode",
    "zoneMode": "zone-mode",
    "GroupQuantity": "groupQuantity",
    "groupQuantity": "GroupQuantity",
    "pageNo": "pageNo",
    "rowsPerPage": "rowsPerPage"
  };
}

function shotDefaults () {
  return {
    'Season': '2013-14',
    'SeasonType': 'Regular Season',
    'LeagueID': '00',
    'PlayerID': '0',
    'TeamID': '0',
    'GameID': '',
    'Outcome': '',
    'Location': '',
    'Month': '0',
    'SeasonSegment': '',
    'DateFrom': '',
    'DateTo': '',
    'OpponentTeamID': '0',
    'VsConference': '',
    'VsDivision': '',
    'Position': '',
    'RookieYear': '',
    'GameSegment': '',
    'Period': '0',
    'LastNGames': '0',
    'ContextFilter': '',
    'ContextMeasure': 'FG_PCT',
    'zone-mode': 'basic'
  };
}

function teamStatDefaults () {
  return {
    'Season': '2013-14',
    'AllStarSeason': '',
    'SeasonType': 'Regular Season',
    'LeagueID': '00',
    'MeasureType': 'Base',
    'PerMode': 'PerGame',
    'PlusMinus': 'N',
    'PaceAdjust': 'N',
    'Rank': 'N',
    'Outcome': '',
    'Location': '',
    'Month': '0',
    'SeasonSegment': '',
    'DateFrom': '',
    'DateTo': '',
    'OpponentTeamID': '0',
    'VsConference': '',
    'VsDivision': '',
    'GameSegment': '',
    'Period': '0',
    'LastNGames': '0',
    'GameScope': '',
    'PlayerExperience': '',
    'PlayerPosition': '',
    'StarterBench': ''
  };
};

function playerSplitsDefaults () {
  return {
    "Season": "2013-14",
    "SeasonType": "Playoffs",
    "LeagueID": "00",
    "PlayerID": "201142",
    "MeasureType": "Base",
    "PerMode": "PerGame",
    "PlusMinus": "N",
    "PaceAdjust": "N",
    "Rank": "N",
    "Outcome": "",
    "Location": "",
    "Month": "0",
    "SeasonSegment": "",
    "DateFrom": "",
    "DateTo": "",
    "OpponentTeamID": "0",
    "VsConference": "",
    "VsDivision": "",
    "GameSegment": "",
    "Period": "0",
    "LastNGames": "0"
  };
}


module.exports = {
  nbaParams: nbaParams,
  jsParams: jsParams,
  twoWayMap: twoWayMap,
  shotDefaults: shotDefaults,
  teamStatDefaults: teamStatDefaults
};

// alternate method w/o freeze & such
// assuming a "maps" object with all the maps in it...
// var maps = {};
// module.exports = Object.keys( maps ).reduce( function ( result, key ) {
//   result[key] = function () {
//     return extend( {}, maps[key] );
//   };
//   return result;
// }, {} );

},{"extend":24}],8:[function(require,module,exports){
Object.assign = require( "object-assign" );

},{"object-assign":25}],9:[function(require,module,exports){
module.exports = require( 'es6-promise' ).Promise;
},{"es6-promise":14}],10:[function(require,module,exports){
var SHOT_URL = "http://stats.nba.com/stats/shotchartdetail";

var extend = require( "extend" );

var Promise = require( "./promise" );

var maps = require( "./maps" );
var util = require( "./util" );
var getJSON = require( "./get-json" );

var translateOptions = util.partial( util.translateKeys, maps.twoWayMap() );

module.exports = function ( options ) {
  if ( options == null ) {
    options = {};
  }
  options = translateOptions( options );
  return getJSON( SHOT_URL, extend( maps.shotDefaults(), options ) )
    .then( util.baseResponseTransform );
};

},{"./get-json":3,"./maps":7,"./promise":9,"./util":12,"extend":24}],11:[function(require,module,exports){
var Promise = require( "./promise" );
var getScript = require( "./get-script" );

var sportVuScripts = {
  speed: {
    url: "http://stats.nba.com/js/data/sportvu/speedData.js",
    varName: "speedData",
  },
  touches: {
    url: "http://stats.nba.com/js/data/sportvu/touchesData.js",
    varName: "touchesData",
  },
  passing: {
    url: "http://stats.nba.com/js/data/sportvu/passingData.js",
    varName: "passingData",
  },
  defense: {
    url: "http://stats.nba.com/js/data/sportvu/defenseData.js",
    varName: "defenseData",
  },
  rebounding: {
    url: "http://stats.nba.com/js/data/sportvu/reboundingData.js",
    varName: "reboundingData",
  },
  drives: {
    url: "http://stats.nba.com/js/data/sportvu/drivesData.js",
    varName: "drivesData",
  },
  shooting: {
    url: "http://stats.nba.com/js/data/sportvu/shootingData.js",
    varName: "shootingData",
  },
  catchShoot: {
    url: "http://stats.nba.com/js/data/sportvu/catchShootData.js",
    varName: "catchShootData",
  },
  pullUpShoot: {
    url: "http://stats.nba.com/js/data/sportvu/pullUpShootData.js",
    varName: "pullUpShootData",
  }
};

var getSportVu = (function () {
  var cache = {};
  return function ( key ) {
    var item;
    if ( cache[key] ) {
      return new Promise(function ( resolve, reject ) {
        resolve( cache[key] );
      });
    }
    item = sportVuScripts[key];
    return getScript( item.url, item.varName ).then(function ( result ) {
      cache[key] = result;
      return result;
    });
  };
})();

module.exports = Object.keys( sportVuScripts ).reduce(function ( obj, key ) {
  obj[key] = function () {
    return getSportVu( key );
  };
  return obj;
}, {} );

},{"./get-script":4,"./promise":9}],12:[function(require,module,exports){
function merge ( target ) {
  var source;
  var keys;
  for ( var i = 1; i < arguments.length; i++ ) {
    source = arguments[i];
    keys = Object.keys( source );
    for ( var j = 0; j < keys.length; j++ ) {
      target[keys[j]] = source[keys[j]];
    }
  }
  return target;
}

function shallowCopy ( obj ) {
  return merge( {}, obj );
}


function mapKeysAndValues ( obj, cb ) {
  return Object.keys( obj ).reduce( function( result, key ) {
    var pair = cb( obj[key], key );
    result[ pair[0] ] = pair[1];
    return result;
  }, {} );
}

function mapValues ( obj, cb ) {
  return mapKeysAndValues( obj, function ( value, key ) {
    return [ key, cb( value, key ) ];
  });
}

function mapKeys ( obj, cb ) {
  return mapKeysAndValues( obj, function ( value, key ) {
    return [ cb( value, key ), value ];
  });
}

function collectify ( headers, rows ) {
  return rows.map( function ( item ) {
    return item.reduce( function ( model, val, i ) {
      model[ headers[i] ] = val;
      return model;
    }, {} );
  });
}

function translateKeys ( keyMap, obj ) {
  return Object.keys( obj ).reduce( function ( result, key ) {
    result[ keyMap[key] ] = obj[ key ];
    return result;
  }, {} );
}

function partial ( fn ) {
  var outerArgs = [];
  for ( var i = 1; i < arguments.length; i++ ) {
    outerArgs[i - 1] = arguments[i];
  }
  return function () {
    var args = outerArgs.slice();
    for ( var i = 0; i < arguments.length; i++ ) {
      args[ args.length ] = arguments[i];
    }
    return fn.apply( this, args );
  };
}

function camelize ( str ) {
  return str.trim().replace( /[-_\s]+(.)?/g, function ( match, c ){
    return c ? c.toUpperCase() : "";
  });
}

function jsifyHeaders ( arr ) {
  return arr.map( function ( item ) {
    return camelize( item.toLowerCase() );
  });
}

function baseResponseTransform ( resp ) {
  var data = resp.resultSets[0];
  var headers = jsifyHeaders( data.headers );
  return collectify( headers, data.rowSet );
}

function generalResponseTransform ( resp ) {
  return resp.resultSets.map( function ( resultSet ) {
    return collectify( jsifyHeaders( resultSet.headers ), resultSet.row );
  });
}

function playersResponseTransform ( resp ) {
  return baseResponseTransform( resp )
      .map( function ( player ) {
        var result = shallowCopy( player );
        var names = result.displayLastCommaFirst.split( ", " ).reverse();
        result.firstName = names[0].trim();
        result.lastName = ( names[1] ? names[1] : "" ).trim();
        result.fullName = result.firstName + ( result.lastName ? " " + result.lastName : "" );
        result.playerId = result.personId;
        return result;
    });
}

function matches ( matcher, against ) {
  var keys = Object.keys( matcher );
  for ( var i = 0; i < keys.length; i++ ) {
    if ( matcher[keys[i]] !== against[keys[i]] ) {
      return false;
    }
  }
  return true;
}

function findWhere ( matcher, arr ) {
  for ( var i = 0; i < arr.length; i++ ) {
    if ( matches( matcher, arr[i] ) ) {
      return arr[i];
    }
  }
  return null;
}

function mergeCollections ( idProp, collections ) {
  var first = collections.shift();
  return first.map( function ( itemA ) {
    var matcher = {};
    matcher[idProp] = itemA[idProp];
    var findMatch = partial( findWhere, matcher );
    var items = [{}, itemA].concat( collections.map( findMatch ) );
    return merge.apply( null, items );
  });
}

function pickKeys ( arr ) {
  var args = [];
  for ( var i = 1; i < arguments.length; i++ ) {
    args[i - 1] = arguments[i];
  }
  return arr.map( function ( item ) {
    return args.reduce( function ( obj, key ) {
      obj[key] = item[key];
      return obj;
    }, {} );
  });
}

module.exports = {
  shallowCopy: shallowCopy,
  mapKeysAndValues: mapKeysAndValues,
  mapValues: mapValues,
  mapKeys: mapKeys,
  pickKeys: pickKeys,
  collectify: collectify,
  translateKeys: translateKeys,
  partial: partial,
  camelize: camelize,
  jsifyHeaders: jsifyHeaders,
  mergeCollections: mergeCollections,
  baseResponseTransform: baseResponseTransform,
  playersResponseTransform: playersResponseTransform
};

},{}],13:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],14:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":18,"./promise/promise":19}],15:[function(require,module,exports){
"use strict";
/* global toString */

var isArray = require("./utils").isArray;
var isFunction = require("./utils").isFunction;

/**
  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The return promise
  is fulfilled with an array that gives all the values in the order they were
  passed in the `promises` array argument.

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.resolve(2);
  var promise3 = RSVP.resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.reject(new Error("2"));
  var promise3 = RSVP.reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for RSVP
  @param {Array} promises
  @param {String} label
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
*/
function all(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to all.');
  }

  return new Promise(function(resolve, reject) {
    var results = [], remaining = promises.length,
    promise;

    if (remaining === 0) {
      resolve([]);
    }

    function resolver(index) {
      return function(value) {
        resolveAll(index, value);
      };
    }

    function resolveAll(index, value) {
      results[index] = value;
      if (--remaining === 0) {
        resolve(results);
      }
    }

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && isFunction(promise.then)) {
        promise.then(resolver(i), reject);
      } else {
        resolveAll(i, promise);
      }
    }
  });
}

exports.all = all;
},{"./utils":23}],16:[function(require,module,exports){
(function (process,global){
"use strict";
var browserGlobal = (typeof window !== 'undefined') ? window : {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

// node
function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

function useSetTimeout() {
  return function() {
    local.setTimeout(flush, 1);
  };
}

var queue = [];
function flush() {
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var callback = tuple[0], arg = tuple[1];
    callback(arg);
  }
  queue = [];
}

var scheduleFlush;

// Decide what async method to use to triggering processing of queued callbacks:
if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else {
  scheduleFlush = useSetTimeout();
}

function asap(callback, arg) {
  var length = queue.push([callback, arg]);
  if (length === 1) {
    // If length is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush();
  }
}

exports.asap = asap;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":13}],17:[function(require,module,exports){
"use strict";
var config = {
  instrument: false
};

function configure(name, value) {
  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

exports.config = config;
exports.configure = configure;
},{}],18:[function(require,module,exports){
(function (global){
"use strict";
/*global self*/
var RSVPPromise = require("./promise").Promise;
var isFunction = require("./utils").isFunction;

function polyfill() {
  var local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof window !== 'undefined' && window.document) {
    local = window;
  } else {
    local = self;
  }

  var es6PromiseSupport = 
    "Promise" in local &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    "resolve" in local.Promise &&
    "reject" in local.Promise &&
    "all" in local.Promise &&
    "race" in local.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new local.Promise(function(r) { resolve = r; });
      return isFunction(resolve);
    }());

  if (!es6PromiseSupport) {
    local.Promise = RSVPPromise;
  }
}

exports.polyfill = polyfill;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise":19,"./utils":23}],19:[function(require,module,exports){
"use strict";
var config = require("./config").config;
var configure = require("./config").configure;
var objectOrFunction = require("./utils").objectOrFunction;
var isFunction = require("./utils").isFunction;
var now = require("./utils").now;
var all = require("./all").all;
var race = require("./race").race;
var staticResolve = require("./resolve").resolve;
var staticReject = require("./reject").reject;
var asap = require("./asap").asap;

var counter = 0;

config.async = asap; // default async is asap;

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  if (!(this instanceof Promise)) {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  this._subscribers = [];

  invokeResolver(resolver, this);
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (handleThenable(promise, value)) {
    return;
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = null;
}

Promise.prototype = {
  constructor: Promise,

  _state: undefined,
  _detail: undefined,
  _subscribers: undefined,

  then: function(onFulfillment, onRejection) {
    var promise = this;

    var thenPromise = new this.constructor(function() {});

    if (this._state) {
      var callbacks = arguments;
      config.async(function invokePromiseCallback() {
        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
      });
    } else {
      subscribe(this, thenPromise, onFulfillment, onRejection);
    }

    return thenPromise;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = all;
Promise.race = race;
Promise.resolve = staticResolve;
Promise.reject = staticReject;

function handleThenable(promise, value) {
  var then = null,
  resolved;

  try {
    if (promise === value) {
      throw new TypeError("A promises callback cannot return that same promise.");
    }

    if (objectOrFunction(value)) {
      then = value.then;

      if (isFunction(then)) {
        then.call(value, function(val) {
          if (resolved) { return true; }
          resolved = true;

          if (value !== val) {
            resolve(promise, val);
          } else {
            fulfill(promise, val);
          }
        }, function(val) {
          if (resolved) { return true; }
          resolved = true;

          reject(promise, val);
        });

        return true;
      }
    }
  } catch (error) {
    if (resolved) { return true; }
    reject(promise, error);
    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (!handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = value;

  config.async(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = reason;

  config.async(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports.Promise = Promise;
},{"./all":15,"./asap":16,"./config":17,"./race":20,"./reject":21,"./resolve":22,"./utils":23}],20:[function(require,module,exports){
"use strict";
/* global toString */
var isArray = require("./utils").isArray;

/**
  `RSVP.race` allows you to watch a series of promises and act as soon as the
  first promise given to the `promises` argument fulfills or rejects.

  Example:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 2");
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // result === "promise 2" because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.race` is deterministic in that only the state of the first completed
  promise matters. For example, even if other promises given to the `promises`
  array argument are resolved, but the first completed promise has become
  rejected before the other promises became fulfilled, the returned promise
  will become rejected:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error("promise 2"));
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // Code here never runs because there are rejected promises!
  }, function(reason){
    // reason.message === "promise2" because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  @method race
  @for RSVP
  @param {Array} promises array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise that becomes fulfilled with the value the first
  completed promises is resolved with if the first completed promise was
  fulfilled, or rejected with the reason that the first completed promise
  was rejected with.
*/
function race(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to race.');
  }
  return new Promise(function(resolve, reject) {
    var results = [], promise;

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

exports.race = race;
},{"./utils":23}],21:[function(require,module,exports){
"use strict";
/**
  `RSVP.reject` returns a promise that will become rejected with the passed
  `reason`. `RSVP.reject` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for RSVP
  @param {Any} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become rejected with the given
  `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Promise = this;

  return new Promise(function (resolve, reject) {
    reject(reason);
  });
}

exports.reject = reject;
},{}],22:[function(require,module,exports){
"use strict";
function resolve(value) {
  /*jshint validthis:true */
  if (value && typeof value === 'object' && value.constructor === this) {
    return value;
  }

  var Promise = this;

  return new Promise(function(resolve) {
    resolve(value);
  });
}

exports.resolve = resolve;
},{}],23:[function(require,module,exports){
"use strict";
function objectOrFunction(x) {
  return isFunction(x) || (typeof x === "object" && x !== null);
}

function isFunction(x) {
  return typeof x === "function";
}

function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function() { return new Date().getTime(); };


exports.objectOrFunction = objectOrFunction;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.now = now;
},{}],24:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],25:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var pendingException;
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}
	}

	if (pendingException) {
		throw pendingException;
	}

	return to;
};

},{}],26:[function(require,module,exports){
/*!
	query-string
	Parse and stringify URL query strings
	https://github.com/sindresorhus/query-string
	by Sindre Sorhus
	MIT License
*/
(function () {
	'use strict';
	var queryString = {};

	queryString.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#)/, '');

		if (!str) {
			return {};
		}

		return str.trim().split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			var key = parts[0];
			var val = parts[1];

			key = decodeURIComponent(key);
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	queryString.stringify = function (obj) {
		return obj ? Object.keys(obj).map(function (key) {
			var val = obj[key];

			if (Array.isArray(val)) {
				return val.map(function (val2) {
					return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
				}).join('&');
			}

			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		}).join('&') : '';
	};

	if (typeof define === 'function' && define.amd) {
		define(function() { return queryString; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = queryString;
	} else {
		window.queryString = queryString;
	}
})();

},{}],27:[function(require,module,exports){
require( "./polyfills" );

var Promise = require( "./promise" );
var getTeamsInfo = require( "./info-teams" );
var getPlayersInfo = require( "./info-players" );

var playersPromise, teamsPromise, readyPromise;
var nba = {};

function immediatelyResolvedPromise ( value ) {
  return new Promise( function ( resolve ) {
    resolve( value );
  });
}

function updatePlayerInfo () {
  return getTeamsInfo().then( function ( resp ) {
    nba.teamInfo = resp;
  });
}

function updateTeamInfo () {
  return getPlayersInfo().then( function ( resp ) {
    nba.playerInfo = resp;
  });
}

Object.assign( nba, {
  sportVu: require( "./sport-vu" ),
  shots: require( "./shots" ),
  playersInfo: require( "../data/players.json" ),
  updatePlayersInfo: updatePlayerInfo,
  teamsInfo: require( "../data/teams.json" ),
  updateTeamsInfo: updateTeamInfo,
  ready: function ( callback ) {
    readyPromise.then( callback );
  }
});

// To provide consistent .ready() API for both light & regular versions.
playersPromise = nba.playersInfo.length ?
  immediatelyResolvedPromise() :
  updatePlayerInfo();

teamsPromise = nba.teamsInfo.length ?
  immediatelyResolvedPromise() :
  updateTeamInfo();

readyPromise = Promise.all([ playersPromise, teamsPromise ]);

module.exports = nba;

},{"../data/players.json":1,"../data/teams.json":2,"./info-players":5,"./info-teams":6,"./polyfills":8,"./promise":9,"./shots":10,"./sport-vu":11}]},{},[27])(27)
});