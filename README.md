# 宇宙公投

可到[宇宙公投](http://voting.csie.org)看demo

## 概述

提供線上投票之服務

可以選擇是否匿名、是否需要登入

## 執行

先確認是否安裝nodejs及mongodb

再安裝所需套件

```
npm install
```

在本專案根目錄創建檔案config.js
並設定幾個變數

``` javascript
module.exports = {
	// 與facebook登入相關
	clientID: 'xxxxxxxxxxxxxx',
	clientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',

	// 專案的根目錄，定位用
	project_root: 'xxxxxxxx'

	// 與網路位置相關
	host: 'xxx',
	port: xxx,                 // 真正跑在電腦上的port
	proxy_port: xxx,             // 外部所能接觸的port，會反向代理給上面那個port，若無反向代理，填一樣就好
}
```

最後
```
node app.js
```
