//by RICK HUANG
//真正的框架封装,

//    构造函数

(function (window, undefined) { // 传入window是为了减少变量作用域的搜索，
// undefined, 是因为有些浏览器没有实现undefined，将其作为变量来解释，这时候不传参表示其值就表示没有。

    var arr = [],
        push = arr.push,
        slice = arr.slice,
        concat = arr.concat,
        version = 'rickH ' + 1 * new Date();

    var rickH = function rickH(selector) {
        return new rickH.fn.init(selector);
    };

//    核心原型
    rickH.fn = rickH.prototype = {
        constructor: rickH,
        version: version,
        selector: null,
        length: 0, // 在原型中添加这个属性， 因为如果没有这个属性就默认从原型取。



        //    进一步强化appendTo:
        /*
         * 考虑appendTo 的参数的可能性。
         *
         * 假定参数是选择器，那么得到的是rickH对象（伪数组），那么
         * 代码的执行就没有问题.
         * 如果传入的是dom 数组， dom对象， rickH对象 怎么办
         *
         * 1》如果是DOM数组 -- 只要objs 就是该DOM数组就可以了
         * 2> 如果传入的是DOM对象， --- 只需要objs = [selector]; 将其转化为单元素数组即可
         * 3》 如果传入的是rickH对象，与一样  objs = selector
         * 4> 如果是字符串则和开始一样。 objs = rickH(selector);
         *
         * 那么如果将其在一句代码中完成判断。
         *
         * 思路就是 强化rickH 构造函数的兼容性， 因此上面的代码不需要再做改变
         *
         * selector 分为
         * null, undefined, '',
         * 函数，
         * 字符串
         * DOM数组
         * DOM 对象
         * rickH 对象
         *
         * */





        init: function (selector) {

            if (!selector) return this;

            if (rickH.isString(selector)) {

                if (selector.charAt(0) === '<') {
                    // this.elements = parseHTML(selector);
                    rickH.push.apply(this, parseHTML(selector));
                } else {
                    // this.elements = select(selector);
                    rickH.push.apply(this, select(selector));
                    this.selector = selector; // 表明只要有selector 属性的对象就是 rickH 对象
                }
                return this;
            }

            // DOM 对象
            else if (rickH.isDOM(selector)) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            // rickH 对象
            else if (rickH.isRickH(selector)) {
                return selector;
            }

            // DOM 数组
            else if (rickH.isLikeArray(selector)) {
                rickH.push.apply(this, selector);
                return this;
            }

        }
    };

//    原型链的调整
    rickH.fn.init.prototype = rickH.prototype;

//    为了可扩展
    rickH.extend = rickH.fn.extend = function (obj) {
        // 将obj的成员加入到 this上面
        var k;
        for (k in obj) {
            this[k] = obj[k];
        }
    };

// 扩展方法，基本的工具方法
    rickH.extend({

        each: function (arr, fn) {
            var i, l = arr.length, isArray = rickH.isLikeArray(arr);
            if (isArray) {
                // 数组
                for (i = 0; i < l; i++) {
                    if (fn.call(arr[i], i, arr[i]) === false) {
                        break;
                    }
                }
            } else {
                // 对象
                for(i in arr) {
                    if (fn.call(arr[i], i, arr[i]) === false) {
                        break;
                    }
                }
            }
            return arr;
        },

        push: push,

        firstChild: function (dom) {
            var node = dom.childNodes[i], i, l = dom.childNodes.length;
            for (i = 0; i < l; i++) {
                if (node.nodeType === 1) {
                    return node;
                }
            }
        }

    });


// 判断类型的方法
    rickH.extend({
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isString: function (obj) {
            return typeof obj === 'string';
        },
        isLikeArray: function (obj) {
            return obj && obj.length && obj.length >= 0;
        },
        isRickH: function (obj) {
            // return !!obj.selector;
            // return !!obj && obj.version && obj.version === version; // 必须是同一页面,不适用于嵌入界面， 同一框架
            // return !!obj && obj.version && obj.version.indexOf('rickH') === 0; //只要是有这个属性就可以
            // return obj.constructor.name === 'rickH'; // 因为有constructor这个属性，所以可以用这个方式来判断
            return 'selector' in obj;
        },
        isDOM: function (obj) {
            return !!obj.nodeType;
        }

    });


//    基本的DOM操作
    rickH.fn.extend({

//        这里先假定 selector 是一个 DOM对象
        /*appendTo: function (selector) {
         // 将this.elements 加入到selector中

         rickH.each(this.elements, function (i, v) { // 遍历所有的this.elements然后添加到DOM元素中
         selector.appendChild(this);
         });
         },*/

//        如果假定 selector id 选择器 '#id' 形式

//        appendTo: function (selector) {
//            这时候可以使用 rickH(selector)
        /*
         * 问题：
         * 将谁加到谁上面
         * this.elements 加到 rickH(selector).elements 上面
         *
         * */
//            rickH.each(this.elements, function () {
//                rickH(selector).elements[0].appendChild(this);
//            });
//        }

        // 如果selector是标签选择器，则需要将所有的子元素 this.elements重复的加入到这些标签中
        /*
         appendTo: function (selector) {
         var self = this;
         var objs = rickH(selector).elements;
         rickH.each(objs, function (i1,v1) {

         //                将this.elements[i] 加到that 上面
         var that = this;
         rickH.each(self.elements, function (i2,v2) {
         // this 当前元素要加入到that上
         that.appendChild( i1 == objs.length - 1 ?
         this :
         this.cloneNode(true)); // 因为父节点的改变
         //                    如果是最后一个就不克隆
         });
         });

         }
         */

        /*
         appendTo: function (selector) {
         var objs = rickH(selector).elements,
         i, j,
         len1 = objs.length,
         len2 = this.elements.length;
         for (i = 0; i < len1; i++) {

         for (j = 0; j < len2; j++) {
         objs[i].appendChild(i === len1 - 1 ?
         this.elements[j] :
         this.elements[j].cloneNode(true));
         }
         }
         }
         */

        appendTo: function (selector) {
            var /*objs = rickH(selector), */ // 这里是假定是字符串，最后得到的是伪数组，
                objs = rickH(selector),  // 这里如果参数就是DOM数组
                i, j,
                len1 = objs.length,
                len2 = this.length,
                arr = [], node;
            for (i = 0; i < len1; i++) {
                for (j = 0; j < len2; j++) {

                    node = i == len1 - 1 ?
                        this[j] :
                        this[j].cloneNode(true);
                    arr.push(node);
                    objs[i].appendChild(node);
                }
            }
            return rickH(arr);  // 解决了 链式编程
        },

        //回顾 jq, $('body').append('<div></div>'),
        append: function (selector) {
            rickH(selector).appendTo(this);
            return this;
        },


        prependTo: function (selector) {
            // this 加入到 selector 最前面
        //    父元素.insertBefore(新元素， 参考元素)
            var objs = rickH(selector),
                i, j,
                len1 = this.length,
                len2 = objs.length,
                arr = [], node;
            for (i = 0; i < len2; i++) {
                for (j = 0; j < len1; j++) {
                    node = i === len2 - 1 ?
                        this[j] :
                        this[j].cloneNode(true);
                    // this[j] 加到 objs[i] 里面的前面
                    arr.push(node);
                    objs[i].insertBefore(node, rickH.firstChild(objs[i]));
                }
            }
            return rickH(arr);
        },

        prepend: function (selector) {

        },

        insertAfter: function () {

        },

        after: function (selector) {

        }


    });





    var select = function (selector) {
        // 简单写法
        var first = selector.charAt(0);
        var arr = [], node;
        if (first === '#') {
            node = document.getElementById(selector.slice(1));
            if (node) {
                arr.push.call(arr, node);
            } else {
                return null;
            }

        } else if (first === '.') {
            arr.push.apply(arr, document.getElementsByClassName(selector.slice(1)));
        } else {
            arr.push.apply(arr, document.getElementsByTagName(selector));
        }
        return arr;
    };

    var parseHTML = function (html) {
        var div = document.createElement('div');
        var arr = [], i;
        div.innerHTML = html;
        for (i = 0; i < div.childNodes.length; i++) {
            arr.push(div.childNodes[i]);
        }
        return arr;
    };


//    对外红开
    window.RH = window.rickH = rickH;
})(window);


































