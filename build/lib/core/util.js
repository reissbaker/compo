'use strict';
function backwards(array, callback) {
    for (var i = array.length - 1; i >= 0; i--) {
        callback(array[i]);
    }
}
exports.backwards = backwards;
function each(array, callback) {
    for (var i = 0, l = array.length; i < l; i++) {
        callback(array[i]);
    }
}
exports.each = each;
function safeEach(array, callback) {
    for (var i = 0, l = array.length; i < l; i++) {
        var curr = array[i];
        if (curr != null)
            callback(curr);
    }
}
exports.safeEach = safeEach;
function remove(array, item) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] === item) {
            array.splice(i, 1);
            return;
        }
    }
}
exports.remove = remove;
function nullify(array, item) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] === item) {
            array[i] = null;
            return;
        }
    }
}
exports.nullify = nullify;
function compact(array) {
    var start = -1, runLength = 0, inRun = false;
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] == null) {
            if (!inRun) {
                inRun = true;
                start = i;
            }
        }
        else if (inRun) {
            runLength = i - start;
            array.splice(start, runLength);
            i -= runLength;
            l -= runLength;
            inRun = false;
        }
    }
    // Clean up at end
    if (inRun)
        array.splice(start, i - start);
}
exports.compact = compact;
function extend(Klass, OtherKlass) {
    var Temp = function () {
    };
    Temp.prototype = Klass.prototype;
    OtherKlass.prototype = new Temp();
    OtherKlass.prototype.constructor = OtherKlass;
    return OtherKlass;
}
exports.extend = extend;
