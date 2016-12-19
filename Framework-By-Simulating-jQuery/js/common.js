/**
 * Created by rickhuang on 19/12/16.
 */

// 对基本方法的封装

var myPush = function (target, els) {

    var j = target.length,
        i = 0;
    while ((target[j++] = els[i++])) {}
    target.length = j - 1; // 伪数组 的长度是不会随着加入的元素而增加。
};


var getTag = function (tagName, results) {
    results = results || [];
    try {
        results.push.apply(results, document.getElementsByTagName(tagName));
    } catch (e) {
        myPush(results, document.getElementsByTagName(tagName));
    }
    return results;
};

var getId = function (idName, results) {
    results = results || [];
    try {
        results.push(document.getElementById(idName));
    } catch (e) {
        myPush(document.getElementById(idName));
    }
    return results;
};

var getClass = function (className, results) {
    results = results || [];

    var tempArr;
    if (document.getElementsByClassName) {
        results.push.apply(results, document.getElementsByClassName(className));
    } else {

        each(getTag("*"), function (i, v) {
            if ((' ' + v.className + ' ').indexOf(' ' + className + ' ') != -1) {
                results.push(v);
            }
        });
    }
    return results;
};


// 对循环的封装

var each = function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        if (fn.call(arr[i], i, arr[i]) === false) {
            break;
        }
    }
};

// get 方法封装 -- 通用的方法
var get = function (selector, results) {
    results = results || [];

    var rquickrExp = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|\*)$/,
        m = rquickrExp.exec(selector);

    if (m) {
        if (m[1]) {
            results = getId(m[1], results);
        } else if (m[2]) {
            results = getClass(m[2], results);
        } else if (m[3]) {
            results = getTag(m[3], results);
        } else if (m[4]) {
            results = getTag(m[4], results);
        }
    }
    return results;
};









































