import uuidImport from 'node-uuid';

var uuid = uuidImport.noConflict ? uuidImport.noConflict() : uuidImport;

export function isArray(arr) {
  //Adapted from extend, Copyright (c) 2014 Stefan Thomas, MIT license
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }
  return Object.prototype.toString.call(arr) === '[object Array]';
}

export function isPlainObject(obj) {
  //Adapted from extend, Copyright (c) 2014 Stefan Thomas, MIT license
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }
  var hasOwnConstructor = Object.prototype.hasOwnProperty.call(obj, 'constructor');
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  var key;
  for (key in obj) {/**/}
  return typeof key === 'undefined' || Object.prototype.hasOwnProperty.call(obj, key);
}

export function guid(len) {
  var id = '';
  len = len || 24;

  while (id.length < len) {
    id += uuid.v1().replace(/-/g, '');
  }
  return id.substr(0, len);
}

export let snakeCase = camelCase => String(camelCase).replace(/[A-Z]/g, v=>'_' + v).toUpperCase().replace(/^_/, '');

export function pathToStr(path, delParams) {
  var result = ''
    , item
    ;
  for (var i = 0; i < path.length; i++) {
    item = path[i];
    if (delParams) {
      item = item.replace(/\(.*/, '');
    }
    if (i === 0 || /^[a-z$_][0-9a-z$_]*$/i.test(item)) {
      result += '.' + path[i];
    } else {
      if (String(Math.round(Number(item))) === item) {
        result += '[' + item + ']';
      } else {
        result += '[' + JSON.stringify(String(item)) + ']';
      }
    }
  }
  return result.replace(/^\./, '').replace(/\[\"\*\"\]/g, '[]');
}

export function namedFunction(name, actualFunc, templateFunc, passThrough) {
  if (passThrough) {
    return actualFunc;
  }
  if (!templateFunc) {
    templateFunc = actualFunc;
  }

  var f = actualFunc; // eslint-disable-line

  if (typeof actualFunc !== 'function') throw new TypeError('Parameter to namedFunction must be a function');

  var funcText = templateFunc.toString();

  var signature = /\([^\)]*\)/.exec(funcText)[0];

  funcText = funcText.replace(/^[^{]+\{|}$/g, '');

  var func = eval('(function(){function ' + name + signature + '{/*' + funcText.replace(/\*\//g, '* /') + '*/return f.apply(this,arguments);}return ' + name + '}())'); // eslint-disable-line
  func.toString = function() {
    return 'function ' + name + signature + '{' + funcText + '}';
  };
  return func;
}

export function toObject(value) {

  var seenValues  = []
    , seenObjects = []
    ;

  function internal(value) {
    if ((value instanceof Date) || (value instanceof RegExp) || (value instanceof Error)) return value;
    if (typeof value !== 'object' || !value) return value;
    if (!('keys' in value) || !('_meta' in value)) return value;
    if (value._meta.type.kind === 'array') return value.slice().map(v => internal(v));
    var result = {}
      , ix     = seenValues.indexOf(value);

    if (ix !== -1) {
      return seenObjects[ix];
    }

    seenValues.push(value);
    seenObjects.push(result);

    value.keys.forEach(key => {
      result[key] = internal(value.get(key));
    });
    return result;
  }

  return internal(value);
}
