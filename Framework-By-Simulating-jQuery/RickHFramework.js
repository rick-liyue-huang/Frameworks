/**
 * A simple framework simulating jQuery, named RickHFramework.js,
 * including Selector Module, DOM Module, Event Module, Style Module, Attribute Module and Animation Module.
 * Created by Rick.
 * 
 */


(function (window, undefined) {

    var arr = [],
        push = arr.push,
        slice = arr.slice,
        concat = arr.concat,
        version = 'rickHFramework' + 1 * new Date();

// Constructor
    var rickHFramework = function rickHFramework (selector) {
        return new rickHFramework.fn.init(selector);
    };


//Core methods stored in prototype object
    rickHFramework.fn = rickHFramework.prototype = {

        constructor: rickHFramework,
        selector: null,
        length: 0,
        version: version,

        init: function (selector) {

            if (!selector) return this;

            if (rickHFramework.isString(selector)) {

                if (selector.charAt(0) === '<') {

                    // this.elements = select(selector);
                    rickHFramework.push.apply(this, rickHFramework.parseHTML(selector));
                } else {

                    // this.elements = parseHTML(selector);
                    rickHFramework.push.apply(this, rickHFramework.select(selector));
                    this.selector = selector;
                }
                return this;
            }

            if (rickHFramework.isLikeArray(selector)) {
                rickHFramework.push.apply(this, selector);
                return this;
            }

            if (rickHFramework.isrickHFramework(selector)) {
                return selector;
            }

            if (rickHFramework.isDOM(selector)) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            if(rickHFramework.isFunction(selector)) {

                var oldFn = window.onload;
                if (typeof oldFn === 'function') {
                    window.onload = function () {
                        oldFn();
                        selector();
                    };
                } else {
                    window.onload = selector;
                }
            }
        },

        each: function (callback) {        // this.each(fn)
            rickHFramework.each(this, callback);
            return this;
        }

    };

// Build prototype chain
    rickHFramework.fn.init.prototype = rickHFramework.prototype;

// Define extend function
    rickHFramework.fn.extend = rickHFramework.extend = function (obj) {
        var k;
        for (k in obj) {
            this[k] = obj[k];
        }
    };

// Define the type of obj
    rickHFramework.extend({

        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isString: function (obj) {
            return typeof obj === 'string';
        },
        isLikeArray: function (obj) {
            return obj && obj.length && obj.length >= 0;
        },
        isrickHFramework: function (obj) {
            return !! 'selector' in obj;
            // return obj && obj.version && obj.version.indexOf('rickHFramework') === 0;
        },
        isDOM: function (obj) {
            return !!obj.nodeType;
        }
    });

// basic utility methods
    rickHFramework.extend({

        each: function (arr, fn) {   // rickHFramework.each(arr, fn)
            var i, isArray = rickHFramework.isLikeArray(arr);
            if (isArray) {
                for (i = 0; i < arr.length; i++) {
                    if (fn.call(arr[i], i, arr[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in arr) {
                    if (fn.call(arr[i], i, arr[i]) === false) {
                        break;
                    }
                }
            }
            return arr;
        },

        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        },

        push: push
    });

//  (DOM Module) utility methods
    rickHFramework.extend({

        firstChild: function (dom) {

            var i, node, len = dom.childNodes.length;
            for (i = 0; i < len; i++) {
                node = dom.childNodes[i];
                if ( node.nodeType === 1) {
                    return node;
                }
            }
        },

        //  also can use the following method to get firstChild

        // firstChilid: function (dom) {
        //
        //     var node;
        //     rickHFramework.each(dom.childNodes; function (i, v) {
        //         if (this.nodeType === 1) {
        //             node = this;
        //             return false;
        //         }
        //     });
        //     return node;
        // }

        nextSibling: function (dom) {

            var newDom = dom;
            while (newDom = newDom.nextSibling) {
                if (newDom.nodeType === 1) {
                    return newDom;
                }
            }
        },

        nextAll: function (dom) {

            var newDom = dom, arr = [];
            while (newDom = newDom.nextSibling) {
                if (newDom.nodeType === 1) {
                    arr.push(newDom);
                }
            }
            return arr;
        }

    });

// (DOM Module)  Instance methods

    rickHFramework.fn.extend({

        appendTo: function (selector) {
            var objs = rickHFramework(selector),
                i , j, node, arr = [],
                len1 = objs.length,
                len2 = this.length;
            for (i = 0; i < len1; i++) {
                for (j = 0; j < len2; j++) {

                    node = i === len1 - 1 ? this[j] : this[j].cloneNode(true);
                    arr.push(node);
                    objs[i].appendChild(node);
                }
            }
            return rickHFramework(arr);
        },


        // any for-loop can transfer to each method

        // appendTo: function (selector) {
        //
        //     var objs = rickHFramework(selector);
        //     var self = this;
        //     var len1 = objs.length,
        //         len2 = this.length;
        //     rickHFramework.each(objs, function (i1, v1) {
        //         var that = this;
        //         rickHFramework.each(self, function (i2, v2) {
        //             that.appendChild(i === len1 - 1 ? this : this.cloneNode(true));
        //         });
        //     });
        // },

        append: function (selector) {
            rickHFramework(selector).appendTo(this);
            return this;
        },

        prependTo: function (selector) {
            var objs = rickHFramework(selector),
                i, j, node, arr = [],
                len1 = objs.length,
                len2 = this.length;
            for (i = 0; i < len1; i++) {
                for (j = 0; j < len2; j++) {

                    node = i === len1 - 1 ? this[j] : this[j].cloneNode(true);
                    arr.push(arr);
                    objs[i].insertBefore(node, rickHFramework.firstChild(objs[i]));
                }
            }
            return rickHFramework(arr);
        },

        prepend: function (selector) {
            rickHFramework(selector).prependTo(this);
            return this;
        },

        next: function () {

            var arr = [];
            rickHFramework.each(this, function (i, v) {
                arr.push(rickHFramework.nextSibling(v));
            });
            return rickHFramework(arr);
        },

        nextAll: function () {

            var arr = [];
            rickHFramework.each(this, function (i, v) {
                arr.push.apply(arr, rickHFramework.nextAll(v));
            });
            return rickHFramework(arr);
        },

        // remove: function () {
        //
        //     var i, arr = [], len = this.length;
        //     for (i = 0; i < len; i++) {
        //         this[i].parentNode.removeChild(this[i]);
        //     }
        //     return this;
        // }

        remove: function () {

            var arr = [];
            this.each(function () {
                arr.push( this.parentNode.removeChild(this) );
            });
            return rickHFramework(arr);
        }
    });


// Event Module

    rickHFramework.Event = function (e) {
        this.event = e;
    };

    rickHFramework.Event.prototype = {
        constructor: rickHFramework.Event,
        stopPropagation: function () {
            this.event.stopPropagation();
            this.event.cancelable = true;
        }
    };

    rickHFramework.fn.extend({

        // a path how to get the formal method of 'on' and 'off'

        // click: function (fn) {
        //     this.each(function () {
        //         this.onclick = fn;
        //     });
        // },
        //
        // click: function (fn) {
        //     this.each(function () {
        //         this.addEventListener('click', fn);
        //     });
        // },
        //
        // click: function (fn) {
        //     this.each(function () {
        //         if (this.addEventListener) {
        //             this.addEventListener('click', fn);
        //         } else {
        //             this.attachEvent('onclick', fn);
        //         }
        //     });
        // },

        // mouseover: function (fn) {
        //     return this.on('mouseover', fn);
        // },

        on: function (type, callback) {

            this.each(function () {

                if (this.addEventListener) {

                    // this.addEventListener(type, callback);
                    this.addEventListener(type, function (e) {

                        e = e || window.event;
                        callback.call(this, new rickHFramework.Event(e));
                    });
                } else {

                    // this.attachEvent('on' + type, callback);
                    this.attachEvent('on' + type, function (e) {

                        e = e || window.event;
                        callback.call(this, new rickHFramework.Event(e));
                    });
                }
            });
            return this;
        },

        off: function (type, callback) {

            this.each(function () {
                this.removeEventListener(type, callback);
            });
            return this;
        }
    });

    rickHFramework.each(("click,mouseover,mouseout,mouseenter,mouseleave," +
    "mousemove,mousedown," +
    "mouseup,keydown,keyup").split(','), function (i, v) {
        rickHFramework.fn[v] = function (callback) {
            return this.on(v, callback);
        }
    });

    rickHFramework.fn.extend({

        hover: function (fn1, fn2) {
            return this.moueover(fn1).mouseout(fn2);
        },

        toggle: function () {

            var args = arguments, i = 0;
            return this.click(function (e) {
                args[i++ % args.length].call(this, e);
            });
        }

    });


// Style Module

    rickHFramework.fn.extend({

        css: function (cssName, cssValue) {

            if (typeof cssName === 'object') {

                return this.each(function () {

                    var k;
                    for (k in cssName) {
                        this.style[k] = cssName[k];
                    }
                });
            } else if (cssValue === undefined) {

                var style = window.getComputedStyle(this[0]);
                return style[cssName];
            } else {

                return this.each(function () {
                    this.style[cssName] = cssValue;
                });
            }
        },

        hasClass: function (cName) {

            var has = false;
            rickHFramework.each(this[0].className.split(' '), function (i, v) {

                if (v === cName) {
                    has = true;
                    return false;
                }
            });
            return has;
        },

        addClass: function (cName) {

            return this.each(function () {

                var classname = this.className;
                classname += ' ' + cName;
                this.className = rickHFramework.trim(classname);
            });
        },

        removeClass: function (cName) {

            return this.each(function () {

                return this.className = rickHFramework.trim(
                    (' ' + this.className + ' ').replace(' ' + cName + ' ', ' ')
                );
            });
        },

        toggleClass: function (cName) {

            if (this.hasClass(cName)) {
                this.removeClass(cName);
            } else {
                this.addClass(cName);
            }
        }
    });

// Attribute Module

    rickHFramework.fn.extend({

        attr: function (attrName, attrValue) {

            if (arguments === 1) {

                return this[0][attrName];

            } else {

                return this.each(function () {
                    this[attrName] = attrValue;
                });
            }
        },

        val: function (value) {

            if (value === undefined) {

                return this[0].value;

            }  else {

                return this.each(function () {
                    this.value = value;
                });
            }
        },

        html: function (html) {

            if (html === undefined) {

                return this[0].innerHTML;

            } else {

                return this.each(function () {
                    this.innerHTML = html;
                });
            }
        },

        text: function (text) {

            if (text === undefined) {

                return rickHFramework.getInnerText(this[0]);

            } else {

                return this.each(function () {
                    rickHFramework.setInnerText(this, text);
                });
            }
        }

    });

    rickHFramework.extend({

        getInnerText: function (dom) {

            var list = [];
            if (dom.innerText != undefined) {
                return dom.innerText;
            } else {
                getTextNode(dom, list);
                return list.join('');
            }

            function getTextNode(dom, arr) {

                var i, len = dom.childNodes.length, node;

                for (i = 0; i < len; i++) {
                    node = dom.childNodes[i];
                    if (node.nodeType === 3) {
                        arr.push(node.nodeValue);
                    } else {
                        getTextNode(node, arr);
                    }
                }
            }
        },

        setInnerText: function (dom, str) {

            if ('innerText' in dom) {
                dom.innerText = str;
            } else {

                dom.innerText = '';

                dom.appendChild(document.createTextNode(str));
            }
        }

    });



// (Animation Module) utility methods

    rickHFramework.extend({

        kv: {
            left: 'offsetLeft',
            top: 'offsetTop',
            width: 'offsetWidth',
            height: 'offsetHeight'
        },
        getDisctance: function ( dom, target ) {
            var o = {};
            for ( var k in target ) {
                o[ k ] = parseInt( target[ k ] ) - dom[ rickHFramework.kv[ k ] ];
            }
            return o;
        },

        getLocation: function ( dom, target ) {
            var o = {};
            for ( var k in target ) {
                o[ k ] = dom[ rickHFramework.kv[ k ] ];
            }
            return o;
        },


        easings: function ( x, time, startLocations, target, dur, easingName ) {
            var o = {};
            for ( var k in target ) { // top, left ...
                o[ k ] = rickHFramework.easing[ easingName ]( x, time, startLocations[ k ],
                    parseInt( target[ k ] ),
                    dur );
            }
            return o;
        },

        setStyle: function ( dom, startLocations, tweens, target ) {
            // setting every style on the dom element
            for ( var k in target ) {
                dom.style[ k ] = startLocations[ k ] + tweens[ k ] + 'px';
            }
        },
        easing: {  // import from the easing frame
            liner: function ( x, t, b, c, d ) {
                // console.log( 'constant speed' );
                return t * ( c - b ) / d;
            },
            minusspeed: function ( x, t, b, c, d ) {
                // need v0 and a
                var a = 2 * ( c - b ) / ( d * d ),
                    v_0 = a * d;
                return v_0 * t - a * t * t / 2;
            },
            easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
            },
            easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
            },
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
            },
            easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
            easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
            },
            easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
            },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
            },
            easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },

            easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
            }
        }
    });


// (Animation Module) instance methods
    rickHFramework.fn.extend({
        timerId: null,
        animate: function ( target, dur, easingName ) {
            easingName = easingName || 'liner';
            var dom = this[ 0 ];

            var totalDistances = rickHFramework.getDisctance( dom, target ),
                startTime = +new Date,
                startLocations = rickHFramework.getLocation( dom, target ),


                stepTime = 25,

                play = function () {
                    var time = +new Date - startTime, // the eclipse time in mm unit
                        tweens;
                    // speed * time
                    if ( time >= dur ) {
                        tweens = totalDistances;

                        clearInterval( this.timerId );
                        this.timerId = null;
                    } else {
                        tweens = rickHFramework.easings( null, time, startLocations, target, dur, easingName );
                    }

                    rickHFramework.setStyle( dom, startLocations, tweens, target );
                };
            play();
            this.timerId = setInterval( play, stepTime );  // 50Hz
        },
        stopAnimating: function () {
            console.log( this.timerId );
            clearInterval( this.timerId );
        },
        isAnimating: function () {
            return this.timerId === null;
        }
    });


//  Selector Module

    /**
     * To simulate the jQuery Selector
     *
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

/*
*****  a simple version of Selector module
 var select = function (selector) {

 var arr = [], first = selector.charAt(0), node;

 if (first === '#') {
 node = document.getElementById(selector.slice(1));
 if (node) {
 // arr.push.call(arr, node);
 arr.push(node);
 } else {
 return null;
 }
 // arr.push.call(arr, document.getElementById(selector.slice(1)));
 } else if (first === '.') {
 arr.push.apply(arr, document.getElementsByClassName(selector.slice(1)));
 } else {
 arr.push.apply(arr, document.getElementsByTagName(selector));
 }
 return arr;
 };
* */


// define if arg is string
    var parseHTML = function (html) {

        var i, arr = [], node;
        var div = document.createElement('div');
        div.innerHTML = html;
        for (i = 0; i < arr.length; i++) {
            node = div.childNodes[i];
            arr.push(node);
        }
        return node;
    };

    rickHFramework.extend({
        select: select,
        parseHTML: parseHTML
    });


    window.RH = window.rickHFramework = rickHFramework;

})(window);


