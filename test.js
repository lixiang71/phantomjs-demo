"use strict";

// 解决输出打印中文乱码
phantom.outputEncoding = "gbk";

var fs = require('fs'),
  system = require('system'),
  webPage = require('webpage'),
  page = webPage.create();


// 调用getCurTime方法，获取当前时间
var path = getCurTime()

// log
var log_name = "test.log";

// 测试页面url
var url = "http://10.84.62.99:8080/MideaDialogue/";
var api = "http://10.84.62.99:8080/MideaDialogue/Midea/dialogue";

// 打开发话文文件
var stream = fs.open('data.txt', 'r');
// 发话文存储
var data = [];
var index = 0;

// 当前追加的log时间
// fs.write(path + "/" + log_name, "\n\n\n" + path + "\n", 'a');

// 截图大小
page.viewportSize = {
  width: 1920,
  height: 1080
};

//引入jquery 让我们的操作更方便。
page.injectJs("https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js");

// 以当前时间创建文件
fs.makeDirectory(path)

while (!stream.atEnd()) {
  // 按行读文件，存到data中
  var line = stream.readLine();
  data.push(line)
}
stream.close();

// 打开网页
page.open(url, function start(status) {
  
});


/**
 * 拦截请求， 判断当前的请求是否是dialogue， 如果是， 就渲染生成图片
 *
 * @param {*} response
 */
page.onResourceReceived = function (response) {
  // 如果是变量api接口，且请求和响应数据都已完成，就执行
  if (response.url.indexOf(api) !== -1 && response.stage == "end" && response.status == "200") {
    // 延迟一秒再渲染，
    window.setTimeout(function (index) {
      // 写入log
      fs.write(path + "/" + log_name, index + "." + getQueryString(response.url, "asrText") + "\n" + response.url + "\n" + JSON.stringify(response) + "\n", 'a');

      // 截图
      page.render(path + "/" + index + "." + getQueryString(response.url, "asrText") + "" + ".png");
      console.log("生成 " + index + "." + getQueryString(response.url, "asrText") + ".png")
      
      // 输入发话文
      var text = data[index]
      page.evaluate(function (text) {
        // 页面输入框节点，赋值
        $("#J_Field").val(text);
        // $("#send").click();
      }, text);

      // 模拟页面回车按钮，发送请求
      page.sendEvent('keypress', page.event.key.Enter);

    }, 1000, index);

    // 切换下一句发话文
    index++;
  }
};


/**
 * 获取 url 中的参数并解码
 *
 * @param {*} url
 * @param {*} name
 * @returns 参数值
 */
function getQueryString(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = url.match(reg);
  if (r != null) {
    return decodeURIComponent(unescape(r[2]));
  }
  return null;
}


/**
 * 获得当前时间， 用于生成存放截图的文件名
 *
 * @returns 当前时间
 */
function getCurTime() {
  var d = new Date();

  var weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  //获取年份
  var year = d.getFullYear();

  //获取月份，返回值是0-11，因此需要加1
  var mouth = d.getMonth() + 1;
  
  //获取日期
  var day = d.getDate();
  
  //获取小时，三元表达式，判断是否小于10，小于10就在前面加0（字符串拼接），例如：08
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  
  //获取分钟
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

  //获取秒数
  var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  
  //获取星期数，返回0-6
  var weekIndex = d.getDay();
  
  //根据获取的星期数，到之前定义的数组去取值
  var week = weeks[weekIndex];

  var curTime = year + '-' + mouth + '-' + day + '~' + hour + '·' + minutes + '·' + second;
  return curTime;
}