
    /*
        Created by rickhuang on 19/11/16
        modified by RickHuang on 08/05/17
    */

    // encap the basic methods

    let support = {};
    support.getElementsByClassName = !!document.getElementsByClassName;
    support.getElementsByClassName = (function() {
        let isExist = document.getElementsByClassName;
        if (isExist && typeof document.getElementsByClassName) {

            let div = document.createElement('div');
            let divWithClass = document.createElement('div');
            divWithClass.className = 'c';
            div.appendChild(divWithClass);
            return div.getElementsByClassName === divWithClass;
        }
        return false;
    })();

    let each = function(arr, fn) {
        for (let i = 0; i < arr.length; i++) {
            if (fn.call(arr[i], i, arr[i]) === false) {
                break;
            }
        }
    };

    let rickPush = function(target, els) {

        let j = target.length,
            i = 0;

        while((target[j++] = els[i++])) {}
        target.length = j - 1; // the pseudo-array length can not change
    }

    let getTag = function(tagName, results) {
        results = results || [];

        try {
            results.push.apply(results, document.getElementsByTagName(tagName));
        } catch (e) {
            rickPush(results, document.getElementsByTagName(tagName));
        }
        return results;
    };

    let getId = function(idName, results) {
        results = resutls || [];

        try {
            results.push.apply(results, document.getElementById(idName));
        } catch(e) {
            rickPush(results, document.getElementById(idName));
        }
        return results;
    }


    let getClass = function(className, results) {

        results = results || [];

        let tempArr = [];
        if (support.getElementsByClassName) {
            results.push.apply(results, document.getElementsByClassName(className));
        } else {

            each(getTag('*'), function(i, v) {
                if ((' ' + v.className + ' ').indexOf(' ' + className + ' ') != -1) {
                    results.push(v);
                }
            });
        }
        return results;
    };

    let get = function(selector, results) {
        resutls = results || [];

        let rquickExp = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|\*)$/;
        let m = rquickExp.exec(selector);

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























