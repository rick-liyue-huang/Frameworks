/**
 * To simulate the jQuery Selector
 * Created by Rick Huang
 */

var select =

(function () {

/*
* support is a object used to substitute the document element in DOM, under some circumstance. here we provide a object
* named support, and this support object will stop the engine search the special method in the prototype chain. If we
* always search along the prototype chain, it will affect the browser performance.
* */
var support = {};

support.getElementsByClassName = (function () {
    var isExist = !!document.getElementsByClassName;
    if (isExist && typeof document.getElementsByClassName === 'function') {

//  we will create some elements, and attach the 'class' attribute, and look whether it will get
//   the upon element by getElementsByClassName method.
        var div = document.createElement('div');
        var divWithClass = document.createElement('div');
        divWithClass.className = 'c';
        div.appendChild(divWithClass);

        // should return the true
        return div.getElementsByClassName('c')[0] === divWithClass;
    }
    // otherwise return the false.
    return false;
})();


// myPush is a method to copy the push method,
var myPush = function (target, els) {
    var j = target.length,
        i = 0;
    while ((target[j++] = els[i++])) {}
    target.length = j - 1;
};

// some browser does not support the trim() method, so to realize it by RegExp.
var myTrim = function (str) {
    if (String.prototype.trim) {
        return str.trim();
    } else {
        return str.replace(/^\s+|\s+$/g, '');
    }
};


/*
 * get the basic dom element
 * */
var getId = function ( id, results ) {
	results = results || [];
	results.push( document.getElementById( id ) );
	return results;
};

/*
* a special explanation about it, because the getElementsByClassName is a new method since html5. In order to
* realize it in different browsers, we should use some more common method to realize,
*
* */
var getClass = function (classname, context, results) {
    results = results || [];

    if (support.getElementsByClassName) {
        results.push.apply(results, context.getElementsByClassName(classname));
    } else {
        // 2. change to each function
        each(get('*', context), function (i, v) {
            if ((' ' + v.className + ' ').indexOf(' ' + classname + ' ') != -1) {
                results.push(v);
            }
        });

/*
* the following comments show the some other methods to realize the each function.
* */

        // 1. use the outer for-loop method
        // var i, tempArr = context.getElementsByTagName('*');
        // for (i = 0; i < tempArr.length; i++) {
        //1.2 by indexOf method
        //     // if ((' ' + tempArr[i].className + ' ').indexOf(' ' + classname + ' ') != -1) {
        //     //     results.push(tempArr[i]);
        //     // }
        //1.1 by for-loop method
        //     // var list = tempArr[i].className.split(' ');
        //     // for (var j = 0; j < list.length; j++) {
        //     //     if (list[j] === '') continue;
        //     //     if (list[j] === classname) {
        //     //         results.push(tempArr[i]);
        //     //         break;
        //     //     }
        //     //  }
        // }
    }

    return results;
};

var getTag = function (tag, context, results) {
    results = results || [];

    try {
        results.push.apply(results, context.getElementsByTagName(tag));
    } catch (e) {
        myPush(results, context.getElementsByTagName(tag));
    }

    return results;
};


// the composed method to include the id, className, and tag method,
var get = function (selector, context, results) {
    results = results || [];
    context = context || document;

    var rquickExpression = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|(\*))$/,
        m = rquickExpression.exec(selector);

    if (m) {

/*
* the 'context' is the parent node of selector, here we will consider the the type of context,
* 1. when context is string, we can use get()method to transfer to dom element,
* 2. and we also hope the context is a array, which is maybe just contain only one element,
*    so when context is dom element we will transfer to dom array, and then loop the context array by each() method.
* */

// if context is a string, transfer to dom element.
        if (typeof context === 'string') {
            context = get(context);
        }
// if context is a dom element, we will change to array, and then each every
        if (context.nodeType) {
            context = [context];
        }

        each(context, function (i, v) {
// here context is already the array, so will loop the selector in every context array element.
            if (m[1]) {
                results = getId(m[1], results);
            } else if (m[2]) {
                results = getClass(m[2], v, results);
            } else if (m[3]) {
                results = getTag(m[3], this, results);
            } else if (m[4]) {
                results = getTag(m[4], this, results);
            }
        });
    }
    return results;
};


var each = function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        if (fn.call(arr[i], i, arr[i]) === false) {
            break;
        }
    }
};


/*
* the select function will consider the "selector", firstly, consider the parallel dom element by ",",
* and then consider the descendent selector in every ",",
* */
var select = function (selector, context, results) {
    results = results || [];
    context = context || document;

    var newSelectors = selector.split(','); // => [ '.dv  .c1', ' .c2' ]

    each(newSelectors, function (i, v) {

        // var list = newSelectors[i].split(' ');
        var list = v.split(' ');
        var c = context;
        // context -> list[ 0 ] -> list[ 1 ] -> ... -> list[ length - 1 ]
        for (var j = 0; j < list.length; j++) {
            if (list[j] == '') continue;
            c = get(list[j], c);
        }

        results.push.apply(results, c);
        // results.push.apply(results, get(myTrim(v), context));

    });
// the following for-loop methods will be replaced by each function.
    // for (var k in newSelectors) {
    //     var v = newSelectors[k];
    //     v = myTrim(v);
    //     var list = get(v, context);
    //     results.push.apply(results, list);
    // }
    return results;
};


// for this module, the "select" is the only open entry (API) to public. 
return select;

})();
