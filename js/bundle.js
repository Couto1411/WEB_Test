(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('8f27c21012e148c19e8b6a8277cec24d',{ corsProxyUrl: 'https://cors-anywhere.herokuapp.com/' });
newsapi.v2.everything({
    q: 'sustentabilidade',
    sortBy: 'publishedAt'
}).then(
    res => handleRes(res)
);
const storiesContainer = document.getElementById('stories-container');
const storyContainer = document.getElementById('story-container');
function handleRes(data) {
    // Access fetched data as array
    let dataArray = Object.entries(data.articles);

    // Create each article using map
    let article, articleContent;
    dataArray.map((story) => {

        // Construct content of each with template literal              
        articleContent = `
        <div class="row pb-2 border-bottom border-secondary">
            <div class="col-lg-4 col-md-6">
                <img class="img-fluid" src="${story[1].urlToImage}">
            </div>
            <div class="col-lg-8 col-md-6">
                <a href="${story[1].url}">${story[1].title}</a>
                <ul class="hidden-mobile">
                    <li>${story[1].description}</li>
                </ul>
            </div>
        </div>
        `
        article = document.createElement('article');
        article.innerHTML = articleContent;
        if (story[1].type == "article") {
            storiesContainer.append(article);
        }
   })
}
},{"newsapi":181}],5:[function(require,module,exports){
var isCallable = require('../internals/is-callable');
var tryToString = require('../internals/try-to-string');

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};

},{"../internals/is-callable":78,"../internals/try-to-string":141}],6:[function(require,module,exports){
var isConstructor = require('../internals/is-constructor');
var tryToString = require('../internals/try-to-string');

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};

},{"../internals/is-constructor":79,"../internals/try-to-string":141}],7:[function(require,module,exports){
var isCallable = require('../internals/is-callable');

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

},{"../internals/is-callable":78}],8:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var defineProperty = require('../internals/object-define-property').f;

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/object-create":96,"../internals/object-define-property":98,"../internals/well-known-symbol":147}],9:[function(require,module,exports){
var isPrototypeOf = require('../internals/object-is-prototype-of');

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};

},{"../internals/object-is-prototype-of":105}],10:[function(require,module,exports){
var isObject = require('../internals/is-object');

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};

},{"../internals/is-object":81}],11:[function(require,module,exports){
// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = require('../internals/fails');

module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});

},{"../internals/fails":52}],12:[function(require,module,exports){
'use strict';
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var isConstructor = require('../internals/is-constructor');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/call-with-safe-iteration-closing":21,"../internals/create-property":32,"../internals/function-bind-context":55,"../internals/function-call":58,"../internals/get-iterator":63,"../internals/get-iterator-method":62,"../internals/is-array-iterator-method":76,"../internals/is-constructor":79,"../internals/length-of-array-like":88,"../internals/to-object":136}],13:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/length-of-array-like":88,"../internals/to-absolute-index":132,"../internals/to-indexed-object":133}],14:[function(require,module,exports){
var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

},{"../internals/array-species-create":20,"../internals/function-bind-context":55,"../internals/function-uncurry-this":60,"../internals/indexed-object":71,"../internals/length-of-array-like":88,"../internals/to-object":136}],15:[function(require,module,exports){
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/engine-v8-version":49,"../internals/fails":52,"../internals/well-known-symbol":147}],16:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

},{"../internals/fails":52}],17:[function(require,module,exports){
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');

var $Array = Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};

},{"../internals/create-property":32,"../internals/length-of-array-like":88,"../internals/to-absolute-index":132}],18:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis([].slice);

},{"../internals/function-uncurry-this":60}],19:[function(require,module,exports){
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};

},{"../internals/is-array":77,"../internals/is-constructor":79,"../internals/is-object":81,"../internals/well-known-symbol":147}],20:[function(require,module,exports){
var arraySpeciesConstructor = require('../internals/array-species-constructor');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

},{"../internals/array-species-constructor":19}],21:[function(require,module,exports){
var anObject = require('../internals/an-object');
var iteratorClose = require('../internals/iterator-close');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

},{"../internals/an-object":10,"../internals/iterator-close":85}],22:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":147}],23:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

},{"../internals/function-uncurry-this":60}],24:[function(require,module,exports){
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var isCallable = require('../internals/is-callable');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

},{"../internals/classof-raw":23,"../internals/is-callable":78,"../internals/to-string-tag-support":139,"../internals/well-known-symbol":147}],25:[function(require,module,exports){
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var defineBuiltIns = require('../internals/define-built-ins');
var bind = require('../internals/function-bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    defineBuiltIns(Prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    defineBuiltIns(Prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(Prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/an-instance":9,"../internals/define-built-ins":34,"../internals/define-iterator":36,"../internals/descriptors":38,"../internals/function-bind-context":55,"../internals/internal-metadata":74,"../internals/internal-state":75,"../internals/iterate":84,"../internals/object-create":96,"../internals/object-define-property":98,"../internals/set-species":123}],26:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var defineBuiltIn = require('../internals/define-built-in');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
    defineBuiltIn(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        uncurriedNativeMethod(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced(
    CONSTRUCTOR_NAME,
    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/an-instance":9,"../internals/check-correctness-of-iteration":22,"../internals/define-built-in":33,"../internals/export":51,"../internals/fails":52,"../internals/function-uncurry-this":60,"../internals/global":65,"../internals/inherit-if-required":72,"../internals/internal-metadata":74,"../internals/is-callable":78,"../internals/is-forced":80,"../internals/is-object":81,"../internals/iterate":84,"../internals/set-to-string-tag":124}],27:[function(require,module,exports){
var hasOwn = require('../internals/has-own-property');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

},{"../internals/has-own-property":66,"../internals/object-define-property":98,"../internals/object-get-own-property-descriptor":99,"../internals/own-keys":112}],28:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":52}],29:[function(require,module,exports){
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":31,"../internals/iterators":87,"../internals/iterators-core":86,"../internals/object-create":96,"../internals/set-to-string-tag":124}],30:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":31,"../internals/descriptors":38,"../internals/object-define-property":98}],31:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],32:[function(require,module,exports){
'use strict';
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":31,"../internals/object-define-property":98,"../internals/to-property-key":138}],33:[function(require,module,exports){
var isCallable = require('../internals/is-callable');
var definePropertyModule = require('../internals/object-define-property');
var makeBuiltIn = require('../internals/make-built-in');
var defineGlobalProperty = require('../internals/define-global-property');

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

},{"../internals/define-global-property":35,"../internals/is-callable":78,"../internals/make-built-in":89,"../internals/object-define-property":98}],34:[function(require,module,exports){
var defineBuiltIn = require('../internals/define-built-in');

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};

},{"../internals/define-built-in":33}],35:[function(require,module,exports){
var global = require('../internals/global');

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":65}],36:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var IS_PURE = require('../internals/is-pure');
var FunctionName = require('../internals/function-name');
var isCallable = require('../internals/is-callable');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIn = require('../internals/define-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};

},{"../internals/create-iterator-constructor":29,"../internals/create-non-enumerable-property":30,"../internals/define-built-in":33,"../internals/export":51,"../internals/function-call":58,"../internals/function-name":59,"../internals/is-callable":78,"../internals/is-pure":82,"../internals/iterators":87,"../internals/iterators-core":86,"../internals/object-get-prototype-of":103,"../internals/object-set-prototype-of":109,"../internals/set-to-string-tag":124,"../internals/well-known-symbol":147}],37:[function(require,module,exports){
var path = require('../internals/path');
var hasOwn = require('../internals/has-own-property');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has-own-property":66,"../internals/object-define-property":98,"../internals/path":113,"../internals/well-known-symbol-wrapped":146}],38:[function(require,module,exports){
var fails = require('../internals/fails');

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":52}],39:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":65,"../internals/is-object":81}],40:[function(require,module,exports){
var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};

},{}],41:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],42:[function(require,module,exports){
// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = require('../internals/document-create-element');

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

},{"../internals/document-create-element":39}],43:[function(require,module,exports){
module.exports = typeof window == 'object' && typeof Deno != 'object';

},{}],44:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');
var global = require('../internals/global');

module.exports = /ipad|iphone|ipod/i.test(userAgent) && global.Pebble !== undefined;

},{"../internals/engine-user-agent":48,"../internals/global":65}],45:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

},{"../internals/engine-user-agent":48}],46:[function(require,module,exports){
var classof = require('../internals/classof-raw');
var global = require('../internals/global');

module.exports = classof(global.process) == 'process';

},{"../internals/classof-raw":23,"../internals/global":65}],47:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /web0s(?!.*chrome)/i.test(userAgent);

},{"../internals/engine-user-agent":48}],48:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';

},{"../internals/get-built-in":61}],49:[function(require,module,exports){
var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

},{"../internals/engine-user-agent":48,"../internals/global":65}],50:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],51:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIn = require('../internals/define-built-in');
var defineGlobalProperty = require('../internals/define-global-property');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":27,"../internals/create-non-enumerable-property":30,"../internals/define-built-in":33,"../internals/define-global-property":35,"../internals/global":65,"../internals/is-forced":80,"../internals/object-get-own-property-descriptor":99}],52:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],53:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":52}],54:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

},{"../internals/function-bind-native":56}],55:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var NATIVE_BIND = require('../internals/function-bind-native');

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-callable":5,"../internals/function-bind-native":56,"../internals/function-uncurry-this":60}],56:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

},{"../internals/fails":52}],57:[function(require,module,exports){
'use strict';
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var arraySlice = require('../internals/array-slice');
var NATIVE_BIND = require('../internals/function-bind-native');

var $Function = Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};

},{"../internals/a-callable":5,"../internals/array-slice":18,"../internals/function-bind-native":56,"../internals/function-uncurry-this":60,"../internals/has-own-property":66,"../internals/is-object":81}],58:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

},{"../internals/function-bind-native":56}],59:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var hasOwn = require('../internals/has-own-property');

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

},{"../internals/descriptors":38,"../internals/has-own-property":66}],60:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};

},{"../internals/function-bind-native":56}],61:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"../internals/global":65,"../internals/is-callable":78}],62:[function(require,module,exports){
var classof = require('../internals/classof');
var getMethod = require('../internals/get-method');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};

},{"../internals/classof":24,"../internals/get-method":64,"../internals/iterators":87,"../internals/well-known-symbol":147}],63:[function(require,module,exports){
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var getIteratorMethod = require('../internals/get-iterator-method');

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};

},{"../internals/a-callable":5,"../internals/an-object":10,"../internals/function-call":58,"../internals/get-iterator-method":62,"../internals/try-to-string":141}],64:[function(require,module,exports){
var aCallable = require('../internals/a-callable');

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

},{"../internals/a-callable":5}],65:[function(require,module,exports){
(function (global){(function (){
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],66:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

},{"../internals/function-uncurry-this":60,"../internals/to-object":136}],67:[function(require,module,exports){
module.exports = {};

},{}],68:[function(require,module,exports){
var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":65}],69:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":61}],70:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":38,"../internals/document-create-element":39,"../internals/fails":52}],71:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;

},{"../internals/classof-raw":23,"../internals/fails":52,"../internals/function-uncurry-this":60}],72:[function(require,module,exports){
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

},{"../internals/is-callable":78,"../internals/is-object":81,"../internals/object-set-prototype-of":109}],73:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var store = require('../internals/shared-store');

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/function-uncurry-this":60,"../internals/is-callable":78,"../internals/shared-store":126}],74:[function(require,module,exports){
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternalModule = require('../internals/object-get-own-property-names-external');
var isExtensible = require('../internals/object-is-extensible');
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;

},{"../internals/export":51,"../internals/freezing":53,"../internals/function-uncurry-this":60,"../internals/has-own-property":66,"../internals/hidden-keys":67,"../internals/is-object":81,"../internals/object-define-property":98,"../internals/object-get-own-property-names":101,"../internals/object-get-own-property-names-external":100,"../internals/object-is-extensible":104,"../internals/uid":142}],75:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var hasOwn = require('../internals/has-own-property');
var shared = require('../internals/shared-store');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/create-non-enumerable-property":30,"../internals/function-uncurry-this":60,"../internals/global":65,"../internals/has-own-property":66,"../internals/hidden-keys":67,"../internals/is-object":81,"../internals/native-weak-map":94,"../internals/shared-key":125,"../internals/shared-store":126}],76:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":87,"../internals/well-known-symbol":147}],77:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};

},{"../internals/classof-raw":23}],78:[function(require,module,exports){
// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};

},{}],79:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof');
var getBuiltIn = require('../internals/get-built-in');
var inspectSource = require('../internals/inspect-source');

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

},{"../internals/classof":24,"../internals/fails":52,"../internals/function-uncurry-this":60,"../internals/get-built-in":61,"../internals/inspect-source":73,"../internals/is-callable":78}],80:[function(require,module,exports){
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":52,"../internals/is-callable":78}],81:[function(require,module,exports){
var isCallable = require('../internals/is-callable');

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

},{"../internals/is-callable":78}],82:[function(require,module,exports){
module.exports = false;

},{}],83:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

},{"../internals/get-built-in":61,"../internals/is-callable":78,"../internals/object-is-prototype-of":105,"../internals/use-symbol-as-uid":143}],84:[function(require,module,exports){
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var iteratorClose = require('../internals/iterator-close');

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};

},{"../internals/an-object":10,"../internals/function-bind-context":55,"../internals/function-call":58,"../internals/get-iterator":63,"../internals/get-iterator-method":62,"../internals/is-array-iterator-method":76,"../internals/iterator-close":85,"../internals/length-of-array-like":88,"../internals/object-is-prototype-of":105,"../internals/try-to-string":141}],85:[function(require,module,exports){
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getMethod = require('../internals/get-method');

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

},{"../internals/an-object":10,"../internals/function-call":58,"../internals/get-method":64}],86:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var create = require('../internals/object-create');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var defineBuiltIn = require('../internals/define-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/define-built-in":33,"../internals/fails":52,"../internals/is-callable":78,"../internals/is-pure":82,"../internals/object-create":96,"../internals/object-get-prototype-of":103,"../internals/well-known-symbol":147}],87:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"dup":67}],88:[function(require,module,exports){
var toLength = require('../internals/to-length');

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

},{"../internals/to-length":135}],89:[function(require,module,exports){
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var DESCRIPTORS = require('../internals/descriptors');
var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

},{"../internals/descriptors":38,"../internals/fails":52,"../internals/function-name":59,"../internals/has-own-property":66,"../internals/inspect-source":73,"../internals/internal-state":75,"../internals/is-callable":78}],90:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

},{}],91:[function(require,module,exports){
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var macrotask = require('../internals/task').set;
var IS_IOS = require('../internals/engine-is-ios');
var IS_IOS_PEBBLE = require('../internals/engine-is-ios-pebble');
var IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit');
var IS_NODE = require('../internals/engine-is-node');

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // strange IE + webpack dev server bug - use .bind(global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/engine-is-ios":45,"../internals/engine-is-ios-pebble":44,"../internals/engine-is-node":46,"../internals/engine-is-webos-webkit":47,"../internals/function-bind-context":55,"../internals/global":65,"../internals/object-get-own-property-descriptor":99,"../internals/task":131}],92:[function(require,module,exports){
var NATIVE_SYMBOL = require('../internals/native-symbol');

/* eslint-disable es-x/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;

},{"../internals/native-symbol":93}],93:[function(require,module,exports){
/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = require('../internals/engine-v8-version');
var fails = require('../internals/fails');

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"../internals/engine-v8-version":49,"../internals/fails":52}],94:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":65,"../internals/inspect-source":73,"../internals/is-callable":78}],95:[function(require,module,exports){
'use strict';
var aCallable = require('../internals/a-callable');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-callable":5}],96:[function(require,module,exports){
/* global ActiveXObject -- old IE, WSH */
var anObject = require('../internals/an-object');
var definePropertiesModule = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

},{"../internals/an-object":10,"../internals/document-create-element":39,"../internals/enum-bug-keys":50,"../internals/hidden-keys":67,"../internals/html":69,"../internals/object-define-properties":97,"../internals/shared-key":125}],97:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

},{"../internals/an-object":10,"../internals/descriptors":38,"../internals/object-define-property":98,"../internals/object-keys":107,"../internals/to-indexed-object":133,"../internals/v8-prototype-define-bug":144}],98:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":10,"../internals/descriptors":38,"../internals/ie8-dom-define":70,"../internals/to-property-key":138,"../internals/v8-prototype-define-bug":144}],99:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var call = require('../internals/function-call');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

},{"../internals/create-property-descriptor":31,"../internals/descriptors":38,"../internals/function-call":58,"../internals/has-own-property":66,"../internals/ie8-dom-define":70,"../internals/object-property-is-enumerable":108,"../internals/to-indexed-object":133,"../internals/to-property-key":138}],100:[function(require,module,exports){
/* eslint-disable es-x/no-object-getownpropertynames -- safe */
var classof = require('../internals/classof-raw');
var toIndexedObject = require('../internals/to-indexed-object');
var $getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var arraySlice = require('../internals/array-slice-simple');

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/array-slice-simple":17,"../internals/classof-raw":23,"../internals/object-get-own-property-names":101,"../internals/to-indexed-object":133}],101:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":50,"../internals/object-keys-internal":106}],102:[function(require,module,exports){
// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

},{}],103:[function(require,module,exports){
var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":28,"../internals/has-own-property":66,"../internals/is-callable":78,"../internals/shared-key":125,"../internals/to-object":136}],104:[function(require,module,exports){
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es-x/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;

},{"../internals/array-buffer-non-extensible":11,"../internals/classof-raw":23,"../internals/fails":52,"../internals/is-object":81}],105:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis({}.isPrototypeOf);

},{"../internals/function-uncurry-this":60}],106:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

},{"../internals/array-includes":13,"../internals/function-uncurry-this":60,"../internals/has-own-property":66,"../internals/hidden-keys":67,"../internals/to-indexed-object":133}],107:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":50,"../internals/object-keys-internal":106}],108:[function(require,module,exports){
'use strict';
var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

},{}],109:[function(require,module,exports){
/* eslint-disable no-proto -- safe */
var uncurryThis = require('../internals/function-uncurry-this');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/a-possible-prototype":7,"../internals/an-object":10,"../internals/function-uncurry-this":60}],110:[function(require,module,exports){
'use strict';
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/classof":24,"../internals/to-string-tag-support":139}],111:[function(require,module,exports){
var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};

},{"../internals/function-call":58,"../internals/is-callable":78,"../internals/is-object":81}],112:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":10,"../internals/function-uncurry-this":60,"../internals/get-built-in":61,"../internals/object-get-own-property-names":101,"../internals/object-get-own-property-symbols":102}],113:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global;

},{"../internals/global":65}],114:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],115:[function(require,module,exports){
var global = require('../internals/global');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var isCallable = require('../internals/is-callable');
var isForced = require('../internals/is-forced');
var inspectSource = require('../internals/inspect-source');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_PURE = require('../internals/is-pure');
var V8_VERSION = require('../internals/engine-v8-version');

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};

},{"../internals/engine-is-browser":43,"../internals/engine-v8-version":49,"../internals/global":65,"../internals/inspect-source":73,"../internals/is-callable":78,"../internals/is-forced":80,"../internals/is-pure":82,"../internals/promise-native-constructor":116,"../internals/well-known-symbol":147}],116:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global.Promise;

},{"../internals/global":65}],117:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":10,"../internals/is-object":81,"../internals/new-promise-capability":95}],118:[function(require,module,exports){
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});

},{"../internals/check-correctness-of-iteration":22,"../internals/promise-constructor-detection":115,"../internals/promise-native-constructor":116}],119:[function(require,module,exports){
var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    if (this.head) this.tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      this.head = entry.next;
      if (this.tail === entry) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;

},{}],120:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":10}],121:[function(require,module,exports){
var call = require('../internals/function-call');
var hasOwn = require('../internals/has-own-property');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var regExpFlags = require('../internals/regexp-flags');

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};

},{"../internals/function-call":58,"../internals/has-own-property":66,"../internals/object-is-prototype-of":105,"../internals/regexp-flags":120}],122:[function(require,module,exports){
var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw $TypeError("Can't call method on " + it);
  return it;
};

},{}],123:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/descriptors":38,"../internals/get-built-in":61,"../internals/object-define-property":98,"../internals/well-known-symbol":147}],124:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/has-own-property":66,"../internals/object-define-property":98,"../internals/well-known-symbol":147}],125:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":127,"../internals/uid":142}],126:[function(require,module,exports){
var global = require('../internals/global');
var defineGlobalProperty = require('../internals/define-global-property');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;

},{"../internals/define-global-property":35,"../internals/global":65}],127:[function(require,module,exports){
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.23.4',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.23.4/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

},{"../internals/is-pure":82,"../internals/shared-store":126}],128:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aConstructor = require('../internals/a-constructor');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};

},{"../internals/a-constructor":6,"../internals/an-object":10,"../internals/well-known-symbol":147}],129:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/function-uncurry-this":60,"../internals/require-object-coercible":122,"../internals/to-integer-or-infinity":134,"../internals/to-string":140}],130:[function(require,module,exports){
var call = require('../internals/function-call');
var getBuiltIn = require('../internals/get-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var defineBuiltIn = require('../internals/define-built-in');

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};

},{"../internals/define-built-in":33,"../internals/function-call":58,"../internals/get-built-in":61,"../internals/well-known-symbol":147}],131:[function(require,module,exports){
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind-context');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var fails = require('../internals/fails');
var html = require('../internals/html');
var arraySlice = require('../internals/array-slice');
var createElement = require('../internals/document-create-element');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var IS_IOS = require('../internals/engine-is-ios');
var IS_NODE = require('../internals/engine-is-node');

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global.location;
} catch (error) { /* empty */ }

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/array-slice":18,"../internals/document-create-element":39,"../internals/engine-is-ios":45,"../internals/engine-is-node":46,"../internals/fails":52,"../internals/function-apply":54,"../internals/function-bind-context":55,"../internals/global":65,"../internals/has-own-property":66,"../internals/html":69,"../internals/is-callable":78,"../internals/validate-arguments-length":145}],132:[function(require,module,exports){
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer-or-infinity":134}],133:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":71,"../internals/require-object-coercible":122}],134:[function(require,module,exports){
var trunc = require('../internals/math-trunc');

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

},{"../internals/math-trunc":90}],135:[function(require,module,exports){
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer-or-infinity":134}],136:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":122}],137:[function(require,module,exports){
var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var getMethod = require('../internals/get-method');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

},{"../internals/function-call":58,"../internals/get-method":64,"../internals/is-object":81,"../internals/is-symbol":83,"../internals/ordinary-to-primitive":111,"../internals/well-known-symbol":147}],138:[function(require,module,exports){
var toPrimitive = require('../internals/to-primitive');
var isSymbol = require('../internals/is-symbol');

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

},{"../internals/is-symbol":83,"../internals/to-primitive":137}],139:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":147}],140:[function(require,module,exports){
var classof = require('../internals/classof');

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

},{"../internals/classof":24}],141:[function(require,module,exports){
var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};

},{}],142:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

},{"../internals/function-uncurry-this":60}],143:[function(require,module,exports){
/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":93}],144:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

},{"../internals/descriptors":38,"../internals/fails":52}],145:[function(require,module,exports){
var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};

},{}],146:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

exports.f = wellKnownSymbol;

},{"../internals/well-known-symbol":147}],147:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var hasOwn = require('../internals/has-own-property');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":65,"../internals/has-own-property":66,"../internals/native-symbol":93,"../internals/shared":127,"../internals/uid":142,"../internals/use-symbol-as-uid":143}],148:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/array-method-has-species-support":15,"../internals/array-species-create":20,"../internals/create-property":32,"../internals/does-not-exceed-safe-integer":40,"../internals/engine-v8-version":49,"../internals/export":51,"../internals/fails":52,"../internals/is-array":77,"../internals/is-object":81,"../internals/length-of-array-like":88,"../internals/to-object":136,"../internals/well-known-symbol":147}],149:[function(require,module,exports){
var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es-x/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

},{"../internals/array-from":12,"../internals/check-correctness-of-iteration":22,"../internals/export":51}],150:[function(require,module,exports){
'use strict';
/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var $IndexOf = require('../internals/array-includes').indexOf;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var un$IndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0
      : $IndexOf(this, searchElement, fromIndex);
  }
});

},{"../internals/array-includes":13,"../internals/array-method-is-strict":16,"../internals/export":51,"../internals/function-uncurry-this":60}],151:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineProperty = require('../internals/object-define-property').f;
var defineIterator = require('../internals/define-iterator');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }

},{"../internals/add-to-unscopables":8,"../internals/define-iterator":36,"../internals/descriptors":38,"../internals/internal-state":75,"../internals/is-pure":82,"../internals/iterators":87,"../internals/object-define-property":98,"../internals/to-indexed-object":133}],152:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var un$Slice = require('../internals/array-slice');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/array-method-has-species-support":15,"../internals/array-slice":18,"../internals/create-property":32,"../internals/export":51,"../internals/is-array":77,"../internals/is-constructor":79,"../internals/is-object":81,"../internals/length-of-array-like":88,"../internals/to-absolute-index":132,"../internals/to-indexed-object":133,"../internals/well-known-symbol":147}],153:[function(require,module,exports){
// TODO: Remove from `core-js@4`
var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltIn = require('../internals/define-built-in');

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var un$DateToString = uncurryThis(DatePrototype[TO_STRING]);
var getTime = uncurryThis(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn(DatePrototype, TO_STRING, function toString() {
    var value = getTime(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? un$DateToString(this) : INVALID_DATE;
  });
}

},{"../internals/define-built-in":33,"../internals/function-uncurry-this":60}],154:[function(require,module,exports){
// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var bind = require('../internals/function-bind');

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true, forced: Function.bind !== bind }, {
  bind: bind
});

},{"../internals/export":51,"../internals/function-bind":57}],155:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var FUNCTION_NAME_EXISTS = require('../internals/function-name').EXISTS;
var uncurryThis = require('../internals/function-uncurry-this');
var defineProperty = require('../internals/object-define-property').f;

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/descriptors":38,"../internals/function-name":59,"../internals/function-uncurry-this":60,"../internals/object-define-property":98}],156:[function(require,module,exports){
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var arraySlice = require('../internals/array-slice');
var NATIVE_SYMBOL = require('../internals/native-symbol');

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}

},{"../internals/array-slice":18,"../internals/export":51,"../internals/fails":52,"../internals/function-apply":54,"../internals/function-call":58,"../internals/function-uncurry-this":60,"../internals/get-built-in":61,"../internals/is-array":77,"../internals/is-callable":78,"../internals/is-object":81,"../internals/is-symbol":83,"../internals/native-symbol":93}],157:[function(require,module,exports){
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":26,"../internals/collection-strong":25}],158:[function(require,module,exports){
// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.map.constructor');

},{"../modules/es.map.constructor":157}],159:[function(require,module,exports){
// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});

},{"../internals/descriptors":38,"../internals/export":51,"../internals/object-create":96}],160:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
$({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty, sham: !DESCRIPTORS }, {
  defineProperty: defineProperty
});

},{"../internals/descriptors":38,"../internals/export":51,"../internals/object-define-property":98}],161:[function(require,module,exports){
var $ = require('../internals/export');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var fails = require('../internals/fails');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var toObject = require('../internals/to-object');

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});

},{"../internals/export":51,"../internals/fails":52,"../internals/native-symbol":93,"../internals/object-get-own-property-symbols":102,"../internals/to-object":136}],162:[function(require,module,exports){
var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":51,"../internals/object-set-prototype-of":109}],163:[function(require,module,exports){
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var defineBuiltIn = require('../internals/define-built-in');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}

},{"../internals/define-built-in":33,"../internals/object-to-string":110,"../internals/to-string-tag-support":139}],164:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":5,"../internals/export":51,"../internals/function-call":58,"../internals/iterate":84,"../internals/new-promise-capability":95,"../internals/perform":114,"../internals/promise-statics-incorrect-iteration":118}],165:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var defineBuiltIn = require('../internals/define-built-in');

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}

},{"../internals/define-built-in":33,"../internals/export":51,"../internals/get-built-in":61,"../internals/is-callable":78,"../internals/is-pure":82,"../internals/promise-constructor-detection":115,"../internals/promise-native-constructor":116}],166:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var IS_NODE = require('../internals/engine-is-node');
var global = require('../internals/global');
var call = require('../internals/function-call');
var defineBuiltIn = require('../internals/define-built-in');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var aCallable = require('../internals/a-callable');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var hostReportErrors = require('../internals/host-report-errors');
var perform = require('../internals/perform');
var Queue = require('../internals/queue');
var InternalStateModule = require('../internals/internal-state');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var PromiseConstructorDetection = require('../internals/promise-constructor-detection');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

},{"../internals/a-callable":5,"../internals/an-instance":9,"../internals/define-built-in":33,"../internals/engine-is-node":46,"../internals/export":51,"../internals/function-call":58,"../internals/global":65,"../internals/host-report-errors":68,"../internals/internal-state":75,"../internals/is-callable":78,"../internals/is-object":81,"../internals/is-pure":82,"../internals/microtask":91,"../internals/new-promise-capability":95,"../internals/object-set-prototype-of":109,"../internals/perform":114,"../internals/promise-constructor-detection":115,"../internals/promise-native-constructor":116,"../internals/queue":119,"../internals/set-species":123,"../internals/set-to-string-tag":124,"../internals/species-constructor":128,"../internals/task":131}],167:[function(require,module,exports){
// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/es.promise.constructor');
require('../modules/es.promise.all');
require('../modules/es.promise.catch');
require('../modules/es.promise.race');
require('../modules/es.promise.reject');
require('../modules/es.promise.resolve');

},{"../modules/es.promise.all":164,"../modules/es.promise.catch":165,"../modules/es.promise.constructor":166,"../modules/es.promise.race":168,"../modules/es.promise.reject":169,"../modules/es.promise.resolve":170}],168:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":5,"../internals/export":51,"../internals/function-call":58,"../internals/iterate":84,"../internals/new-promise-capability":95,"../internals/perform":114,"../internals/promise-statics-incorrect-iteration":118}],169:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var call = require('../internals/function-call');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});

},{"../internals/export":51,"../internals/function-call":58,"../internals/new-promise-capability":95,"../internals/promise-constructor-detection":115}],170:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var IS_PURE = require('../internals/is-pure');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;
var promiseResolve = require('../internals/promise-resolve');

var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});

},{"../internals/export":51,"../internals/get-built-in":61,"../internals/is-pure":82,"../internals/promise-constructor-detection":115,"../internals/promise-native-constructor":116,"../internals/promise-resolve":117}],171:[function(require,module,exports){
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind');
var aConstructor = require('../internals/a-constructor');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var fails = require('../internals/fails');

var nativeConstruct = getBuiltIn('Reflect', 'construct');
var ObjectPrototype = Object.prototype;
var push = [].push;

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});

var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});

var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aConstructor(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      apply(push, $args, args);
      return new (apply(bind, Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : ObjectPrototype);
    var result = apply(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"../internals/a-constructor":6,"../internals/an-object":10,"../internals/export":51,"../internals/fails":52,"../internals/function-apply":54,"../internals/function-bind":57,"../internals/get-built-in":61,"../internals/is-object":81,"../internals/object-create":96}],172:[function(require,module,exports){
'use strict';
var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var defineBuiltIn = require('../internals/define-built-in');
var anObject = require('../internals/an-object');
var $toString = require('../internals/to-string');
var fails = require('../internals/fails');
var getRegExpFlags = require('../internals/regexp-get-flags');

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var n$ToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}

},{"../internals/an-object":10,"../internals/define-built-in":33,"../internals/fails":52,"../internals/function-name":59,"../internals/regexp-get-flags":121,"../internals/to-string":140}],173:[function(require,module,exports){
'use strict';
var charAt = require('../internals/string-multibyte').charAt;
var toString = require('../internals/to-string');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":36,"../internals/internal-state":75,"../internals/string-multibyte":129,"../internals/to-string":140}],174:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var $toString = require('../internals/to-string');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var definePropertiesModule = require('../internals/object-define-properties');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var defineBuiltIn = require('../internals/define-built-in');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var defineSymbolToPrimitive = require('../internals/symbol-define-to-primitive');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":10,"../internals/array-iteration":14,"../internals/create-property-descriptor":31,"../internals/define-built-in":33,"../internals/define-well-known-symbol":37,"../internals/descriptors":38,"../internals/export":51,"../internals/fails":52,"../internals/function-call":58,"../internals/function-uncurry-this":60,"../internals/global":65,"../internals/has-own-property":66,"../internals/hidden-keys":67,"../internals/internal-state":75,"../internals/is-pure":82,"../internals/native-symbol":93,"../internals/object-create":96,"../internals/object-define-properties":97,"../internals/object-define-property":98,"../internals/object-get-own-property-descriptor":99,"../internals/object-get-own-property-names":101,"../internals/object-get-own-property-names-external":100,"../internals/object-get-own-property-symbols":102,"../internals/object-is-prototype-of":105,"../internals/object-keys":107,"../internals/object-property-is-enumerable":108,"../internals/set-to-string-tag":124,"../internals/shared":127,"../internals/shared-key":125,"../internals/symbol-define-to-primitive":130,"../internals/to-indexed-object":133,"../internals/to-property-key":138,"../internals/to-string":140,"../internals/uid":142,"../internals/well-known-symbol":147,"../internals/well-known-symbol-wrapped":146}],175:[function(require,module,exports){
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var toString = require('../internals/to-string');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

},{"../internals/copy-constructor-properties":27,"../internals/descriptors":38,"../internals/export":51,"../internals/function-uncurry-this":60,"../internals/global":65,"../internals/has-own-property":66,"../internals/is-callable":78,"../internals/object-define-property":98,"../internals/object-is-prototype-of":105,"../internals/to-string":140}],176:[function(require,module,exports){
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var hasOwn = require('../internals/has-own-property');
var toString = require('../internals/to-string');
var shared = require('../internals/shared');
var NATIVE_SYMBOL_REGISTRY = require('../internals/native-symbol-registry');

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});

},{"../internals/export":51,"../internals/get-built-in":61,"../internals/has-own-property":66,"../internals/native-symbol-registry":92,"../internals/shared":127,"../internals/to-string":140}],177:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/define-well-known-symbol":37}],178:[function(require,module,exports){
// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/es.symbol.constructor');
require('../modules/es.symbol.for');
require('../modules/es.symbol.key-for');
require('../modules/es.json.stringify');
require('../modules/es.object.get-own-property-symbols');

},{"../modules/es.json.stringify":156,"../modules/es.object.get-own-property-symbols":161,"../modules/es.symbol.constructor":174,"../modules/es.symbol.for":176,"../modules/es.symbol.key-for":179}],179:[function(require,module,exports){
var $ = require('../internals/export');
var hasOwn = require('../internals/has-own-property');
var isSymbol = require('../internals/is-symbol');
var tryToString = require('../internals/try-to-string');
var shared = require('../internals/shared');
var NATIVE_SYMBOL_REGISTRY = require('../internals/native-symbol-registry');

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

},{"../internals/export":51,"../internals/has-own-property":66,"../internals/is-symbol":83,"../internals/native-symbol-registry":92,"../internals/shared":127,"../internals/try-to-string":141}],180:[function(require,module,exports){
var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

},{"../internals/create-non-enumerable-property":30,"../internals/dom-iterables":41,"../internals/dom-token-list-prototype":42,"../internals/global":65,"../internals/well-known-symbol":147,"../modules/es.array.iterator":151}],181:[function(require,module,exports){
'use strict';
/**
 * This module provides access to the News API
 * https://newsapi.org/
 *
 * The API provides access to recent news headlines
 * from many popular news sources.
 *
 * The author of this code has no formal relationship with NewsAPI.org and does not
 * claim to have created any of the facilities provided by NewsAPI.org.
 */
//GLOBALS

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.function.name");

require("core-js/modules/es.map");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.reflect.construct");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fetch = require('node-fetch'),
    qs = require('querystring'),
    host = 'https://newsapi.org';

var CORSProxyUrl = ''; // To be set by user if declared in options

var API_KEY; // To be set by clients

var NewsAPI = /*#__PURE__*/function () {
  function NewsAPI(apiKey) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, NewsAPI);

    var corsProxyUrl = options.corsProxyUrl;
    CORSProxyUrl = corsProxyUrl ? corsProxyUrl : ''; //assigns to global

    if (!apiKey) throw new Error('No API key specified');
    API_KEY = apiKey;
    this.v2 = {
      topHeadlines: function topHeadlines() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _splitArgsIntoOptions = splitArgsIntoOptionsAndCallback(args),
            _splitArgsIntoOptions2 = _splitArgsIntoOptions.params,
            params = _splitArgsIntoOptions2 === void 0 ? {
          language: 'en'
        } : _splitArgsIntoOptions2,
            options = _splitArgsIntoOptions.options,
            cb = _splitArgsIntoOptions.cb;

        var url = createUrlFromEndpointAndOptions('/v2/top-headlines', params);
        return getDataFromWeb(url, options, API_KEY, cb);
      },
      everything: function everything() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _splitArgsIntoOptions3 = splitArgsIntoOptionsAndCallback(args),
            params = _splitArgsIntoOptions3.params,
            options = _splitArgsIntoOptions3.options,
            cb = _splitArgsIntoOptions3.cb;

        var url = createUrlFromEndpointAndOptions('/v2/everything', params);
        return getDataFromWeb(url, options, API_KEY, cb);
      },
      sources: function sources() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var _splitArgsIntoOptions4 = splitArgsIntoOptionsAndCallback(args),
            params = _splitArgsIntoOptions4.params,
            options = _splitArgsIntoOptions4.options,
            cb = _splitArgsIntoOptions4.cb;

        var url = createUrlFromEndpointAndOptions('/v2/sources', params);
        return getDataFromWeb(url, options, API_KEY, cb);
      }
    };
  }

  _createClass(NewsAPI, [{
    key: "sources",
    value: function sources() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var _splitArgsIntoOptions5 = splitArgsIntoOptionsAndCallback(args),
          params = _splitArgsIntoOptions5.params,
          options = _splitArgsIntoOptions5.options,
          cb = _splitArgsIntoOptions5.cb;

      var url = createUrlFromEndpointAndOptions('/v1/sources', params);
      return getDataFromWeb(url, options, null, cb);
    }
  }, {
    key: "articles",
    value: function articles() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var _splitArgsIntoOptions6 = splitArgsIntoOptionsAndCallback(args),
          params = _splitArgsIntoOptions6.params,
          options = _splitArgsIntoOptions6.options,
          cb = _splitArgsIntoOptions6.cb;

      var url = createUrlFromEndpointAndOptions('/v1/articles', params);
      return getDataFromWeb(url, options, API_KEY, cb);
    }
  }]);

  return NewsAPI;
}();

var NewsAPIError = /*#__PURE__*/function (_Error) {
  _inherits(NewsAPIError, _Error);

  var _super = _createSuper(NewsAPIError);

  function NewsAPIError(err) {
    var _this;

    _classCallCheck(this, NewsAPIError);

    _this = _super.call(this);
    _this.name = "NewsAPIError: ".concat(err.code);
    _this.message = err.message;
    return _this;
  }

  return NewsAPIError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Takes a variable-length array that represents arguments to a function and attempts to split it into
 * an 'options' object and a 'cb' callback function.
 * @param {Array}   args The arguments to the function
 * @return {Object}
 */


function splitArgsIntoOptionsAndCallback(args) {
  var params;
  var options;
  var cb;

  if (args.length > 1) {
    var possibleCb = args[args.length - 1];

    if ('function' === typeof possibleCb) {
      cb = possibleCb;
      options = args.length === 3 ? args[1] : undefined;
    } else {
      options = args[1];
    }

    params = args[0];
  } else if ('object' === _typeof(args[0])) {
    params = args[0];
  } else if ('function' === typeof args[0]) {
    cb = args[0];
  }

  return {
    params: params,
    options: options,
    cb: cb
  };
}
/**
 * Creates a url string from an endpoint and an options object by appending the endpoint
 * to the global "host" const and appending the options as querystring parameters.
 * @param {String} endpoint
 * @param {Object} [options]
 * @return {String}
 */


function createUrlFromEndpointAndOptions(endpoint, options) {
  var query = qs.stringify(options);
  var baseURL = "".concat(CORSProxyUrl).concat(host).concat(endpoint);
  return query ? "".concat(baseURL, "?").concat(query) : baseURL;
}
/**
 * Takes a URL string and returns a Promise containing
 * a buffer with the data from the web.
 * @param  {String} url      A URL String
 * @param  {String} apiKey   (Optional) A key to be used for authentication
 * @return {Promise<Buffer>} A Promise containing a Buffer
 */


function getDataFromWeb(url, options, apiKey, cb) {
  var useCallback = 'function' === typeof cb; // CORS Headers by default

  var reqOptions = {
    'mode': 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  if (apiKey) {
    reqOptions.headers['X-Api-Key'] = apiKey;
  }

  if (options && options.noCache === true) {
    reqOptions.headers['X-No-Cache'] = 'true';
  }

  return fetch(url, reqOptions).then(function (res) {
    return Promise.all([res, res.json()]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        res = _ref2[0],
        body = _ref2[1];

    if (body.status === 'error') throw new NewsAPIError(body); // 'showHeaders' option can be used for clients to debug response headers
    // response will be in form of { headers, body }

    if (options && options.showHeaders) {
      if (useCallback) return cb(null, {
        headers: res.headers,
        body: body
      });
      return {
        headers: res.headers,
        body: body
      };
    }

    if (useCallback) return cb(null, body);
    return body;
  })["catch"](function (err) {
    if (useCallback) return cb(err);
    throw err;
  });
}

module.exports = NewsAPI;
},{"core-js/modules/es.array.concat":148,"core-js/modules/es.array.from":149,"core-js/modules/es.array.index-of":150,"core-js/modules/es.array.iterator":151,"core-js/modules/es.array.slice":152,"core-js/modules/es.date.to-string":153,"core-js/modules/es.function.bind":154,"core-js/modules/es.function.name":155,"core-js/modules/es.map":158,"core-js/modules/es.object.create":159,"core-js/modules/es.object.define-property":160,"core-js/modules/es.object.set-prototype-of":162,"core-js/modules/es.object.to-string":163,"core-js/modules/es.promise":167,"core-js/modules/es.reflect.construct":171,"core-js/modules/es.regexp.to-string":172,"core-js/modules/es.string.iterator":173,"core-js/modules/es.symbol":178,"core-js/modules/es.symbol.description":175,"core-js/modules/es.symbol.iterator":177,"core-js/modules/web.dom-collections.iterator":180,"node-fetch":182,"querystring":3}],182:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4]);
