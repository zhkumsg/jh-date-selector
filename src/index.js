(() => {
	function DateSelector({ el, data, max, change }) {
		this.el = el;
		this.index = 0;
		this.date = new Date();
		this._change = change;
		this.max = Math.abs(Number.parseInt(max, 10) || 1);
		this.height = max * 30 + 100;
		if (this.el instanceof HTMLElement) {
			this.height = this.height > 240 ? this.height : 240;
			this.selections = Array.from({ length: this.max }, () => []);
			(data || []).forEach((item, index) => {
				if (item instanceof Array && item.length === 2) {
					const from = new Date(item[0]);
					const to = new Date(item[1]);
					this.selections[index] = [
						`${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}`,
						`${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`,
					];
					this.date = this.getNextMonth(from);
				}
			});
			this.init();
		}
	}

	DateSelector.prototype = {
		init() {
			this.el.style.height = `${this.height}px`;
			this.el.innerHTML = this.render();
			this.listenCalendarEvent();
			this.listOptionsEvent();
		},
		renderTop(date) {
			return `
            <div class="top">
                <span class="goto-btn prev-year">&lt;&lt;</span>
                <span class="goto-btn prev-month">&lt;</span>
                <span class="goto-date">${date.getFullYear()}年${date.getMonth() + 1}月</span>
                <span class="goto-btn next-month">&gt;</span>
				<span class="goto-btn next-year">&gt;&gt;</span>
            </div>`;
		},
		renderWeek() {
			return `<div class="week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>`;
		},
		renderDays(date) {
			let rows = [];
			let start = this.getMonthStart(date);
			let count = this.getMonthCount(date);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			const firstTime = this.selections[this.index][0]
				? new Date(this.selections[this.index][0]).getTime()
				: Number.MAX_VALUE;
			const lastTime = this.selections[this.index][1]
				? new Date(this.selections[this.index][1]).getTime()
				: Number.MIN_VALUE;
			for (let i = 0; i < Math.ceil((count + start) / 7); i++) {
				rows.push('<div class="day-row">');
				for (let j = 0; j < 7; j++) {
					const day = i * 7 + j - start + 1;
					let datadate = '';
					let cls = ['day-item'];
					const nonull = day > 0 && day <= count;
					if (nonull) {
						datadate = year + '-' + month + '-' + day;
						const currentTime = new Date(datadate).getTime();
						if (this.selections[this.index].includes(datadate)) {
							cls.push('highlight');
						} else if (currentTime > firstTime && currentTime < lastTime) {
							cls.push('selected');
						}
					} else {
						cls.push('null');
					}
					rows.push(`<span data-date="${datadate}" class="${cls.join(' ')}">${nonull ? day : ''}</span>`);
				}
				rows.push('</div>');
			}
			return rows.join('');
		},
		renderCalendarItem(date, direction) {
			return `
            <div class="calendar-item calendar-${direction}">
                ${this.renderTop(date, direction)}
                ${this.renderWeek()}
                <div class="days">
                    ${this.renderDays(date)}
		    	</div>
		    </div>
        `;
		},
		renderCalendar(date) {
			return `
                ${this.renderCalendarItem(this.getPrevMonth(date), 'left')}
                ${this.renderCalendarItem(date, 'right')}
            `;
		},
		renderOptions() {
			const list = [];
			this.selections.forEach((item, index) => {
				if (item.length > 0) {
					const from = item[0];
					const to = item[item.length - 1];
					const disable = (this.selections[index + 1] || []).length > 0; // 判断添加按钮是否可点击
					list.push(`
                        <div class="date-item">
                            <span class="text ${index === this.index ? 'current' : ''}" 
                                data-index="${index}">
                                    ${from}~${to}
                            </span>
                            <span class="btn add ${disable ? 'disable' : ''}" 
                                style="display:${index === this.max - 1 ? 'none' : 'inline-block'}" 
                                data-index="${index}">
                                    +
                            </span>
                            <span class="btn del" data-index="${index}">-</span>
                        </div>
                    `);
				}
			});
			const liststr =
				list.length > 0
					? list.join('')
					: `<div class="null">暂未选择时间</div>
            `;
			return `
			    <div class="dates">
                    <div class="title">增加对比时间段</div>
                    ${liststr}
			    </div>
			    <div class="btns">
			    	<span class="btn cancle">取消</span>
			    	<span class="btn sure">确定</span>
			    </div>
            `;
		},
		render() {
			return `
            <div class="calendars">
                ${this.renderCalendar(this.date)}
            </div>
            <div class="options">
                ${this.renderOptions()}
            </div>
        `;
		},
		getPrevMonth(date) {
			date = new Date(date);
			let year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
			let month = date.getMonth() === 0 ? 12 : date.getMonth();
			return new Date(`${year}-${month}-1`);
		},
		getNextMonth(date) {
			date = new Date(date);
			let year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
			let month = date.getMonth() === 11 ? 1 : date.getMonth() + 2;
			return new Date(`${year}-${month}-1`);
		},
		getMonthStart(date) {
			return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + 1).getDay();
		},
		getMonthCount(date) {
			return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		},
		datedifference(a, b) {
			let dateSpan, iDays;
			a = Date.parse(a);
			b = Date.parse(b);
			dateSpan = b - a;
			dateSpan = Math.abs(dateSpan);
			iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
			return iDays;
		},
		updateCalendarDate() {
			if (this.selections[this.index].length > 0) {
				this.date = new Date(this.getNextMonth(this.selections[this.index][0])); // 日历切换
			}
		},
		listenCalendarEvent() {
			this.el.querySelector('.calendars').addEventListener('click', event => {
				const cls = event.target.className;
				if (cls.includes('prev-year')) {
					this.onPrevYearClick(event);
				} else if (cls.includes('prev-month')) {
					this.onPrevMonthClick();
				} else if (cls.includes('next-month')) {
					this.onNextMonthClick();
				} else if (cls.includes('next-year')) {
					this.onNextYearClick();
				} else if (cls.includes('day-item')) {
					this.onDayClick(event);
				}
			});
		},
		listOptionsEvent() {
			this.el.querySelector('.options').addEventListener('click', event => {
				const cls = event.target.className;
				if (cls.includes('text')) {
					this.onDateTextClick(event);
				} else if (cls.includes('add') && !cls.includes('disable')) {
					this.onAddBtnClick(event);
				} else if (cls.includes('del')) {
					this.onDelBtnClick(event);
				} else if (cls.includes('cancle')) {
					console.log('关闭弹窗');
				} else if (cls.includes('sure')) {
					console.log('关闭弹窗并返回结果');
				}
			});
		},
		onPrevYearClick() {
			const year = this.date.getFullYear() - 1;
			const month = this.date.getMonth() + 1;
			this.date = new Date(`${year}-${month}-1`);
			this.init();
		},
		onPrevMonthClick() {
			this.date = this.getPrevMonth(this.date);
			this.init();
		},
		onNextMonthClick() {
			this.date = this.getNextMonth(this.date);
			this.init();
		},
		onNextYearClick() {
			const year = this.date.getFullYear() + 1;
			const month = this.date.getMonth() + 1;
			this.date = new Date(`${year}-${month}-1`);
			this.init();
		},
		onDayClick(event) {
			if (!event.target.className.includes('null')) {
				const dstr = event.target.getAttribute('data-date');
				if (this.selections[this.index].length >= 2) {
					this.selections[this.index] = [];
				}
				this.selections[this.index].push(dstr);
				this.selections[this.index].sort((a, b) => {
					return new Date(a).getTime() - new Date(b).getTime();
				});
				this.el.querySelector('.calendars').innerHTML = this.renderCalendar(this.date); // 重新渲染日历
				this.el.querySelector('.options').innerHTML = this.renderOptions(); // 重新渲染结果
				if (this._change instanceof Function) {
					this._change({
						dates: JSON.parse(JSON.stringify(this.selections[this.index])),
						index: this.index,
					}); // 触发回调
				}
			}
		},
		onDateTextClick(event) {
			this.index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			this.updateCalendarDate();
			this.init();
		},
		onAddBtnClick(event) {
			const index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			const from = new Date(this.selections[index][0]);
			const to = new Date(this.selections[index][this.selections[index].length - 1]);
			const diff = this.datedifference(from, to);
			const nto = new Date(from.setDate(from.getDate() - 1));
			const ntemp = new Date(nto);
			const nfrom = new Date(ntemp.setDate(ntemp.getDate() - diff));
			this.index = index + 1;
			this.selections[this.index] = [
				`${nfrom.getFullYear()}-${nfrom.getMonth() + 1}-${nfrom.getDate()}`,
				`${nto.getFullYear()}-${nto.getMonth() + 1}-${nto.getDate()}`,
			];
			this.updateCalendarDate();
			this.init();
		},
		onDelBtnClick(event) {
			const index = Number.parseInt(event.target.getAttribute('data-index'), 10);
			this.selections.splice(index, 1);
			this.selections.push([]);
			this.index = index === 0 ? 0 : index - 1;
			this.updateCalendarDate();
			this.init();
		},
	};

	// 导出供外部访问
	window.DateSelector = DateSelector;
})();
