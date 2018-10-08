## 介绍
该工具基于 [phantomjs](http://phantomjs.org)，通过onResourceReceived方法拦截 `dialogue` 接口，请求成功后生成当前页面的截图，存入到根据当前时间生成的文件夹中，主要方法：

  * onResourceReceived    当收到页面请求的资源时，将调用此回调。回调的唯一参数是response元数据对象。
  * render                渲染生成图片
  * evaluate              操作网页dom
  * stream.readLine       按行读取文件
  * fs.write              写入log

## 使用

1.安装 [phantomjs](http://phantomjs.org/download.html) 解压后并配置环境变量

2.编辑 `data.txt`，按固定格式写入要测试的发话文

3.执行以下命令
  ```
    phantomjs test.js
  ```

## 修改测试页面路径
  编辑 `test.js`，找到变量 `url`，修改为你想测的页面路径，`api` 是拦截对话的接口路径，比如：
  ```
    // 测试页面url
    var url = "http://xx.xx.xx.xx:8080/xxxx/";
    var api = "http://xx.xx.xx.xx:8080/xxxx/dialogue";
  ```
