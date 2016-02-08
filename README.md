# *待取名*

## 概述

提供線上投票之服務

可以選擇是否匿名、是否需要登入

## 執行

先確認是否安裝nodejs及mongodb

在本專案根目錄創建檔案config.js
並設定幾個變數

``` javascript
module.exports = {
	// 與facebook登入相關
	clientID: 'xxxxxxxxxxxxxx',
	clientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
	port: xxxx
}
```

最後
```
node app.js
```
