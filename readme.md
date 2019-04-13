# date-selector

> 日期选择组件

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
