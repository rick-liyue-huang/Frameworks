
// using jQuery to handle event
// using ajax to communicate with 'weibo.php' file

// listen the input value change
$('body').delegate('.comment', 'propertychange input', function() {
  // console.log($(this).val());
  // confirm it has value
  if($(this).val().length > 0) {
    // let 'send' input enable
    $('.send').prop('disabled', false); 
  } else {
    // let 'send' input disable
    $('.send').prop('disabled', true);
  }
});

// get the first page content by loading web
// [{id: ID, content: "内容", time: 时间戳, acc: 顶次数, ref: 踩次数}, {...}, ...]
getMsgList(1);

// get page number
getMsgPage();

$('.send').click(function() {
  // alert('send');
  // get the content of textarea
  var $text = $('.comment').val();

  // start to use ajax to communicate with server
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=add&content='+$text,
    success: function(msg) {
      // match the return data with the server setting content
      // {error: 0, id: 0, time: 1572092453, acc: 0, ref: 0}
      // {error: 0, id: 新添加内容的ID, time: 添加时间, acc: 点赞数, ref: 点踩数}
      // console.log(msg);

      // transfer the json string to obj
      // var obj = JSON.parse(msg);
      // console.log(obj);
      // 'Uncaught SyntaxError: Unexpected token e in JSON at position 1' means this is not a standard json string
      // the standard json string should be '{"error": "0", "id": "0", "time": "1572092453", "acc": "0", "ref": "0"}'
      var obj = eval("("+msg+")"); // used to transfer the unstandard json string
      // console.log(obj);
      obj.content = $text; // add $text on obj as its property.

      // create node
      var $blog = createElement(obj);
      // transfer to DOM element, and bind 'obj' property with obj
      $blog.get(0).obj = obj;

      $('.message-list').prepend($blog);

      // clear the input after send
      $('.comment').val('');

      // after send the blog, need to get the page number again
      getMsgPage();

      // delete the first blog
      if($('.info').length > 6) {
        $('.info:last-child').remove();
      }


    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })


  
});

// listen the three links by delegate
$('body').delegate('.info-up', 'click', function() {
  $(this).text(parseInt($(this).text()) + 1);
  // console.log(this); // <a class="info-up" href="javascript:;">1</a>
  // console.log($(this).parents('.info').get(0).obj)
  var obj = $(this).parents('.info').get(0).obj;
  // weibo.php?act=acc&id=12	
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=acc&id='+obj.id,
    success: function(msg) {
      console.log(msg);
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })
});

$('body').delegate('.info-down', 'click', function() {
  $(this).text(parseInt($(this).text()) + 1);
  var obj = $(this).parents('.info').get(0).obj;
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=ref&id='+obj.id,
    success: function(msg) {
      console.log(msg);
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })
});

$('body').delegate('.info-del', 'click', function() {
  $(this).parents('.info').remove();
  var obj = $(this).parents('.info').get(0).obj;
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=del&id'+obj.id,
    success: function(msg) {
      console.log(msg);
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  });


  // ensure the msglist count = 6
  getMsgList($('.current').html());
});

// listen the pagenumber click
$('body').delegate('.page>a', 'click', function() {
  // alert(1);
  $(this).addClass('current');
  $(this).siblings().removeClass('current');
  // get the page number
  getMsgList($(this).html())
})

// creat blog function
function createElement(obj) {
  return $(`
  <div class="info">
    <p class="info-text">
      ${obj.content}
    </p>
    <p class="info-operation">
      <span class="info-time">
        ${formatDate(obj.time)}
      </span>
      <span class="info-handle">
        <a class="info-up" href="javascript:;">${obj.acc}</a>
        <a class="info-down" href="javascript:;">${obj.ref}</a>
        <a class="info-del" href="javascript:;">delete</a>
      </span>
    </p>
  </div>
  `);
}

// create blog send time function
function formatDate(time) {
  var date = new Date(time * 1000);
  return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0'+date.getHours() : date.getHours() }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() }:${date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds()}`;
}


function getMsgList(num) {
  // firstly, clear the list
  $('.message-list').html('');

  // and then get list
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=get&page='+num,
    success: function(msg) {
      // console.log(msg);
      var obj = eval(`(${msg})`);
      // console.log(obj);
      $.each(obj, function(key, val) {
        // console.log(val);
        var $blog = createElement(val);
        // get the DOM element and bind 'obj' with val 
        $blog.get(0).obj = val;
        $('.message-list').append($blog);
      });
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })
}

// weibo.php?act=get_page_count	获取页数
function getMsgPage() {
  // clear page content
  $('.page').html();
  // and then get the page number
  $.ajax({
    type: 'get',
    url: 'weibo.php',
    data: 'act=get_page_count',
    success: function(msg) {
      console.log(msg);
      var obj = eval(`(${msg})`);
      console.log(obj);
      for(var i = 0; i < obj.count; i++) {
        var $a = $('<a href="javascript:;">'+(i+1)+'</a>');
        if(i === 0) {
          $a.addClass('current');
        }
        $('.page').append($a);
      }
    },
    error: function(xhr) {
      console.log(xhr.status);
    }
  })
}