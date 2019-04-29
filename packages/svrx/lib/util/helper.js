// safe listening port
const EventEmitter = require('events');

const CONST = require('../constant');
const o2str = {}.toString;
const slice = [].slice;
const exec = require('child_process').exec;

async function noopMiddleware(ctx, next) {
    await next();
}

// return promise by callback node-callback-style handler
function npCall(callback, args, ctx) {
    args = args || [];

    return new Promise((resolve, reject) => {
        args.push((err, ret) => {
            if (err) return reject(err);
            return resolve(ret);
        });

        callback.apply(ctx, args);
    });
}

function normalizePluginName(name) {
    return name.indexOf(CONST.PLUGIN_PREFIX) !== 0 ? CONST.PLUGIN_PREFIX + name : name;
}

function isWritableStream(test) {
    // ducking type check
    return test instanceof EventEmitter && typeof test.write === 'function' && typeof test.end === 'function';
}
function isReadableStream(test) {
    // ducking type check
    return test instanceof EventEmitter && typeof test.read === 'function';
}

function typeOf(o) {
    return o == null
        ? String(o)
        : o2str
              .call(o)
              .slice(8, -1)
              .toLowerCase();
}

// simple clone
function clone(target) {
    const type = typeOf(target);

    if (type === 'array') {
        return slice.call(target);
    }
    if (type === 'object') {
        return Object.assign({}, target);
    }
    return target;
}

function openBrowser(target, callback) {
    const map = {
        darwin: 'open',
        win32: 'start '
    };

    const opener = map[process.platform] || 'xdg-open';

    return exec('' + opener + ' ' + target, callback);
}

function is(someThing) {
    return someThing;
}

exports.normalizePluginName = normalizePluginName;
exports.isWritableStream = isWritableStream;
exports.isReadableStream = isReadableStream;
exports.noopMiddleware = noopMiddleware;
exports.openBrowser = openBrowser;
exports.typeOf = typeOf;
exports.npCall = npCall;
exports.clone = clone;
exports.is = is;
