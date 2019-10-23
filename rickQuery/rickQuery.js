
// by checking jQuery source code, we find that it is one IIFE.
// 1. rickQuery is one closer to prevent the vairable pollution. 
(function(window, undefined) {
  // ensure the whole rickQuery variable as fn.init() format
  rickQuery = function(selector) {
    return new rickQuery.prototype.init(selector);
  };

  rickQuery.prototype = {
    // define rickQuery prototype
    constructor: rickQuery,
    // define entry function
    init: function(selector) {
      // based on the different types of selector to return the different rickQuery object (instance)
      // 1. selector is one of '', 0, false, NaN, null, undefined
      if(!selector) {
        return this;
      }

      // 2. selector is string type
      else if(rickQuery.isString(selector)) {

        // trim the selector on both sides
        selector = rickQuery.trim(selector);

        // 2.1 selector is HTML string type: '<div><p></p></div><div><p></p></div>'
        if(rickQuery.isHTML(selector)) {

          var temp = document.createElement('div');
          temp.innerHTML = selector;

          // method one:
          /*
          for(var i = 0; i < temp.children.length; i++) {
            // only traverse the child selectors 
            this[i] = temp.children[i];
          }
          this.length = temp.children.length;
          */

          // method two: transfer the DOM pseudo-array to rickQuery pseudo-array
          [].push.apply(this, temp.children);
          return this;
        } 
        else {
          // 2.2 selector is 'selector' string type: '.class' or '#'
          var res = document.querySelectorAll(selector);
          [].push.apply(this, res);
          return this;
        }

      }
      // 3. selector is array type: [...]
      else if(rickQuery.isArray(selector)) {

        /*
        // 3.1 selector is the true array
        if('[object Array]' === ({}).toString.call(this)) {
          // transfer the true array to pseudo array
          [].slice.call(this, selector);
          return this;

        } else {
          // 3.2 selector is the pseudo array
          // '[object Object]' === ({}).toString.call(this)
          var arr = [].slice.call(selector);
          [].push.apply(this, arr);
          return this;
        }
        */
      //  also can use one unified method to call the array type;
      // notice: transfer to true array use:
       var arr = [].slice.call(selector);
      //  notice: transfer to pseudo array use:
       [].push.apply(this, arr);
       return this;

      }
      // selector is function type
      else if(rickQuery.isFunction(selector)) {
        rickQuery.ready(selector);
      }
      // 5. selector is object, DOM element or basic type
      else {
        this.length = 1;
        this[0] = selector;
        return this;
      }
    },
    // define method to get version
    version: '1.1.0',
    // define the default 'selector' methods
    selector: '',
    // define the default 'length' method
    length: 0,
    // push mehtod: add new element to rickQuery, [].push.apply(this)
    push: [].push,
    // sort method: sort the rickQuery instance
    sort: [].sort,
    // splice method: based on array splice method
    splice: [].splice,
    // toArray method: transfer pseudo array to true array
    toArray: function() {
      return [].slice.call(this); 
    },
    // get method: get the DOM element by index 
    get: function(num) { // no 'num'
      if(0 === arguments.length) {
        return this.toArray(); // return the true array
      } 
      // num is positive number
      else if(num >= 0) {
        return this[num];
      }
      // num is negative number
      else {
        return this[this.length + num];
      }
    },
    // eq method: return the rickQuery element by index
    eq: function(num) {
      if(0 === arguments.length) {
        return new rickQuery();
      } 
      // else if(num > 0) {
      //   return rickQuery(this.get(num));
      // } 
      // else {
      //   return rickQuery(this.get(num))
      // }
      else {
        return rickQuery(this.get(num));
      }
    },
    // first method: return the first rickQuery instance
    first: function() {
      return this.eq(0);
    },
    // last method: return the last rickQuery instance
    last: function() {
      return this.eq(-1);
    },
    // each method: traverse the rickQuery instance, (index, value)
    // based on the rickQuery class each method
    each: function(fn) {
      rickQuery.each(this, fn);
    }
  }

  // define one 'extend' method to define rickQuery class and rickQuery instance methods inside.
  rickQuery.extend = rickQuery.prototype.extend = function(object) {
    for(var key in object) {
      // assign the properties and mehtods of object to 'this', which means rickQuery class or rickQuery instance.
      this[key] = object[key]
    }
  }

  // define some tool mehtods in rickQuery class
  rickQuery.extend({
    // define trim method to compatible with ie8
    trim: function(str) {
      if(str.trim) {
        return str.trim();
      } else {
        return str.replace(/^\s+|\s+$/, '');
      }
    },
    isObject: function(selector) {
      return 'object' === typeof selector;
    },
    isFunction: function(fn) {
      return 'function' === typeof fn;
    },
    isWindow: function(selector) {
      return window === selector;
    },
    isString: function(selector) {
      return 'string' === typeof selector;
    },
    isHTML: function(str) {
      return '<' === str.charAt(0) && '>' === str.charAt(str.length - 1) && str.length >= 3
    },
    isArray: function(selector) {
      return rickQuery.isObject(selector) && 'length' in selector && !rickQuery.isWindow(selector);
    },
    // after the page loaded, it executed, and compatible with IE8, 
    ready: function(fn) {
      if('complete' == document.readyState) {
        fn();
      } else if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
          fn();
        });
      } else {
        document.attachEvent('onreadystatechange', function() {
          if('complete' == document.readyState) {
            fn();
          }
        })
      }
    },

    // define each method in the rickQuery class
    each: function(obj, fn) {
      // confirm its array
      if(rickQuery.isArray(obj)) {
        for(var i = 0; i < obj.length; i++) {
          // var res = fn(i, obj[i]);
          // let this point to val(obj[i])
          var res = fn.call(obj[i], i, obj[i]);
          if(true === res) {
            continue;
          } else if(false === res) {
            break;
          }
        }
      }
      // confirm its object
      else if(rickQuery.isObject(obj)) {
        for(var key in obj) {
          // var res = fn(key, obj[key]);
          // let this point to val(obj[key])
          var res = fn.call(obj[key], key, obj[key]);
          if(true === res) {
            continue;
          } else if(false === res) {
            break;
          }
        }
      }
    }
    

  });

  // unify rickQuery prototype and init prototype
  rickQuery.prototype.init.prototype = rickQuery.prototype;

  // expose the 'window' to let outter call the variables defined in IIFE.
  window.rickQuery = window.$$ = rickQuery; 

})(window)
















