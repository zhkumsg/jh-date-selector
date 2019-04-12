'use strict';

(function () {
	function DateSelector(_ref) {
		var el = _ref.el,
		    date = _ref.date,
		    number = _ref.number;

		this.el = el;
		this.date = date || new Date();
		this.number = Math.abs(Number.parseInt(number, 10) || 1);
		if (this.el instanceof HTMLElement && this.date instanceof Date) {
			this.selections = Array.from({ length: this.number }, function () {
				return [];
			});
			this.el.innerHTML = this.render();
			this.listenCalendarEvent();
		}
	}

	DateSelector.prototype = {
		renderTop: function renderTop(date) {
			return '\n            <div class="top">\n                <span class="goto-btn prev-year">&lt;&lt;</span>\n                <span class="goto-btn prev-month">&lt;</span>\n                <span class="goto-date">' + date.getFullYear() + '\u5E74' + (date.getMonth() + 1) + '\u6708</span>\n                <span class="goto-btn next-month">&gt;</span>\n\t\t\t\t<span class="goto-btn next-year">&gt;&gt;</span>\n            </div>';
		},
		renderWeek: function renderWeek() {
			return '<div class="week"><span>\u65E5</span><span>\u4E00</span><span>\u4E8C</span><span>\u4E09</span><span>\u56DB</span><span>\u4E94</span><span>\u516D</span></div>';
		},
		renderDays: function renderDays(date, dstr) {
			var rows = [];
			var start = this.getMonthStart(date);
			var count = this.getMonthCount(date);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			for (var i = 0; i < Math.ceil((count + start) / 7); i++) {
				rows.push('<div class="day-row">');
				for (var j = 0; j < 7; j++) {
					var day = i * 7 + j - start + 1;
					var datadate = '';
					var cls = ['day-item'];
					var nonull = day > 0 && day <= count;
					if (nonull) {
						datadate = year + '-' + month + '-' + day;
						if (dstr === datadate) {
							cls.push('highlight');
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
		renderCalendar: function renderCalendar(date, direction) {
			return '\n            <div class="calendar-item calendar-' + direction + '">\n                ' + this.renderTop(date, direction) + '\n                ' + this.renderWeek() + '\n                <div class="days">\n                    ' + this.renderDays(date) + '\n\t\t    \t</div>\n\t\t    </div>\n        ';
		},
		render: function render() {
			return '\n            <div class="calendars">\n                ' + this.renderCalendar(this.getPrevMonth(this.date), 'left') + '\n                ' + this.renderCalendar(this.date, 'right') + '\n            </div>\n            <div class="options"></div>\n        ';
		},
		getPrevMonth: function getPrevMonth(date) {
			var year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
			var month = date.getMonth() === 0 ? 12 : date.getMonth();
			return new Date(year + '-' + month + '-1');
		},
		getNextMonth: function getNextMonth(date) {},
		getMonthStart: function getMonthStart(date) {
			return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + 1).getDay();
		},
		getMonthCount: function getMonthCount(date) {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		},
		listenCalendarEvent: function listenCalendarEvent() {
			var _this = this;

			this.el.querySelector('.calendars').addEventListener('click', function (event) {
				var cls = event.target.className;
				if (cls.includes('prev-year')) {
					console.log('切换到上一年');
				} else if (cls.includes('prev-month')) {
					console.log('切换到上一个月');
				} else if (cls.includes('next-month')) {
					console.log('切换到下一个月');
				} else if (cls.includes('next-year')) {
					console.log('切换到下一年');
				} else if (cls.includes('day-item')) {
					_this.onDayClick(event);
				}
			});
		},
		onDayClick: function onDayClick(event) {
			if (!event.target.className.includes('null')) {
				var _dstr = event.target.getAttribute('data-date');
				event.target.parentNode.parentNode.innerHTML = this.renderDays(new Date(_dstr), _dstr);
			}
			return false;
			// 从记录中判断是应该选中时间还是不选中时间
			this.el.querySelectorAll('.calendars span.day-item').forEach(function (node) {
				if (!node.className.includes('null')) {
					var nstr = node.getAttribute('data-date');
					if (dstr === nstr) {
						node.className = 'day-item first'; // 判断添加first还是last
					} else {
							// 判断后代应该选中还是怎么样
						}
				}
			});
		}
	};

	// 导出供外部访问
	window.DateSelector = DateSelector;
})();