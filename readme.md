# date-selector

> 日期选择组件

![](https://upload-images.jianshu.io/upload_images/13908708-096dcb403f3b7027.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 如何使用
1. 引入资源

2. 实例化组件
3. 接收结果



### 开发

```bash
$ npm install
$ npm run dev
$ npm run build
```

### 使用

```html
<link rel="stylesheet" href="date-selector/lib/index.css" />

<input id="name" type="text" />

<script src="date-selector/lib/index.js"></script>
```

```js
var selector = new DateSelector({
	target: document.querySelector('#name'),
	className: 'test',
	data: [['2019-3-11', '2019-04-20']],
	max: 5,
	change({ dates, index }) {},
	auto: false,
});

document.body.querySelector('#name').addEventListener('click', () => {
	if (selector.isshow) {
		selector.hide();
	} else {
		selector.show();
	}
});
```
