
;(function(jQuery, window) {
  $.extend({
    addCookie: function(key, value, day, path, domain) {
      
      // default path
      
      var index = window.location.pathname.lastIndexOf('/');
      var currentPath = window.location.pathname.slice(0, index);
      path = path || currentPath;

      // default domain
      domain = domain || document.domain;

      // default expire time
      if(!day) {
        document.cookie = `${key}=${value};path=${path};domain=${domain}`;
      }
      
      var date = new Date();
      date.setDate(date.getDate() + day);
      document.cookie = `${key}=${value};expires=${date.toGMTString()};path=${path};domain=${domain};`;

    },

    getCookie: function (key) {
      var resArr = document.cookie.split(';');
      for(var i = 0; i < resArr.length; i++) {
        var tempArr = resArr[i].split('=');
        if(tempArr[0].trim() === key) {
          return tempArr[1];
        }
      }
    },

    delCookie: function (key, path) {
      addCookie(key, getCookie(key), -1, path);
    }

  })
})(jQuery, window);