//by RICK HUANG
    //真正的框架封装,

    //    构造函数

(function (window, undefined) { // 传入window是为了减少变量作用域的搜索，
// undefined, 是因为有些浏览器没有实现undefined，将其作为变量来解释，这时候不传参表示其值就表示没有。

    var rickH = function rickH(selector) {
        return new rickH.fn.init(selector);
    };

//    核心原型
    rickH.fn = rickH.prototype = {
        constructor: rickH,
        selector: null,
        init: function (selector) {

            if (typeof selector === 'string') {

                if (selector.charAt(0) === '<') {
                    this.elements = parseHTML(selector);
                } else {
                    this.elements = select(selector);
                }
            }
            this.selector = selector; // 表明只要有selector 属性的对象就是 rickH 对象
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
            return !!obj.selector;
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



    });





    var select = function (selector) {
        // 简单写法
        var first = selector.charAt(0);
        var arr = [];
        if (first === '#') {
            arr.push.call(arr, document.getElementById(selector.slice(1)));
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
