#!/usr/bin/env node
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 986:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 986;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 705:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const path = __nccwpck_require__(17);

/**
 * Safely get the path for a file in the project directory, or reject by returning "dummy"
 *
 * @param {string} url
 * @param {string} basePath - absolute path to base directory
 * @param {object} [pathLib=path] - path library, override for testing
 * @return {string} - will return 'dummy' if the path is bad
 */
function getFilePathFromUrl(url, basePath, { pathLib = path, baseHref = '' } = {}) {
  if (!basePath) {
    throw new Error('basePath must be specified');
  }
  if (!pathLib.isAbsolute(basePath)) {
    throw new Error(`${basePath} is invalid - must be absolute`);
  }

  // we are not interested in query params
  // TODO also filter out hash routes
  let relativePath = url.split('?')[0];

  if (relativePath.indexOf('../') > -1) {
    // any path attempting to traverse up the directory should be rejected
    return 'dummy';
  }

  if (baseHref) {
    if (relativePath.startsWith('/' + baseHref)) {
      relativePath = relativePath.substr(baseHref.length + 1)
    } else {
      return 'dummy'
    }
  }

  const absolutePath = pathLib.join(basePath, relativePath);
  if (
    !absolutePath.startsWith(basePath) || // if the path has broken out of the basePath, it should be rejected
    absolutePath.endsWith(pathLib.sep) // only files (not folders) can be served
  ) {
    return 'dummy';
  }

  return absolutePath;
}

module.exports = getFilePathFromUrl;


/***/ }),

/***/ 77:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.promisify = promisify;
// Symbols is a better way to do this, but not all browsers have good support,
// so instead we'll just make do with a very unlikely string.
var customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";
/**
 * promisify()
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) --
 * into an ES6-compatible Promise. Promisify provides a default callback of the
 * form (error, result) and rejects when `error` is truthy.
 *
 * @param {function} original - The function to promisify
 * @return {function} A promisified version of `original`
 */

function promisify(original) {
  // Ensure the argument is a function
  if (typeof original !== "function") {
    throw new TypeError("Argument to promisify must be a function");
  } // If the user has asked us to decode argument names for them, honour that


  var argumentNames = original[customArgumentsToken]; // If the user has supplied a custom Promise implementation, use it.
  // Otherwise fall back to whatever we can find on the global object.

  var ES6Promise = promisify.Promise || Promise; // If we can find no Promise implemention, then fail now.

  if (typeof ES6Promise !== "function") {
    throw new Error("No Promise implementation found; do you need a polyfill?");
  }

  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new ES6Promise(function (resolve, reject) {
      // Append the callback bound to the context
      args.push(function callback(err) {
        if (err) {
          return reject(err);
        }

        for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          values[_key2 - 1] = arguments[_key2];
        }

        if (values.length === 1 || !argumentNames) {
          return resolve(values[0]);
        }

        var o = {};
        values.forEach(function (value, index) {
          var name = argumentNames[index];

          if (name) {
            o[name] = value;
          }
        });
        resolve(o);
      }); // Call the function.

      original.apply(_this, args);
    });
  };
} // Attach this symbol to the exported function, so users can use it


promisify.argumentNames = customArgumentsToken;
promisify.Promise = undefined; // Export the public API

/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(37);
const fs = __nccwpck_require__(147);

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().includes('Microsoft')) {
		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
	} catch (err) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}


/***/ }),

/***/ 299:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(147)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(758)
} else {
  core = __nccwpck_require__(848)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(147)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 758:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(147)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 227:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(17);
var fs = __nccwpck_require__(147);

function Mime() {
  // Map of extension -> mime type
  this.types = Object.create(null);

  // Map of mime type -> extension
  this.extensions = Object.create(null);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * @param map (Object) type definitions
 */
Mime.prototype.define = function (map) {
  for (var type in map) {
    var exts = map[type];
    for (var i = 0; i < exts.length; i++) {
      if (process.env.DEBUG_MIME && this.types[exts[i]]) {
        console.warn((this._loading || "define()").replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
          this.types[exts[i]] + ' to ' + type);
      }

      this.types[exts[i]] = type;
    }

    // Default extension is the first one we encounter
    if (!this.extensions[type]) {
      this.extensions[type] = exts[0];
    }
  }
};

/**
 * Load an Apache2-style ".types" file
 *
 * This may be called multiple times (it's expected).  Where files declare
 * overlapping types/extensions, the last file wins.
 *
 * @param file (String) path of file to load.
 */
Mime.prototype.load = function(file) {
  this._loading = file;
  // Read file and split into lines
  var map = {},
      content = fs.readFileSync(file, 'ascii'),
      lines = content.split(/[\r\n]+/);

  lines.forEach(function(line) {
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
    map[fields.shift()] = fields;
  });

  this.define(map);

  this._loading = null;
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  var ext = path.replace(/^.*[\.\/\\]/, '').toLowerCase();

  return this.types[ext] || fallback || this.default_type;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  return this.extensions[type];
};

// Default instance
var mime = new Mime();

// Define built-in types
mime.define(__nccwpck_require__(799));

// Default type
mime.default_type = mime.lookup('bin');

//
// Additional API specific to the default instance
//

mime.Mime = Mime;

/**
 * Lookup a charset based on mime type.
 */
mime.charsets = {
  lookup: function(mimeType, fallback) {
    // Assume text types are utf8
    return (/^text\/|^application\/(javascript|json)/).test(mimeType) ? 'UTF-8' : fallback;
  }
};

module.exports = mime;


/***/ }),

/***/ 693:
/***/ ((module) => {

module.exports = function (args, opts) {
    if (!opts) opts = {};
    
    var flags = { bools : {}, strings : {}, unknownFn: null };

    if (typeof opts['unknown'] === 'function') {
        flags.unknownFn = opts['unknown'];
    }

    if (typeof opts['boolean'] === 'boolean' && opts['boolean']) {
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
          flags.bools[key] = true;
      });
    }
    
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key) {
        aliases[key] = [].concat(opts.alias[key]);
        aliases[key].forEach(function (x) {
            aliases[x] = [key].concat(aliases[key].filter(function (y) {
                return x !== y;
            }));
        });
    });

    [].concat(opts.string).filter(Boolean).forEach(function (key) {
        flags.strings[key] = true;
        if (aliases[key]) {
            flags.strings[aliases[key]] = true;
        }
     });

    var defaults = opts['default'] || {};
    
    var argv = { _ : [] };
    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    
    var notFlags = [];

    if (args.indexOf('--') !== -1) {
        notFlags = args.slice(args.indexOf('--')+1);
        args = args.slice(0, args.indexOf('--'));
    }

    function argDefined(key, arg) {
        return (flags.allBools && /^--[^=]+$/.test(arg)) ||
            flags.strings[key] || flags.bools[key] || aliases[key];
    }

    function setArg (key, val, arg) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false) return;
        }

        var value = !flags.strings[key] && isNumber(val)
            ? Number(val) : val
        ;
        setKey(argv, key.split('.'), value);
        
        (aliases[key] || []).forEach(function (x) {
            setKey(argv, x.split('.'), value);
        });
    }

    function setKey (obj, keys, value) {
        var o = obj;
        for (var i = 0; i < keys.length-1; i++) {
            var key = keys[i];
            if (key === '__proto__') return;
            if (o[key] === undefined) o[key] = {};
            if (o[key] === Object.prototype || o[key] === Number.prototype
                || o[key] === String.prototype) o[key] = {};
            if (o[key] === Array.prototype) o[key] = [];
            o = o[key];
        }

        var key = keys[keys.length - 1];
        if (key === '__proto__') return;
        if (o === Object.prototype || o === Number.prototype
            || o === String.prototype) o = {};
        if (o === Array.prototype) o = [];
        if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
            o[key] = value;
        }
        else if (Array.isArray(o[key])) {
            o[key].push(value);
        }
        else {
            o[key] = [ o[key], value ];
        }
    }
    
    function aliasIsBoolean(key) {
      return aliases[key].some(function (x) {
          return flags.bools[x];
      });
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        
        if (/^--.+=/.test(arg)) {
            // Using [\s\S] instead of . because js doesn't support the
            // 'dotall' regex modifier. See:
            // http://stackoverflow.com/a/1068308/13216
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
                value = value !== 'false';
            }
            setArg(key, value, arg);
        }
        else if (/^--no-.+/.test(arg)) {
            var key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
        }
        else if (/^--.+/.test(arg)) {
            var key = arg.match(/^--(.+)/)[1];
            var next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)
            && !flags.bools[key]
            && !flags.allBools
            && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                setArg(key, next === 'true', arg);
                i++;
            }
            else {
                setArg(key, flags.strings[key] ? '' : true, arg);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1,-1).split('');
            
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j+2);
                
                if (next === '-') {
                    setArg(letters[j], next, arg)
                    continue;
                }
                
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split('=')[1], arg);
                    broken = true;
                    break;
                }
                
                if (/[A-Za-z]/.test(letters[j])
                && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                
                if (letters[j+1] && letters[j+1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j+2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                }
            }
            
            var key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
                if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
                && !flags.bools[key]
                && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i+1], arg);
                    i++;
                }
                else if (args[i+1] && /^(true|false)$/.test(args[i+1])) {
                    setArg(key, args[i+1] === 'true', arg);
                    i++;
                }
                else {
                    setArg(key, flags.strings[key] ? '' : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(
                    flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
                );
            }
            if (opts.stopEarly) {
                argv._.push.apply(argv._, args.slice(i + 1));
                break;
            }
        }
    }
    
    Object.keys(defaults).forEach(function (key) {
        if (!hasKey(argv, key.split('.'))) {
            setKey(argv, key.split('.'), defaults[key]);
            
            (aliases[key] || []).forEach(function (x) {
                setKey(argv, x.split('.'), defaults[key]);
            });
        }
    });
    
    if (opts['--']) {
        argv['--'] = new Array();
        notFlags.forEach(function(key) {
            argv['--'].push(key);
        });
    }
    else {
        notFlags.forEach(function(key) {
            argv._.push(key);
        });
    }

    return argv;
};

function hasKey (obj, keys) {
    var o = obj;
    keys.slice(0,-1).forEach(function (key) {
        o = (o[key] || {});
    });

    var key = keys[keys.length - 1];
    return key in o;
}

function isNumber (x) {
    if (typeof x === 'number') return true;
    if (/^0x[0-9a-f]+$/i.test(x)) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}



/***/ }),

/***/ 19:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(17);
const childProcess = __nccwpck_require__(81);
const isWsl = __nccwpck_require__(832);

module.exports = (target, opts) => {
	if (typeof target !== 'string') {
		return Promise.reject(new Error('Expected a `target`'));
	}

	opts = Object.assign({wait: true}, opts);

	let cmd;
	let appArgs = [];
	let args = [];
	const cpOpts = {};

	if (Array.isArray(opts.app)) {
		appArgs = opts.app.slice(1);
		opts.app = opts.app[0];
	}

	if (process.platform === 'darwin') {
		cmd = 'open';

		if (opts.wait) {
			args.push('-W');
		}

		if (opts.app) {
			args.push('-a', opts.app);
		}
	} else if (process.platform === 'win32' || isWsl) {
		cmd = 'cmd' + (isWsl ? '.exe' : '');
		args.push('/c', 'start', '""', '/b');
		target = target.replace(/&/g, '^&');

		if (opts.wait) {
			args.push('/wait');
		}

		if (opts.app) {
			args.push(opts.app);
		}

		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}
	} else {
		if (opts.app) {
			cmd = opts.app;
		} else {
			const useSystemXdgOpen = process.versions.electron || process.platform === 'android';
			cmd = useSystemXdgOpen ? 'xdg-open' : path.join(__dirname, 'xdg-open');
		}

		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}

		if (!opts.wait) {
			// `xdg-open` will block the process unless
			// stdio is ignored and it's detached from the parent
			// even if it's unref'd
			cpOpts.stdio = 'ignore';
			cpOpts.detached = true;
		}
	}

	args.push(target);

	if (process.platform === 'darwin' && appArgs.length > 0) {
		args.push('--args');
		args = args.concat(appArgs);
	}

	const cp = childProcess.spawn(cmd, args, cpOpts);

	if (opts.wait) {
		return new Promise((resolve, reject) => {
			cp.once('error', reject);

			cp.once('close', code => {
				if (code > 0) {
					reject(new Error('Exited with code ' + code));
					return;
				}

				resolve(cp);
			});
		});
	}

	cp.unref();

	return Promise.resolve(cp);
};


/***/ }),

/***/ 63:
/***/ ((module) => {

"use strict";

var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
module.exports = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};


/***/ }),

/***/ 169:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var openssl = __nccwpck_require__(938)
var helper = __nccwpck_require__(119)

// PEM format: .pem, .crt, .cer (!bin), .key
// base64 encoded; the cert file might also include the private key; so key file is optional

// DER format: .der, .cer (bin)
// binary encoded format; cannot include key file

// PKCS#7 / P7B format: .p7b, .p7c
// contains cert and ca chain cert files, but not the key file
// A PKCS7 certificate is serialized using either PEM or DER format.

// PKCS#12 / PFX format: .pfx, .p12
// contains all files: key file, cert and ca chain cert files

/**
 * pem convert module
 *
 * @module convert
 */

/**
 * conversion from PEM to DER format
 * if private key is included in PEM encoded file, it won't be included in DER file
 * use this method with type 'rsa' to export private key in that case
 * @param  {String} pathIN  path of the PEM encoded certificate file
 * @param  {String} pathOUT path of the DER encoded certificate file to generate
 * @param  {String} [type] type of file, use 'rsa' for key file, 'x509' otherwise or leave this parameter out
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.PEM2DER = function (pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === 'function') {
    callback = type
    type = 'x509'
  }
  var params = [
    type,
    '-outform',
    'der',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ]
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error)
    } else {
      callback(null, code === 0)
    }
  })
}

/**
 * conversion from DER to PEM format
 * @param  {String} pathIN  path of the DER encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {String} [type] type of file, use 'rsa' for key file, 'x509' otherwise or leave this parameter out
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.DER2PEM = function (pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === 'function') {
    callback = type
    type = 'x509'
  }
  var params = [
    type,
    '-inform',
    'der',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ]
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error)
    } else {
      callback(null, code === 0)
    }
  })
}

/**
 * conversion from PEM to P7B format
 * @param  {Object} pathBundleIN  paths of the PEM encoded certificate files ({cert: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the P7B encoded certificate file to generate
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.PEM2P7B = function (pathBundleIN, pathOUT, callback) {
  var params = [
    'crl2pkcs7',
    '-nocrl',
    '-certfile',
    pathBundleIN.cert,
    '-out',
    pathOUT
  ]
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca]
    }
    pathBundleIN.ca.forEach(function (ca) {
      params.push('-certfile')
      params.push(ca)
    })
  }
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error)
    } else {
      callback(null, code === 0)
    }
  })
}

/**
 * conversion from P7B to PEM format
 * @param  {String} pathIN  path of the P7B encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.P7B2PEM = function (pathIN, pathOUT, callback) {
  var params = [
    'pkcs7',
    '-print_certs',
    '-in',
    pathIN,
    '-out',
    pathOUT
  ]
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error)
    } else {
      callback(null, code === 0)
    }
  })
}// TODO: CA also included?

/**
 * conversion from PEM to PFX
 * @param  {Object} pathBundleIN paths of the PEM encoded certificate files ({cert: '...', key: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the PFX encoded certificate file to generate
 * @param  {String} password password to set for accessing the PFX file
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.PEM2PFX = function (pathBundleIN, pathOUT, password, callback) {
  var params = [
    'pkcs12',
    '-export',
    '-out',
    pathOUT,
    '-inkey',
    pathBundleIN.key,
    '-in',
    pathBundleIN.cert
  ]
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca]
    }
    pathBundleIN.ca.forEach(function (ca) {
      params.push('-certfile')
      params.push(ca)
    })
  }
  var delTempPWFiles = []
  helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles)
  helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles)
  openssl.spawnWrapper(params, false, function (error, code) {
    function done (error) {
      if (error) {
        callback(error)
      } else {
        callback(null, code === 0)
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(error || fsErr)
    })
  })
}

/**
 * conversion from PFX to PEM
 * @param  {Object} pathIN  path of the PFX encoded certificate file
 * @param  {String} pathOUT path of the PEM encoded certificate file to generate
 * @param  {String} password password to set for accessing the PFX file
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.PFX2PEM = function (pathIN, pathOUT, password, callback) {
  var params = [
    'pkcs12',
    '-in',
    pathIN,
    '-out',
    pathOUT,
    '-nodes'
  ]
  var delTempPWFiles = []
  helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles)
  helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles)
  openssl.spawnWrapper(params, false, function (error, code) {
    function done (error) {
      if (error) {
        callback(error)
      } else {
        callback(null, code === 0)
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(error || fsErr)
    })
  })
}

/**
 * conversion from P7B to PFX/PKCS#12
 * @param  {Object} pathBundleIN  paths of the PEM encoded certificate files ({cert: '...', key: '...', ca: '...' or ['...', ...]})
 * @param  {String} pathOUT path of the PFX certificate file to generate
 * @param  {String} password password to be set for the PFX file and to be used to access the key file
 * @param  {Function} callback callback method called with error, boolean result
 */
module.exports.P7B2PFX = function (pathBundleIN, pathOUT, password, callback) {
  var tmpfile = pathBundleIN.cert.replace(/\.[^.]+$/, '.cer')
  var params = [
    'pkcs7',
    '-print_certs',
    '-in',
    pathBundleIN.cert,
    '-out',
    tmpfile
  ]
  openssl.spawnWrapper(params, false, function (error, code) {
    if (error) {
      callback(error)
    } else {
      var params = [
        'pkcs12',
        '-export',
        '-in',
        tmpfile,
        '-inkey',
        pathBundleIN.key,
        '-out',
        pathOUT
      ]
      if (pathBundleIN.ca) {
        if (!Array.isArray(pathBundleIN.ca)) {
          pathBundleIN.ca = [pathBundleIN.ca]
        }
        pathBundleIN.ca.forEach(function (ca) {
          params.push('-certfile')
          params.push(ca)
        })
      }
      var delTempPWFiles = [tmpfile]
      helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles)
      helper.createPasswordFile({ cipher: '', password: password, passType: 'out' }, params, delTempPWFiles)
      openssl.spawnWrapper(params, false, function (error, code) {
        function done (error) {
          if (error) {
            callback(error)
          } else {
            callback(null, code === 0)
          }
        }
        helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
          done(error || fsErr)
        })
      })
    }
  })
}


/***/ }),

/***/ 119:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var pathlib = __nccwpck_require__(17)
var fs = __nccwpck_require__(147)
var crypto = __nccwpck_require__(113)
var osTmpdir = __nccwpck_require__(63)
var tempDir = process.env.PEMJS_TMPDIR || osTmpdir()

/**
 * pem helper module
 *
 * @module helper
 */

/**
 * helper function to check is the string a number or not
 * @param {String} str String that should be checked to be a number
 */
module.exports.isNumber = function (str) {
  if (Array.isArray(str)) {
    return false
  }
  /*
  var bstr = str && str.toString()
  str = str + ''

  return bstr - parseFloat(bstr) + 1 >= 0 &&
          !/^\s+|\s+$/g.test(str) && /^\d+$/g.test(str) &&
          !isNaN(str) && !isNaN(parseFloat(str))
  */
  return /^\d+$/g.test(str)
}

/**
 * helper function to check is the string a hexaceximal value
 * @param {String} hex String that should be checked to be a hexaceximal
 */
module.exports.isHex = function isHex (hex) {
  return /^(0x){0,1}([0-9A-F]{1,40}|[0-9A-F]{1,40})$/gi.test(hex)
}

/**
 * helper function to convert a string to a hexaceximal value
 * @param {String} str String that should be converted to a hexaceximal
 */
module.exports.toHex = function toHex (str) {
  var hex = ''
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16)
  }
  return hex
}

// cipherPassword returns an array of supported ciphers.
/**
 * list of supported ciphers
 * @type {Array}
 */
module.exports.ciphers = ['aes128', 'aes192', 'aes256', 'camellia128', 'camellia192', 'camellia256', 'des', 'des3', 'idea']
var ciphers = module.exports.ciphers

/**
 * Creates a PasswordFile to hide the password form process infos via `ps auxf` etc.
 * @param {Object} options object of cipher, password and passType, mustPass, {cipher:'aes128', password:'xxxx', passType:"in/out/word"}, if the object empty we do nothing
 * @param {String} options.cipher cipher like 'aes128', 'aes192', 'aes256', 'camellia128', 'camellia192', 'camellia256', 'des', 'des3', 'idea'
 * @param {String} options.password password can be empty or at last 4 to 1023 chars
 * @param {String} options.passType passType: can be in/out/word for passIN/passOUT/passWORD
 * @param {Boolean} options.mustPass mustPass is used when you need to set the pass like as "-password pass:" most needed when empty password
 * @param {Object} params params will be extended with the data that need for the openssl command. IS USED AS POINTER!
 * @param {String} PasswordFileArray PasswordFileArray is an array of filePaths that later need to deleted ,after the openssl command. IS USED AS POINTER!
 * @return {Boolean} result
 */
module.exports.createPasswordFile = function (options, params, PasswordFileArray) {
  if (!options || !Object.prototype.hasOwnProperty.call(options, 'password') || !Object.prototype.hasOwnProperty.call(options, 'passType') || !/^(word|in|out)$/.test(options.passType)) {
    return false
  }
  var PasswordFile = pathlib.join(tempDir, crypto.randomBytes(20).toString('hex'))
  PasswordFileArray.push(PasswordFile)
  options.password = options.password.trim()
  if (options.password === '') {
    options.mustPass = true
  }
  if (options.cipher && (ciphers.indexOf(options.cipher) !== -1)) {
    params.push('-' + options.cipher)
  }
  params.push('-pass' + options.passType)
  if (options.mustPass) {
    params.push('pass:' + options.password)
  } else {
    fs.writeFileSync(PasswordFile, options.password)
    params.push('file:' + PasswordFile)
  }
  return true
}

/**
 * Deletes a file or an array of files
 * @param {Array} files array of files that shoudld be deleted
 * @param {errorCallback} callback Callback function with an error object
 */
module.exports.deleteTempFiles = function (files, callback) {
  var rmFiles = []
  if (typeof files === 'string') {
    rmFiles.push(files)
  } else if (Array.isArray(files)) {
    rmFiles = files
  } else {
    return callback(new Error('Unexcepted files parameter type; only string or array supported'))
  }
  var deleteSeries = function (list, finalCallback) {
    if (list.length) {
      var file = list.shift()
      var myCallback = function (err) {
        if (err && err.code === 'ENOENT') {
          // file doens't exist
          return deleteSeries(list, finalCallback)
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          return finalCallback(err)
        } else {
          return deleteSeries(list, finalCallback)
        }
      }
      if (file && typeof file === 'string') {
        fs.unlink(file, myCallback)
      } else {
        return deleteSeries(list, finalCallback)
      }
    } else {
      return finalCallback(null) // no errors
    }
  }
  deleteSeries(rmFiles, callback)
}
/**
 * Callback for return an error object.
 * @callback errorCallback
 * @param {Error} err - An Error Object or null
 */


/***/ }),

/***/ 938:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helper = __nccwpck_require__(119)
var cpspawn = (__nccwpck_require__(81).spawn)
var pathlib = __nccwpck_require__(17)
var fs = __nccwpck_require__(147)
var osTmpdir = __nccwpck_require__(63)
var crypto = __nccwpck_require__(113)
var which = __nccwpck_require__(840)
var settings = {}
var tempDir = process.env.PEMJS_TMPDIR || osTmpdir()

/**
 * pem openssl module
 *
 * @module openssl
 */

/**
 * configue this openssl module
 *
 * @static
 * @param {String} option name e.g. pathOpenSSL, openSslVersion; TODO rethink nomenclature
 * @param {*} value value
 */
function set (option, value) {
  settings[option] = value
}

/**
 * get configuration setting value
 *
 * @static
 * @param {String} option name
 */
function get (option) {
  return settings[option] || null
}

/**
 * Spawn an openssl command
 *
 * @static
 * @param {Array} params Array of openssl command line parameters
 * @param {String} searchStr String to use to find data
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Function} callback Called with (error, stdout-substring)
 */
function exec (params, searchStr, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === 'function') {
    callback = tmpfiles
    tmpfiles = false
  }

  spawnWrapper(params, tmpfiles, function (err, code, stdout, stderr) {
    var start, end

    if (err) {
      return callback(err)
    }

    if ((start = stdout.match(new RegExp('\\-+BEGIN ' + searchStr + '\\-+$', 'm')))) {
      start = start.index
    } else {
      start = -1
    }

    // To get the full EC key with parameters and private key
    if (searchStr === 'EC PARAMETERS') {
      searchStr = 'EC PRIVATE KEY'
    }

    if ((end = stdout.match(new RegExp('^\\-+END ' + searchStr + '\\-+', 'm')))) {
      end = end.index + end[0].length
    } else {
      end = -1
    }

    if (start >= 0 && end >= 0) {
      return callback(null, stdout.substring(start, end))
    } else {
      return callback(new Error(searchStr + ' not found from openssl output:\n---stdout---\n' + stdout + '\n---stderr---\n' + stderr + '\ncode: ' + code))
    }
  })
}

/**
 *  Spawn an openssl command and get binary output
 *
 * @static
 * @param {Array} params Array of openssl command line parameters
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Function} callback Called with (error, stdout)
*/
function execBinary (params, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === 'function') {
    callback = tmpfiles
    tmpfiles = false
  }
  spawnWrapper(params, tmpfiles, true, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    }
    return callback(null, stdout)
  })
}

/**
 * Generically spawn openSSL, without processing the result
 *
 * @static
 * @param {Array}        params   The parameters to pass to openssl
 * @param {Boolean}      binary   Output of openssl is binary or text
 * @param {Function}     callback Called with (error, exitCode, stdout, stderr)
 */
function spawn (params, binary, callback) {
  var pathBin = get('pathOpenSSL') || process.env.OPENSSL_BIN || 'openssl'

  testOpenSSLPath(pathBin, function (err) {
    if (err) {
      return callback(err)
    }
    var openssl = cpspawn(pathBin, params)
    var stderr = ''

    var stdout = (binary ? Buffer.alloc(0) : '')
    openssl.stdout.on('data', function (data) {
      if (!binary) {
        stdout += data.toString('binary')
      } else {
        stdout = Buffer.concat([stdout, data])
      }
    })

    openssl.stderr.on('data', function (data) {
      stderr += data.toString('binary')
    })
    // We need both the return code and access to all of stdout.  Stdout isn't
    // *really* available until the close event fires; the timing nuance was
    // making this fail periodically.
    var needed = 2 // wait for both exit and close.
    var code = -1
    var finished = false
    var done = function (err) {
      if (finished) {
        return
      }

      if (err) {
        finished = true
        return callback(err)
      }

      if (--needed < 1) {
        finished = true
        if (code) {
          if (code === 2 && (stderr === '' || /depth lookup: unable to/.test(stderr))) {
            return callback(null, code, stdout, stderr)
          }
          return callback(new Error('Invalid openssl exit code: ' + code + '\n% openssl ' + params.join(' ') + '\n' + stderr), code)
        } else {
          return callback(null, code, stdout, stderr)
        }
      }
    }

    openssl.on('error', done)

    openssl.on('exit', function (ret) {
      code = ret
      done()
    })

    openssl.on('close', function () {
      stdout = (binary ? stdout : Buffer.from(stdout, 'binary').toString('utf-8'))
      stderr = Buffer.from(stderr, 'binary').toString('utf-8')
      done()
    })
  })
}

/**
 * Wrapper for spawn method
 *
 * @static
 * @param {Array} params The parameters to pass to openssl
 * @param {Array} [tmpfiles] list of temporary files
 * @param {Boolean} [binary] Output of openssl is binary or text
 * @param {Function} callback Called with (error, exitCode, stdout, stderr)
 */
function spawnWrapper (params, tmpfiles, binary, callback) {
  if (!callback && typeof binary === 'function') {
    callback = binary
    binary = false
  }

  var files = []
  var delTempPWFiles = []

  if (tmpfiles) {
    tmpfiles = [].concat(tmpfiles)
    var fpath, i
    for (i = 0; i < params.length; i++) {
      if (params[i] === '--TMPFILE--') {
        fpath = pathlib.join(tempDir, crypto.randomBytes(20).toString('hex'))
        files.push({
          path: fpath,
          contents: tmpfiles.shift()
        })
        params[i] = fpath
        delTempPWFiles.push(fpath)
      }
    }
  }

  var file
  for (i = 0; i < files.length; i++) {
    file = files[i]
    fs.writeFileSync(file.path, file.contents)
  }

  spawn(params, binary, function (err, code, stdout, stderr) {
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      callback(err || fsErr, code, stdout, stderr)
    })
  })
}

/**
 * Validates the pathBin for the openssl command
 *
 * @private
 * @param {String} pathBin The path to OpenSSL Bin
 * @param {Function} callback Callback function with an error object
 */
function testOpenSSLPath (pathBin, callback) {
  which(pathBin, function (error) {
    if (error) {
      return callback(new Error('Could not find openssl on your system on this path: ' + pathBin))
    }
    callback()
  })
}

/* Once PEM is imported, the openSslVersion is set with this function. */
spawn(['version'], false, function (err, code, stdout, stderr) {
  var text = String(stdout) + '\n' + String(stderr) + '\n' + String(err)
  var tmp = text.match(/^LibreSSL/i)
  set('openSslVersion', (tmp && tmp[0] ? 'LibreSSL' : 'openssl').toUpperCase())
})

module.exports = {
  exec: exec,
  execBinary: execBinary,
  spawn: spawn,
  spawnWrapper: spawnWrapper,
  set: set,
  get: get
}


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


/**
 * pem module
 *
 * @module pem
 */

const { promisify } = __nccwpck_require__(77)
var net = __nccwpck_require__(808)
var helper = __nccwpck_require__(119)
var openssl = __nccwpck_require__(938)

module.exports.createPrivateKey = createPrivateKey
module.exports.createDhparam = createDhparam
module.exports.createEcparam = createEcparam
module.exports.createCSR = createCSR
module.exports.createCertificate = createCertificate
module.exports.readCertificateInfo = readCertificateInfo
module.exports.getPublicKey = getPublicKey
module.exports.getFingerprint = getFingerprint
module.exports.getModulus = getModulus
module.exports.getDhparamInfo = getDhparamInfo
module.exports.createPkcs12 = createPkcs12
module.exports.readPkcs12 = readPkcs12
module.exports.verifySigningChain = verifySigningChain
module.exports.checkCertificate = checkCertificate
module.exports.checkPkcs12 = checkPkcs12
module.exports.config = config

/**
 * quick access the convert module
 * @type {module:convert}
 */
module.exports.convert = __nccwpck_require__(169)

var KEY_START = '-----BEGIN PRIVATE KEY-----'
var KEY_END = '-----END PRIVATE KEY-----'
var RSA_KEY_START = '-----BEGIN RSA PRIVATE KEY-----'
var RSA_KEY_END = '-----END RSA PRIVATE KEY-----'
var ENCRYPTED_KEY_START = '-----BEGIN ENCRYPTED PRIVATE KEY-----'
var ENCRYPTED_KEY_END = '-----END ENCRYPTED PRIVATE KEY-----'
var CERT_START = '-----BEGIN CERTIFICATE-----'
var CERT_END = '-----END CERTIFICATE-----'

/**
 * Creates a private key
 *
 * @static
 * @param {Number} [keyBitsize=2048] Size of the key, defaults to 2048bit
 * @param {Object} [options] object of cipher and password {cipher:'aes128',password:'xxx'}, defaults empty object
 * @param {String} [options.cipher] string of the cipher for the encryption - needed with password
 * @param {String} [options.password] string of the cipher password for the encryption needed with cipher
 * @param {Function} callback Callback function with an error object and {key}
 */
function createPrivateKey (keyBitsize, options, callback) {
  if (!callback && !options && typeof keyBitsize === 'function') {
    callback = keyBitsize
    keyBitsize = undefined
    options = {}
  } else if (!callback && keyBitsize && typeof options === 'function') {
    callback = options
    options = {}
  }

  keyBitsize = Number(keyBitsize) || 2048

  var params = ['genrsa']
  var delTempPWFiles = []

  if (options && options.cipher && (Number(helper.ciphers.indexOf(options.cipher)) !== -1) && options.password) {
    helper.createPasswordFile({ cipher: options.cipher, password: options.password, passType: 'out' }, params, delTempPWFiles)
  }

  params.push(keyBitsize)

  openssl.exec(params, 'RSA PRIVATE KEY', function (sslErr, key) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, {
        key: key
      })
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr)
    })
  })
}

/**
 * Creates a dhparam key
 *
 * @static
 * @param {Number} [keyBitsize=512] Size of the key, defaults to 512bit
 * @param {Function} callback Callback function with an error object and {dhparam}
 */
function createDhparam (keyBitsize, callback) {
  if (!callback && typeof keyBitsize === 'function') {
    callback = keyBitsize
    keyBitsize = undefined
  }

  keyBitsize = Number(keyBitsize) || 512

  var params = ['dhparam',
    '-outform',
    'PEM',
    keyBitsize
  ]

  openssl.exec(params, 'DH PARAMETERS', function (error, dhparam) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      dhparam: dhparam
    })
  })
}

/**
 * Creates a ecparam key
 * @static
 * @param {String} [keyName=secp256k1] Name of the key, defaults to secp256k1
 * @param {String} [paramEnc=explicit] Encoding of the elliptic curve parameters, defaults to explicit
 * @param {Boolean} [noOut=false] This option inhibits the output of the encoded version of the parameters.
 * @param {Function} callback Callback function with an error object and {ecparam}
 */
function createEcparam (keyName, paramEnc, noOut, callback) {
  if (!callback && typeof noOut === 'undefined' && !paramEnc && typeof keyName === 'function') {
    callback = keyName
    keyName = undefined
  } else if (!callback && typeof noOut === 'undefined' && keyName && typeof paramEnc === 'function') {
    callback = paramEnc
    paramEnc = undefined
  } else if (!callback && typeof noOut === 'function' && keyName && paramEnc) {
    callback = noOut
    noOut = undefined
  }

  keyName = keyName || 'secp256k1'
  paramEnc = paramEnc || 'explicit'
  noOut = noOut || false

  var params = ['ecparam',
    '-name',
    keyName,
    '-genkey',
    '-param_enc',
    paramEnc
  ]

  var searchString = 'EC PARAMETERS'
  if (noOut) {
    params.push('-noout')
    searchString = 'EC PRIVATE KEY'
  }

  openssl.exec(params, searchString, function (error, ecparam) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      ecparam: ecparam
    })
  })
}

/**
 * Creates a Certificate Signing Request
 * If client key is undefined, a new key is created automatically. The used key is included
 * in the callback return as clientKey
 * @static
 * @param {Object} [options] Optional options object
 * @param {String} [options.clientKey] Optional client key to use
 * @param {Number} [options.keyBitsize] If clientKey is undefined, bit size to use for generating a new key (defaults to 2048)
 * @param {String} [options.hash] Hash function to use (either md5 sha1 or sha256, defaults to sha256)
 * @param {String} [options.country] CSR country field
 * @param {String} [options.state] CSR state field
 * @param {String} [options.locality] CSR locality field
 * @param {String} [options.organization] CSR organization field
 * @param {String} [options.organizationUnit] CSR organizational unit field
 * @param {String} [options.commonName='localhost'] CSR common name field
 * @param {String} [options.emailAddress] CSR email address field
 * @param {String} [options.csrConfigFile] CSR config file
 * @param {Array}  [options.altNames] is a list of subjectAltNames in the subjectAltName field
 * @param {Function} callback Callback function with an error object and {csr, clientKey}
 */
function createCSR (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options
    options = undefined
  }

  options = options || {}

  // http://stackoverflow.com/questions/14089872/why-does-node-js-accept-ip-addresses-in-certificates-only-for-san-not-for-cn
  if (options.commonName && (net.isIPv4(options.commonName) || net.isIPv6(options.commonName))) {
    if (!options.altNames) {
      options.altNames = [options.commonName]
    } else if (options.altNames.indexOf(options.commonName) === -1) {
      options.altNames = options.altNames.concat([options.commonName])
    }
  }

  if (!options.clientKey) {
    createPrivateKey(options.keyBitsize || 2048, function (error, keyData) {
      if (error) {
        return callback(error)
      }
      options.clientKey = keyData.key
      createCSR(options, callback)
    })
    return
  }

  var params = ['req',
    '-new',
    '-' + (options.hash || 'sha256')
  ]

  if (options.csrConfigFile) {
    params.push('-config')
    params.push(options.csrConfigFile)
  } else {
    params.push('-subj')
    params.push(generateCSRSubject(options))
  }

  params.push('-key')
  params.push('--TMPFILE--')

  var tmpfiles = [options.clientKey]
  var config = null

  if (options.altNames && Array.isArray(options.altNames) && options.altNames.length) {
    params.push('-extensions')
    params.push('v3_req')
    params.push('-config')
    params.push('--TMPFILE--')
    var altNamesRep = []
    for (var i = 0; i < options.altNames.length; i++) {
      altNamesRep.push((net.isIP(options.altNames[i]) ? 'IP' : 'DNS') + '.' + (i + 1) + ' = ' + options.altNames[i])
    }

    tmpfiles.push(config = [
      '[req]',
      'req_extensions = v3_req',
      'distinguished_name = req_distinguished_name',
      '[v3_req]',
      'subjectAltName = @alt_names',
      '[alt_names]',
      altNamesRep.join('\n'),
      '[req_distinguished_name]',
      'commonName = Common Name',
      'commonName_max = 64'
    ].join('\n'))
  } else if (options.config) {
    config = options.config
  }

  var delTempPWFiles = []
  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles)
  }

  openssl.exec(params, 'CERTIFICATE REQUEST', tmpfiles, function (sslErr, data) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, {
        csr: data,
        config: config,
        clientKey: options.clientKey
      })
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr)
    })
  })
}

/**
 * Creates a certificate based on a CSR. If CSR is not defined, a new one
 * will be generated automatically. For CSR generation all the options values
 * can be used as with createCSR.
 * @static
 * @param {Object} [options] Optional options object
 * @param {String} [options.serviceCertificate] PEM encoded certificate
 * @param {String} [options.serviceKey] Private key for signing the certificate, if not defined a new one is generated
 * @param {String} [options.serviceKeyPassword] Password of the service key
 * @param {Boolean} [options.selfSigned] If set to true and serviceKey is not defined, use clientKey for signing
 * @param {String|Number} [options.serial] Set a serial max. 20 octets - only together with options.serviceCertificate
 * @param {String} [options.serialFile] Set the name of the serial file, without extension. - only together with options.serviceCertificate and never in tandem with options.serial
 * @param {String} [options.hash] Hash function to use (either md5 sha1 or sha256, defaults to sha256)
 * @param {String} [options.csr] CSR for the certificate, if not defined a new one is generated
 * @param {Number} [options.days] Certificate expire time in days
 * @param {String} [options.clientKeyPassword] Password of the client key
 * @param {String} [options.extFile] extension config file - without '-extensions v3_req'
 * @param {String} [options.config] extension config file - with '-extensions v3_req'
 * @param {String} [options.csrConfigFile] CSR config file - only used if no options.csr is provided
 * @param {Array}  [options.altNames] is a list of subjectAltNames in the subjectAltName field - only used if no options.csr is provided
 * @param {Function} callback Callback function with an error object and {certificate, csr, clientKey, serviceKey}
 */
function createCertificate (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options
    options = undefined
  }

  options = options || {}

  if (!options.csr) {
    createCSR(options, function (error, keyData) {
      if (error) {
        return callback(error)
      }
      options.csr = keyData.csr
      options.config = keyData.config
      options.clientKey = keyData.clientKey
      createCertificate(options, callback)
    })
    return
  }

  if (!options.clientKey) {
    options.clientKey = ''
  }

  if (!options.serviceKey) {
    if (options.selfSigned) {
      options.serviceKey = options.clientKey
    } else {
      createPrivateKey(options.keyBitsize || 2048, function (error, keyData) {
        if (error) {
          return callback(error)
        }
        options.serviceKey = keyData.key
        createCertificate(options, callback)
      })
      return
    }
  }

  readCertificateInfo(options.csr, function (error2, data2) {
    if (error2) {
      return callback(error2)
    }

    var params = ['x509',
      '-req',
      '-' + (options.hash || 'sha256'),
      '-days',
      Number(options.days) || '365',
      '-in',
      '--TMPFILE--'
    ]
    var tmpfiles = [options.csr]
    var delTempPWFiles = []

    if (options.serviceCertificate) {
      params.push('-CA')
      params.push('--TMPFILE--')
      params.push('-CAkey')
      params.push('--TMPFILE--')
      if (options.serial) {
        params.push('-set_serial')
        if (helper.isNumber(options.serial)) {
        // set the serial to the max lenth of 20 octets ()
        // A certificate serial number is not decimal conforming. That is the
        // bytes in a serial number do not necessarily map to a printable ASCII
        // character.
        // eg: 0x00 is a valid serial number and can not be represented in a
        // human readable format (atleast one that can be directly mapped to
        // the ACSII table).
          params.push('0x' + ('0000000000000000000000000000000000000000' + options.serial.toString(16)).slice(-40))
        } else {
          if (helper.isHex(options.serial)) {
            if (options.serial.startsWith('0x')) {
              options.serial = options.serial.substring(2, options.serial.length)
            }
            params.push('0x' + ('0000000000000000000000000000000000000000' + options.serial).slice(-40))
          } else {
            params.push('0x' + ('0000000000000000000000000000000000000000' + helper.toHex(options.serial)).slice(-40))
          }
        }
      } else {
        params.push('-CAcreateserial')
        if (options.serialFile) {
          params.push('-CAserial')
          params.push(options.serialFile + '.srl')
        }
      }
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: '', password: options.serviceKeyPassword, passType: 'in' }, params, delTempPWFiles)
      }
      tmpfiles.push(options.serviceCertificate)
      tmpfiles.push(options.serviceKey)
    } else {
      params.push('-signkey')
      params.push('--TMPFILE--')
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: '', password: options.serviceKeyPassword, passType: 'in' }, params, delTempPWFiles)
      }
      tmpfiles.push(options.serviceKey)
    }

    if (options.config) {
      params.push('-extensions')
      params.push('v3_req')
      params.push('-extfile')
      params.push('--TMPFILE--')
      tmpfiles.push(options.config)
    } else if (options.extFile) {
      params.push('-extfile')
      params.push(options.extFile)
    } else {
      var altNamesRep = []
      if (data2 && data2.san) {
        for (var i = 0; i < data2.san.dns.length; i++) {
          altNamesRep.push('DNS' + '.' + (i + 1) + ' = ' + data2.san.dns[i])
        }
        for (var i2 = 0; i2 < data2.san.ip.length; i2++) {
          altNamesRep.push('IP' + '.' + (i2 + 1) + ' = ' + data2.san.ip[i2])
        }
        for (var i3 = 0; i3 < data2.san.email.length; i3++) {
          altNamesRep.push('email' + '.' + (i3 + 1) + ' = ' + data2.san.email[i3])
        }
        params.push('-extensions')
        params.push('v3_req')
        params.push('-extfile')
        params.push('--TMPFILE--')
        tmpfiles.push([
          '[v3_req]',
          'subjectAltName = @alt_names',
          '[alt_names]',
          altNamesRep.join('\n')
        ].join('\n'))
      }
    }

    if (options.clientKeyPassword) {
      helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles)
    }

    openssl.exec(params, 'CERTIFICATE', tmpfiles, function (sslErr, data) {
      function done (err) {
        if (err) {
          return callback(err)
        }
        var response = {
          csr: options.csr,
          clientKey: options.clientKey,
          certificate: data,
          serviceKey: options.serviceKey
        }
        return callback(null, response)
      }

      helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
        done(sslErr || fsErr)
      })
    })
  })
}

/**
 * Exports a public key from a private key, CSR or certificate
 * @static
 * @param {String} certificate PEM encoded private key, CSR or certificate
 * @param {Function} callback Callback function with an error object and {publicKey}
 */
function getPublicKey (certificate, callback) {
  if (!callback && typeof certificate === 'function') {
    callback = certificate
    certificate = undefined
  }

  certificate = (certificate || '').toString()

  var params

  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = ['req',
      '-in',
      '--TMPFILE--',
      '-pubkey',
      '-noout'
    ]
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = ['rsa',
      '-in',
      '--TMPFILE--',
      '-pubout'
    ]
  } else {
    params = ['x509',
      '-in',
      '--TMPFILE--',
      '-pubkey',
      '-noout'
    ]
  }

  openssl.exec(params, 'PUBLIC KEY', certificate, function (error, key) {
    if (error) {
      return callback(error)
    }
    return callback(null, {
      publicKey: key
    })
  })
}

/**
 * Reads subject data from a certificate or a CSR
 * @static
 * @param {String} certificate PEM encoded CSR or certificate
 * @param {Function} callback Callback function with an error object and {country, state, locality, organization, organizationUnit, commonName, emailAddress}
 */
function readCertificateInfo (certificate, callback) {
  if (!callback && typeof certificate === 'function') {
    callback = certificate
    certificate = undefined
  }

  certificate = (certificate || '').toString()
  var isMatch = certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)
  var type = isMatch ? 'req' : 'x509'
  var params = [type,
    '-noout',
    '-nameopt',
    'RFC2253,sep_multiline,space_eq,-esc_msb,utf8',
    '-text',
    '-in',
    '--TMPFILE--'
  ]
  openssl.spawnWrapper(params, certificate, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }
    return fetchCertificateData(stdout, callback)
  })
}

/**
 * get the modulus from a certificate, a CSR or a private key
 * @static
 * @param {String} certificate PEM encoded, CSR PEM encoded, or private key
 * @param {String} [password] password for the certificate
 * @param {String} [hash] hash function to use (up to now `md5` supported) (default: none)
 * @param {Function} callback Callback function with an error object and {modulus}
 */
function getModulus (certificate, password, hash, callback) {
  if (!callback && !hash && typeof password === 'function') {
    callback = password
    password = undefined
    hash = false
  } else if (!callback && hash && typeof hash === 'function') {
    callback = hash
    hash = false
    // password will be falsy if not provided
  }
  // adding hash function to params, is not supported by openssl.
  // process piping would be the right way (... | openssl md5)
  // No idea how this can be achieved in easy with the current build in methods
  // of pem.
  if (hash && hash !== 'md5') {
    hash = false
  }

  certificate = (Buffer.isBuffer(certificate) && certificate.toString()) || certificate

  var type = ''
  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    type = 'req'
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    type = 'rsa'
  } else {
    type = 'x509'
  }
  var params = [
    type,
    '-noout',
    '-modulus',
    '-in',
    '--TMPFILE--'
  ]
  var delTempPWFiles = []
  if (password) {
    helper.createPasswordFile({ cipher: '', password: password, passType: 'in' }, params, delTempPWFiles)
  }

  openssl.spawnWrapper(params, certificate, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      var match = stdout.match(/Modulus=([0-9a-fA-F]+)$/m)
      if (match) {
        return callback(null, {
          modulus: hash ? __nccwpck_require__(986)(hash)(match[1]) : match[1]
        })
      } else {
        return callback(new Error('No modulus'))
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr || stderr)
    })
  })
}

/**
 * get the size and prime of DH parameters
 * @static
 * @param {String} DH parameters PEM encoded
 * @param {Function} callback Callback function with an error object and {size, prime}
 */
function getDhparamInfo (dh, callback) {
  dh = (Buffer.isBuffer(dh) && dh.toString()) || dh

  var params = [
    'dhparam',
    '-text',
    '-in',
    '--TMPFILE--'
  ]

  openssl.spawnWrapper(params, dh, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }

    var result = {}
    var match = stdout.match(/Parameters: \((\d+) bit\)/)

    if (match) {
      result.size = Number(match[1])
    }

    var prime = ''
    stdout.split('\n').forEach(function (line) {
      if (/\s+([0-9a-f][0-9a-f]:)+[0-9a-f]?[0-9a-f]?/g.test(line)) {
        prime += line.trim()
      }
    })

    if (prime) {
      result.prime = prime
    }

    if (!match && !prime) {
      return callback(new Error('No DH info found'))
    }

    return callback(null, result)
  })
}

/**
 * config the pem module
 * @static
 * @param {Object} options
 */
function config (options) {
  Object.keys(options).forEach(function (k) {
    openssl.set(k, options[k])
  })
}

/**
 * Gets the fingerprint for a certificate
 * @static
 * @param {String} PEM encoded certificate
 * @param {String} [hash] hash function to use (either `md5`, `sha1` or `sha256`, defaults to `sha1`)
 * @param {Function} callback Callback function with an error object and {fingerprint}
 */
function getFingerprint (certificate, hash, callback) {
  if (!callback && typeof hash === 'function') {
    callback = hash
    hash = undefined
  }

  hash = hash || 'sha1'

  var params = ['x509',
    '-in',
    '--TMPFILE--',
    '-fingerprint',
    '-noout',
    '-' + hash
  ]

  openssl.spawnWrapper(params, certificate, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    } else if (stderr) {
      return callback(stderr)
    }
    var match = stdout.match(/Fingerprint=([0-9a-fA-F:]+)$/m)
    if (match) {
      return callback(null, {
        fingerprint: match[1]
      })
    } else {
      return callback(new Error('No fingerprint'))
    }
  })
}

/**
 * Export private key and certificate to a PKCS12 keystore
 * @static
 * @param {String} PEM encoded private key
 * @param {String} PEM encoded certificate
 * @param {String} Password of the result PKCS12 file
 * @param {Object} [options] object of cipher and optional client key password {cipher:'aes128', clientKeyPassword: 'xxxx', certFiles: ['file1','file2']}
 * @param {Function} callback Callback function with an error object and {pkcs12}
 */
function createPkcs12 (key, certificate, password, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options
    options = {}
  }

  var params = ['pkcs12', '-export']
  var delTempPWFiles = []

  if (options.cipher && options.clientKeyPassword) {
    // NOTICE: The password field is needed! self if it is empty.
    // create password file for the import "-passin"
    helper.createPasswordFile({ cipher: options.cipher, password: options.clientKeyPassword, passType: 'in' }, params, delTempPWFiles)
  }
  // NOTICE: The password field is needed! self if it is empty.
  // create password file for the password "-password"
  helper.createPasswordFile({ cipher: '', password: password, passType: 'word' }, params, delTempPWFiles)

  params.push('-in')
  params.push('--TMPFILE--')
  params.push('-inkey')
  params.push('--TMPFILE--')

  var tmpfiles = [certificate, key]

  if (options.certFiles) {
    tmpfiles.push(options.certFiles.join(''))

    params.push('-certfile')
    params.push('--TMPFILE--')
  }

  openssl.execBinary(params, tmpfiles, function (sslErr, pkcs12) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      return callback(null, {
        pkcs12: pkcs12
      })
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr)
    })
  })
}

/**
 * read sslcert data from Pkcs12 file. Results are provided in callback response in object notation ({cert: .., ca:..., key:...})
 * @static
 * @param  {Buffer|String}   bufferOrPath Buffer or path to file
 * @param  {Object}   [options]      openssl options
 * @param  {Function} callback     Called with error object and sslcert bundle object
 */
function readPkcs12 (bufferOrPath, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options
    options = {}
  }

  options.p12Password = options.p12Password || ''

  var tmpfiles = []
  var delTempPWFiles = []
  var args = ['pkcs12', '-in', bufferOrPath]

  helper.createPasswordFile({ cipher: '', password: options.p12Password, passType: 'in' }, args, delTempPWFiles)

  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath]
    args[2] = '--TMPFILE--'
  }

  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: '', password: options.clientKeyPassword, passType: 'out' }, args, delTempPWFiles)
  } else {
    args.push('-nodes')
  }

  openssl.execBinary(args, tmpfiles, function (sslErr, stdout) {
    function done (err) {
      var keybundle = {}

      if (err && err.message.indexOf('No such file or directory') !== -1) {
        err.code = 'ENOENT'
      }

      if (!err) {
        var certs = readFromString(stdout, CERT_START, CERT_END)
        keybundle.cert = certs.shift()
        keybundle.ca = certs
        keybundle.key = readFromString(stdout, KEY_START, KEY_END).pop()

        if (keybundle.key) {
        // convert to RSA key
          return openssl.exec(['rsa', '-in', '--TMPFILE--'], 'RSA PRIVATE KEY', [keybundle.key], function (err, key) {
            keybundle.key = key

            return callback(err, keybundle)
          })
        }

        if (options.clientKeyPassword) {
          keybundle.key = readFromString(stdout, ENCRYPTED_KEY_START, ENCRYPTED_KEY_END).pop()
        } else {
          keybundle.key = readFromString(stdout, RSA_KEY_START, RSA_KEY_END).pop()
        }
      }

      return callback(err, keybundle)
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr)
    })
  })
}

/**
 * Check a certificate
 * @static
 * @param {String} PEM encoded certificate
 * @param {String} [passphrase] password for the certificate
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function checkCertificate (certificate, passphrase, callback) {
  var params
  var delTempPWFiles = []

  if (!callback && typeof passphrase === 'function') {
    callback = passphrase
    passphrase = undefined
  }
  certificate = (certificate || '').toString()

  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = ['req', '-text', '-noout', '-verify', '-in', '--TMPFILE--']
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = ['rsa', '-noout', '-check', '-in', '--TMPFILE--']
  } else {
    params = ['x509', '-text', '-noout', '-in', '--TMPFILE--']
  }
  if (passphrase) {
    helper.createPasswordFile({ cipher: '', password: passphrase, passType: 'in' }, params, delTempPWFiles)
  }

  openssl.spawnWrapper(params, certificate, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err && err.toString().trim() !== 'verify OK') {
        return callback(err)
      }
      var result
      switch (params[0]) {
        case 'rsa':
          result = /^Rsa key ok$/i.test(stdout.trim())
          break
        default:
          result = /Signature Algorithm/im.test(stdout)
          break
      }

      callback(null, result)
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr || stderr)
    })
  })
}

/**
 * check a PKCS#12 file (.pfx or.p12)
 * @static
 * @param {Buffer|String} bufferOrPath PKCS#12 certificate
 * @param {String} [passphrase] optional passphrase which will be used to open the keystore
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function checkPkcs12 (bufferOrPath, passphrase, callback) {
  if (!callback && typeof passphrase === 'function') {
    callback = passphrase
    passphrase = ''
  }

  var tmpfiles = []
  var delTempPWFiles = []
  var args = ['pkcs12', '-info', '-in', bufferOrPath, '-noout', '-maciter', '-nodes']

  helper.createPasswordFile({ cipher: '', password: passphrase, passType: 'in' }, args, delTempPWFiles)

  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath]
    args[3] = '--TMPFILE--'
  }

  openssl.spawnWrapper(args, tmpfiles, function (sslErr, code, stdout, stderr) {
    function done (err) {
      if (err) {
        return callback(err)
      }
      callback(null, (/MAC verified OK/im.test(stderr) || (!(/MAC verified OK/im.test(stderr)) && !(/Mac verify error/im.test(stderr)))))
    }
    helper.deleteTempFiles(delTempPWFiles, function (fsErr) {
      done(sslErr || fsErr)
    })
  })
}

/**
 * Verifies the signing chain of the passed certificate
 * @static
 * @param {String|Array} PEM encoded certificate include intermediate certificates
 * @param {String|Array} [List] of CA certificates
 * @param {Function} callback Callback function with an error object and a boolean valid
 */
function verifySigningChain (certificate, ca, callback) {
  if (!callback && typeof ca === 'function') {
    callback = ca
    ca = undefined
  }
  if (!Array.isArray(certificate)) {
    certificate = [certificate]
  }
  if (!Array.isArray(ca) && ca !== undefined) {
    if (ca !== '') {
      ca = [ca]
    }
  }

  var files = []

  if (ca !== undefined) {
    // ca certificates
    files.push(ca.join('\n'))
  }
  // certificate incl. intermediate certificates
  files.push(certificate.join('\n'))

  var params = ['verify']

  if (ca !== undefined) {
    // ca certificates
    params.push('-CAfile')
    params.push('--TMPFILE--')
  }
  // certificate incl. intermediate certificates
  params.push('--TMPFILE--')

  openssl.spawnWrapper(params, files, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err)
    }

    callback(null, stdout.trim().slice(-4) === ': OK')
  })
}

// HELPER FUNCTIONS
function fetchCertificateData (certData, callback) {
  // try catch : if something will fail in parsing it won't crash the calling code
  try {
    certData = (certData || '').toString()

    var serial, subject, tmp, issuer
    var certValues = {
      issuer: {}
    }
    var validity = {}
    var san

    var ky, i

    // serial
    if ((serial = certData.match(/\s*Serial Number:\r?\n?\s*([^\r\n]*)\r?\n\s*\b/)) && serial.length > 1) {
      certValues.serial = serial[1]
    }

    if ((subject = certData.match(/\s*Subject:\r?\n(\s*(([a-zA-Z0-9.]+)\s=\s[^\r\n]+\r?\n))*\s*\b/)) && subject.length > 1) {
      subject = subject[0]
      tmp = matchAll(subject, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g)
      if (tmp) {
        for (i = 0; i < tmp.length; i++) {
          ky = tmp[i][1].trim()
          if (ky.match('(C|ST|L|O|OU|CN|emailAddress|DC)') || ky === '') {
            continue
          }
          certValues[ky] = tmp[i][2].trim()
        }
      }

      // country
      tmp = subject.match(/\sC\s=\s([^\r\n].*?)[\r\n]/)
      certValues.country = (tmp && tmp[1]) || ''

      // state
      tmp = subject.match(/\sST\s=\s([^\r\n].*?)[\r\n]/)
      certValues.state = (tmp && tmp[1]) || ''

      // locality
      tmp = subject.match(/\sL\s=\s([^\r\n].*?)[\r\n]/)
      certValues.locality = (tmp && tmp[1]) || ''

      // organization
      tmp = matchAll(subject, /\sO\s=\s([^\r\n].*)/g)
      certValues.organization = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // unit
      tmp = matchAll(subject, /\sOU\s=\s([^\r\n].*)/g)
      certValues.organizationUnit = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // common name
      tmp = matchAll(subject, /\sCN\s=\s([^\r\n].*)/g)
      certValues.commonName = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // email
      tmp = matchAll(subject, /emailAddress\s=\s([^\r\n].*)/g)
      certValues.emailAddress = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // DC name
      tmp = matchAll(subject, /\sDC\s=\s([^\r\n].*)/g)
      certValues.dc = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''
    }

    if ((issuer = certData.match(/\s*Issuer:\r?\n(\s*([a-zA-Z0-9.]+)\s=\s[^\r\n].*\r?\n)*\s*\b/)) && issuer.length > 1) {
      issuer = issuer[0]
      tmp = matchAll(issuer, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g)
      for (i = 0; i < tmp.length; i++) {
        ky = tmp[i][1].toString()
        if (ky.match('(C|ST|L|O|OU|CN|emailAddress|DC)')) {
          continue
        }
        certValues.issuer[ky] = tmp[i][2].toString()
      }

      // country
      tmp = issuer.match(/\sC\s=\s([^\r\n].*?)[\r\n]/)
      certValues.issuer.country = (tmp && tmp[1]) || ''

      // state
      tmp = issuer.match(/\sST\s=\s([^\r\n].*?)[\r\n]/)
      certValues.issuer.state = (tmp && tmp[1]) || ''

      // locality
      tmp = issuer.match(/\sL\s=\s([^\r\n].*?)[\r\n]/)
      certValues.issuer.locality = (tmp && tmp[1]) || ''

      // organization
      tmp = matchAll(issuer, /\sO\s=\s([^\r\n].*)/g)
      certValues.issuer.organization = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // unit
      tmp = matchAll(issuer, /\sOU\s=\s([^\r\n].*)/g)
      certValues.issuer.organizationUnit = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var
          r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // common name
      tmp = matchAll(issuer, /\sCN\s=\s([^\r\n].*)/g)
      certValues.issuer.commonName = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var
          r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''

      // DC name
      tmp = matchAll(issuer, /\sDC\s=\s([^\r\n].*)/g)
      certValues.issuer.dc = tmp ? (tmp.length > 1 ? tmp.sort(function (t, n) {
        var e = t[1].toUpperCase()
        var
          r = n[1].toUpperCase()
        return r > e ? -1 : e > r ? 1 : 0
      }).sort(function (t, n) {
        return t[1].length - n[1].length
      }).map(function (t) {
        return t[1]
      }) : tmp[0][1]) : ''
    }

    // SAN
    if ((san = certData.match(/X509v3 Subject Alternative Name: \r?\n([^\r\n]*)\r?\n/)) && san.length > 1) {
      san = san[1].trim() + '\n'
      certValues.san = {}

      // hostnames
      tmp = pregMatchAll('DNS:([^,\\r\\n].*?)[,\\r\\n\\s]', san)
      certValues.san.dns = tmp || ''

      // IP-Addresses IPv4 & IPv6
      tmp = pregMatchAll('IP Address:([^,\\r\\n].*?)[,\\r\\n\\s]', san)
      certValues.san.ip = tmp || ''

      // Email Addresses
      tmp = pregMatchAll('email:([^,\\r\\n].*?)[,\\r\\n\\s]', san)
      certValues.san.email = tmp || ''
    }

    // Validity
    if ((tmp = certData.match(/Not Before\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.start = Date.parse((tmp && tmp[1]) || '')
    }

    if ((tmp = certData.match(/Not After\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.end = Date.parse((tmp && tmp[1]) || '')
    }

    if (validity.start && validity.end) {
      certValues.validity = validity
    }
    // Validity end

    // Signature Algorithm
    if ((tmp = certData.match(/Signature Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.signatureAlgorithm = (tmp && tmp[1]) || ''
    }

    // Public Key
    if ((tmp = certData.match(/Public[ -]Key: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeySize = ((tmp && tmp[1]) || '').replace(/[()]/g, '')
    }

    // Public Key Algorithm
    if ((tmp = certData.match(/Public Key Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeyAlgorithm = (tmp && tmp[1]) || ''
    }

    callback(null, certValues)
  } catch (err) {
    callback(err)
  }
}

function matchAll (str, regexp) {
  var matches = []
  str.replace(regexp, function () {
    var arr = ([]).slice.call(arguments, 0)
    var extras = arr.splice(-2)
    arr.index = extras[0]
    arr.input = extras[1]
    matches.push(arr)
  })
  return matches.length ? matches : null
}

function pregMatchAll (regex, haystack) {
  var globalRegex = new RegExp(regex, 'g')
  var globalMatch = haystack.match(globalRegex) || []
  var matchArray = []
  var nonGlobalRegex, nonGlobalMatch
  for (var i = 0; i < globalMatch.length; i++) {
    nonGlobalRegex = new RegExp(regex)
    nonGlobalMatch = globalMatch[i].match(nonGlobalRegex)
    matchArray.push(nonGlobalMatch[1])
  }
  return matchArray
}

function generateCSRSubject (options) {
  options = options || {}

  var csrData = {
    C: options.country || options.C,
    ST: options.state || options.ST,
    L: options.locality || options.L,
    O: options.organization || options.O,
    OU: options.organizationUnit || options.OU,
    CN: options.commonName || options.CN || 'localhost',
    DC: options.dc || options.DC || '',
    emailAddress: options.emailAddress
  }

  var csrBuilder = Object.keys(csrData).map(function (key) {
    if (csrData[key]) {
      if (typeof csrData[key] === 'object' && csrData[key].length >= 1) {
        var tmpStr = ''
        csrData[key].map(function (o) {
          tmpStr += '/' + key + '=' + o.replace(/[^\w .*\-,@']+/g, ' ').trim()
        })
        return tmpStr
      } else {
        return '/' + key + '=' + csrData[key].replace(/[^\w .*\-,@']+/g, ' ').trim()
      }
    }
  })

  return csrBuilder.join('')
}

function readFromString (string, start, end) {
  if (Buffer.isBuffer(string)) {
    string = string.toString('utf8')
  }

  var output = []

  if (!string) {
    return output
  }

  var offset = string.indexOf(start)

  while (offset !== -1) {
    string = string.substring(offset)

    var endOffset = string.indexOf(end)

    if (endOffset === -1) {
      break
    }

    endOffset += end.length

    output.push(string.substring(0, endOffset))
    offset = string.indexOf(start, endOffset)
  }

  return output
}

// promisify not tested yet
/**
 * Verifies the signing chain of the passed certificate
 * @namespace
 * @name promisified
 * @property {function}  createPrivateKey               @see createPrivateKey
 * @property {function}  createDhparam       - The default number of players.
 * @property {function}  createEcparam         - The default level for the party.
 * @property {function}  createCSR      - The default treasure.
 * @property {function}  createCertificate - How much gold the party starts with.
 */
module.exports.promisified = {
  createPrivateKey: promisify(createPrivateKey),
  createDhparam: promisify(createDhparam),
  createEcparam: promisify(createEcparam),
  createCSR: promisify(createCSR),
  createCertificate: promisify(createCertificate),
  readCertificateInfo: promisify(readCertificateInfo),
  getPublicKey: promisify(getPublicKey),
  getFingerprint: promisify(getFingerprint),
  getModulus: promisify(getModulus),
  getDhparamInfo: promisify(getDhparamInfo),
  createPkcs12: promisify(createPkcs12),
  readPkcs12: promisify(readPkcs12),
  verifySigningChain: promisify(verifySigningChain),
  checkCertificate: promisify(checkCertificate),
  checkPkcs12: promisify(checkPkcs12)
}


/***/ }),

/***/ 840:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(17)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(299)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 799:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/font-woff":[],"application/font-woff2":[],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/prs.cww":["cww"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":[],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":[],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":[],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":[],"application/x-msdownload":["com","bat"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["wmf","emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":[],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":[],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":[],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/wav":["wav"],"audio/wave":[],"audio/webm":["weba"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":[],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":[],"audio/x-wav":[],"audio/xm":["xm"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/g3fax":["g3"],"image/gif":["gif"],"image/ief":["ief"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/ktx":["ktx"],"image/png":["png"],"image/prs.btif":["btif"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/tiff":["tiff","tif"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":[],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/webp":["webp"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":[],"image/x-pcx":["pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/rfc822":["eml","mime"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.vtu":["vtu"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["x3db","x3dbz"],"model/x3d+vrml":["x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/hjson":["hjson"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/prs.lines.tag":["dsc"],"text/richtext":["rtx"],"text/rtf":[],"text/sgml":["sgml","sgm"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/vtt":["vtt"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":[],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"text/xml":[],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/webm":["webm"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

var fs = __nccwpck_require__(147);
var path = __nccwpck_require__(17);
var mime = __nccwpck_require__(227);
var pem = __nccwpck_require__(187);
var https = __nccwpck_require__(687);
var http = __nccwpck_require__(685);
var opn = __nccwpck_require__(19);

var argv = __nccwpck_require__(693)(process.argv.slice(2));
const getFilePathFromUrl = __nccwpck_require__(705);

// Pre-process arguments
const useHttps = argv.ssl || argv.https;
const basePath = argv.path ? path.resolve(argv.path) : process.cwd();
const baseHref = argv.baseHref ? argv.baseHref : '';
const rootFile = argv.rootFile ? argv.rootFile: 'index.html';
const port = getPort(argv.p);

const NO_PATH_FILE_ERROR_MESSAGE =
    `Error: rootFile ${rootFile} could not be found in the specified path `;

// if using config file, load that first
if (argv.config) {
    let configPath;
    if (path.isAbsolute(argv.config)) {
        configPath = argv.config;
    } else {
        configPath = path.join(process.cwd(), argv.config);
    }
    const getConfig = require(configPath);
    let config;
    if (typeof getConfig === "function") {
        config = getConfig(argv);
    } else {
        config = getConfig;
    }
    // supplement argv with config, but CLI args take precedence
    argv = Object.assign(config, argv);
}

// As a part of the startup - check to make sure we can accessrootFile 
returnDistFile(true);

// Start with/without https
let server;
if (useHttps) {
    const startSSLCallback = (err, keys) => {
        if (err) {
            throw err;
        }

        const options = {
            key: keys.serviceKey,
            cert: keys.certificate,
            rejectUnauthorized: false
        };
        server = https.createServer(options, requestListener);
        start();
    };

    if (argv.key && argv.cert) {
        const serviceKey = fs.readFileSync(argv.key);
        const certificate = fs.readFileSync(argv.cert);
        startSSLCallback(null, { serviceKey, certificate });
    } else {
        pem.createCertificate({ days: 1, selfSigned: true }, startSSLCallback);
    }
} else {
    server = http.createServer(requestListener);
    start();
}

function start() {
    server.listen(port, function() {
        if (argv.open == true || argv.o) {
            opn((useHttps ? "https" : "http") + "://localhost:" + port);
        }
        return console.log("Listening on " + port);
    });
}

// HELPERS

function requestListener(req, res) {
    // Add CORS header if option chosen
    if (argv.cors) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Method", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "authorization, content-type"
        );
        // When the request is for CORS OPTIONS (rather than a page) return just the headers
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }
    }

    let safeFullFileName = getFilePathFromUrl(req.url, basePath, { baseHref });
    console.log(path.extname(safeFullFileName));
    fs.stat(safeFullFileName, function(err, stats) {
        var fileBuffer;
        console.log(safeFullFileName);
        if (!err && stats.isFile()) {
            fileBuffer = fs.readFileSync(safeFullFileName);
            let ct = mime.lookup(safeFullFileName);

            let header = { 'Content-Type': ct };

            if (['.js', '.html', '.css'].includes(path.extname(safeFullFileName)) && fs.existsSync(safeFullFileName + '.gz')) {
                fileBuffer = fs.readFileSync(safeFullFileName + '.gz');
                header['Content-Encoding'] = 'gzip';
            }

            log(`Sending ${safeFullFileName} with ${header}`);
            res.writeHead(200, header);
        } else {
            log(`Route %s, replacing with rootFile ${rootFile}`, safeFullFileName);
            fileBuffer = returnDistFile();
            res.writeHead(200, { "Content-Type": "text/html" });
        }

        res.write(fileBuffer);
        res.end();
    });
}

function getPort(portNo) {
    if (portNo) {
        var portNum = parseInt(portNo);
        if (!isNaN(portNum)) {
            return portNum;
        } else {
            throw new Exception("Provided port number is not a number!");
        }
    } else {
        return 8080;
    }
}

function returnDistFile(displayFileMessages = false) {
    var distPath;

    try {
        if (displayFileMessages) {
            log("Serving from path: %s", basePath);
        }
        distPath = path.join(basePath, rootFile);
        if (displayFileMessages) {
            log("Using default file: %s", distPath);
        }
        return fs.readFileSync(distPath);
    } catch (e) {
        console.warn(NO_PATH_FILE_ERROR_MESSAGE + "%s", basePath);
        process.exit(1);
    }
}

function log() {
    if (!argv.silent) {
        console.log.apply(console, arguments);
    }
}

})();

module.exports = __webpack_exports__;
/******/ })()
;