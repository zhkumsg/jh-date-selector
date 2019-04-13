'use strict';

(function () {
	var self = void 0;

	function DateSelector(_ref) {
		var _this = this;

		var target = _ref.target,
		    className = _ref.className,
		    data = _ref.data,
		    max = _ref.max,
		    change = _ref.change,
		    auto = _ref.auto;

		self = this;
		this.index = 0;
		this.isshow = false;
		this.target = target;
		this.date = new Date();
		this._change = change;
		this.el = document.createElement('div');
		this.el.className = 'date-selector ' + className;
		this.max = Math.abs(Number.parseInt(max, 10) || 1);
		this.height = max * 30 + 100;
		if (this.target instanceof HTMLElement) {
			this.height = this.height > 240 ? this.height : 240;
			this.selections = Array.from({ length: this.max }, function () {
				return [];
			});
			(data || []).forEach(function (item, index) {
				if (item instanceof Array && item.length === 2) {
					var from = new Date(item[0]);
					var to = new Date(item[1]);
					_this.selections[index] = [from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate(), to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate()];
					_this.date = _this.getNextMonth(from);
				}
			});
			this.init();
			if (this.auto === true) {
				this.show();
			}
		}
	}

	DateSelector.prototype = {
		init: function init() {
			this.el.style.height = this.height + 'px';
			this.el.innerHTML = this.render();
			this.listenCalendarEvent();
			this.listenOptionsEvent();
		},
		renderTop: function renderTop(date) {
			return '\n            <div class="top">\n                <span class="goto-btn prev-year">&lt;&lt;</span>\n                <span class="goto-btn prev-month">&lt;</span>\n                <span class="goto-date">' + date.getFullYear() + '\u5E74' + (date.getMonth() + 1) + '\u6708</span>\n                <span class="goto-btn next-month">&gt;</span>\n\t\t\t\t<span class="goto-btn next-year">&gt;&gt;</span>\n            </div>';
		},
		renderWeek: function renderWeek() {
			return '<div class="week"><span>\u65E5</span><span>\u4E00</span><span>\u4E8C</span><span>\u4E09</span><span>\u56DB</span><span>\u4E94</span><span>\u516D</span></div>';
		},
		renderDays: function renderDays(date) {
			var rows = [];
			var start = this.getMonthStart(date);
			var count = this.getMonthCount(date);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var firstTime = this.selections[this.index][0] ? new Date(this.selections[this.index][0]).getTime() : Number.MAX_VALUE;
			var lastTime = this.selections[this.index][1] ? new Date(this.selections[this.index][1]).getTime() : Number.MIN_VALUE;
			for (var i = 0; i < Math.ceil((count + start) / 7); i++) {
				rows.push('<div class="day-row">');
				for (var j = 0; j < 7; j++) {
					var day = i * 7 + j - start + 1;
					var datadate = '';
					var cls = ['day-item'];
					var nonull = day > 0 && day <= count;
					if (nonull) {
						datadate = year + '-' + month + '-' + day;
						var currentTime = new Date(datadate).getTime();
						if (this.selections[this.index].includes(datadate)) {
							cls.push('highlight');
						} else if (currentTime > firstTime && currentTime < lastTime) {
							cls.push('selected');
						}
					} else {
						cls.push('null');
					}
					rows.push('<span data-date="' + datadate + '" class="' + cls.join(' ') + '">' + (nonull ? day : '') + '</span>');
				}
				rows.push('</div>');
			}
			return rows.join('');
		},
		renderCalendarItem: function renderCalendarItem(date, direction) {
			return '\n            <div class="calendar-item calendar-' + direction + '">\n                ' + this.renderTop(date, direction) + '\n                ' + this.renderWeek() + '\n                <div class="days">\n                    ' + this.renderDays(date) + '\n\t\t    \t</div>\n\t\t    </div>\n        ';
		},
		renderCalendar: function renderCalendar(date) {
			return '\n                ' + this.renderCalendarItem(this.getPrevMonth(date), 'left') + '\n                ' + this.renderCalendarItem(date, 'right') + '\n            ';
		},
		renderOptions: function renderOptions() {
			var _this2 = this;

			var list = [];
			this.selections.forEach(function (item, index) {
				if (item.length > 0) {
					var from = item[0];
					var to = item[item.length - 1];
					var disable = (_this2.selections[index + 1] || []).length > 0; // 判断添加按钮是否可点击
					list.push('\n                        <div class="date-item">\n                            <span class="text ' + (index === _this2.index ? 'current' : '') + '" \n                                data-index="' + index + '">\n                                    ' + from + '~' + to + '\n                            </span>\n                            <span class="btn add ' + (disable ? 'disable' : '') + '" \n                                style="display:' + (index === _this2.max - 1 ? 'none' : 'inline-block') + '" \n                                data-index="' + index + '">\n                                    +\n                            </span>\n                            <span class="btn del" data-index="' + index + '">-</span>\n                        </div>\n                    ');
				}
			});
			var liststr = list.length > 0 ? list.join('') : '<div class="null">\u6682\u672A\u9009\u62E9\u65F6\u95F4</div>\n            ';
			return '\n\t\t\t    <div class="dates">\n                    <div class="title">\u589E\u52A0\u5BF9\u6BD4\u65F6\u95F4\u6BB5</div>\n                    ' + liststr + '\n\t\t\t    </div>\n\t\t\t    <div class="btns">\n\t\t\t    \t<span class="btn cancle">\u53D6\u6D88</span>\n\t\t\t    \t<span class="btn sure">\u786E\u5B9A</span>\n\t\t\t    </div>\n            ';
		},
		render: function render() {
			return '\n            <div class="calendars">\n                ' + this.renderCalendar(this.date) + '\n            </div>\n            <div class="options">\n                ' + this.renderOptions() + '\n            </div>\n        ';
		},
		getPrevMonth: function getPrevMonth(date) {
			date = new Date(date);
			var year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
			var month = date.getMonth() === 0 ? 12 : date.getMonth();
			return new Date(year + '-' + month + '-1');
		},
		getNextMonth: function getNextMonth(date) {
			date = new Date(date);
			var year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
			var month = date.getMonth() === 11 ? 1 : date.getMonth() + 2;
			return new Date(year + '-' + month + '-1');
		},
		getMonthStart: function getMonthStart(date) {
			return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + 1).getDay();
		},
		getMonthCount: function getMonthCount(date) {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		},
		datedifference: function datedifference(a, b) {
			var dateSpan = void 0,
			    iDays = void 0;
			a = Date.parse(a);
			b = Date.parse(b);
			dateSpan = b - a;
			dateSpan = Math.abs(dateSpan);
			iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
			return iDays;
		},
		updateCalendarDate: function updateCalendarDate() {
			if (this.selections[this.index].length > 0) {
				this.date = new Date(this.getNextMonth(this.selections[this.index][0])); // 日历切换
			}
		},
		listenCalendarEvent: function listenCalendarEvent() {
			var _this3 = this;

			this.el.querySelector('.calendars').addEventListener('click', function (event) {
				var cls = event.target.className;
				if (cls.includes('prev-year')) {
					_this3.onPrevYearClick(event);
				} else if (cls.includes('prev-month')) {
					_this3.onPrevMonthClick();
				} else if (cls.includes('next-month')) {
					_this3.onNextMonthClick();
				} else if (cls.includes('next-year')) {
					_this3.onNextYearClick();
				} else if (cls.includes('day-item')) {
					_this3.onDayClick(event);
				}
			});
		},
		listenOptionsEvent: function listenOptionsEvent() {
			var _this4 = this;

			this.el.querySelector('.options').addEventListener('click', function (event) {
				var cls = event.target.className;
				if (cls.includes('text')) {
					_this4.onDateTextClick(event);
				} else if (cls.includes('add') && !cls.includes('disable')) {
					_this4.onAddBtnClick(event);
				} else if (cls.includes('del')) {
					_this4.onDelBtnClick(event);
				} else if (cls.includes('cancle')) {
					_this4.hide();
				} else if (cls.includes('sure')) {
					console.log('关闭弹窗并返回结果');
				}
			});
		},
		onPrevYearClick: function onPrevYearClick() {
			var year = this.date.getFullYear() - 1;
			var month = this.date.getMonth() + 1;
			this.date = new Date(year + '-' + month + '-1');
			this.init();
		},
		onPrevMonthClick: function onPrevMonthClick() {
			this.date = this.getPrevMonth(this.date);
			this.init();
		},
		onNextMonthClick: function onNextMonthClick() {
			this.date = this.getNextMonth(this.date);
			this.init();
		},
		onNextYearClick: function onNextYearClick() {
			var year = this.date.getFullYear() + 1;
			var month = this.date.getMonth() + 1;
			this.date = new Date(year + '-' + month + '-1');
			this.init();
		},
		onDayClick: function onDayClick(event) {
			if (!event.target.className.includes('null')) {
				var dstr = event.target.getAttribute('data-date');
				if (this.selections[this.index].length >= 2) {
					this.selections[this.index] = [];
				}
				this.selections[this.index].push(dstr);
				this.selections[this.index].sort(function (a, b) {
					return new Date(a).getTime() - new Date(b).getTime();
				});
				this.el.querySelector('.calendars').innerHTML = this.renderCalendar(this.date); // 重新渲染日历
				this.el.querySelector('.options').innerHTML = this.renderOptions(); // 重新渲染结果
				if (this._change instanceof Function) {
					this._change({
						dates: JSON.parse(JSON.stringify(this.selections[this.index])),
						index: this.index
					}); // 触发回调
				}
			}
		},
		onDateTextClick: function onDateTextClick(event) {
			this.index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			this.updateCalendarDate();
			this.init();
		},
		onAddBtnClick: function onAddBtnClick(event) {
			var index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			var from = new Date(this.selections[index][0]);
			var to = new Date(this.selections[index][this.selections[index].length - 1]);
			var diff = this.datedifference(from, to);
			var nto = new Date(from.setDate(from.getDate() - 1));
			var ntemp = new Date(nto);
			var nfrom = new Date(ntemp.setDate(ntemp.getDate() - diff));
			this.index = index + 1;
			this.selections[this.index] = [nfrom.getFullYear() + '-' + (nfrom.getMonth() + 1) + '-' + nfrom.getDate(), nto.getFullYear() + '-' + (nto.getMonth() + 1) + '-' + nto.getDate()];
			this.updateCalendarDate();
			this.init();
		},
		onDelBtnClick: function onDelBtnClick(event) {
			var index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			this.selections.splice(index, 1);
			this.selections.push([]);
			this.index = index === 0 ? 0 : index - 1;
			this.updateCalendarDate();
			this.init();
		},
		onMarkClick: function onMarkClick(_ref2) {
			var x = _ref2.x,
			    y = _ref2.y;

			var elClientRect = self.el.getBoundingClientRect();
			if (!(x > elClientRect.left && x < elClientRect.right && y > elClientRect.top && y < elClientRect.bottom)) {
				self.hide();
			}
		},
		removeElement: function removeElement() {
			var paras = document.getElementsByClassName('date-selector');
			for (var i = 0; i < paras.length; i++) {
				if (paras[i] !== null) paras[i].parentNode.removeChild(paras[i]);
			}
		},
		show: function show() {
			var _this5 = this;

			var _target$getBoundingCl = this.target.getBoundingClientRect(),
			    left = _target$getBoundingCl.left,
			    right = _target$getBoundingCl.right,
			    top = _target$getBoundingCl.top,
			    bottom = _target$getBoundingCl.bottom,
			    height = _target$getBoundingCl.height,
			    width = _target$getBoundingCl.width;

			this.el.style.left = left + 'px';
			this.el.style.top = top + height + 'px';
			this.removeElement();
			document.body.append(this.el); // 统一添加到body上
			setTimeout(function () {
				document.body.addEventListener('click', _this5.onMarkClick);
			});
			this.isshow = true;
		},
		hide: function hide() {
			this.removeElement();
			this.isshow = false;
			document.body.removeEventListener('click', this.onMarkClick);
		}
	};

	// 导出供外部访问
	window.DateSelector = DateSelector;
})();