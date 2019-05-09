# jh-date-selector

> Date selection component

![](https://upload-images.jianshu.io/upload_images/13908708-096dcb403f3b7027.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[live demo](http://zhkumsg.gitee.io/jh-date-selector/)

---

## 快速上手

```html
<div id="box">我是一个输入框</div>
```

#### 浏览器环境

1. 引入 css 文件

```html
<link rel="stylesheet" href="http://zhkumsg.gitee.io/date-selector/lib/index.css" />
```

2. 引入 js 文件

```html
<script src="http://zhkumsg.gitee.io/date-selector/lib/index.min.js"></script>
```

#### webpack环境

1. 实例化插件

```js
var selector = new DateSelector({
	target: document.querySelector('#box'),
	data: [],
	max: 5,
	auto: true,
});
```



---

## 属性介绍

|     属性     |   类型   | 必填 |                      作用                      |
| :----------: | :------: | :--: | :--------------------------------------------: |
|    target    |   dom    | 必填 |            目标元素，将在这下面显示            |
|     data     |  Array   | 选填 |         为二元数组，内层数组为选中结果         |
|     max      |  Number  | 选填 |           默认为 1，表示最多选中一组           |
|     auto     |   Bool   | 选填 |           默认为 false,代表自动显示            |
|  className   |  String  | 选填 |                   自定义类名                   |
|    change    | Function | 选填 |                   修改后触发                   |
|   confirm    | Function | 选填 |                   确认后触发                   |
| disabledDate | Function | 选填 | 设置禁用状态，参数为当前日期，要求返回 Boolean |

`selector.show()` 显示弹窗

`selector.hide()` 关闭弹窗

`selector.toggle()` 显示/隐藏弹窗

---

### 开发流程

```bash
$ npm install
$ npm run dev
$ npm run build
```
