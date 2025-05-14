class toDatetime {
	private yyyy = (date: any) => {
		return new Date(date).getFullYear();
	};

	private MM = (date: any) => String(Number(new Date(date).getMonth()) + 1).padStart(2, "0");

	private dd = (date: any) => String(new Date(date).getDate()).padStart(2, "0");

	private HH = (date: any) => String(new Date(date).getHours()).padStart(2, "0");

	private mm = (date: any) => String(new Date(date).getMinutes()).padStart(2, "0");

	private ss = (date: any) => String(new Date(date).getSeconds()).padStart(2, "0");

	private convert(sFormat: string, date: any = new Date()) {
		return sFormat.replace(/(yyyy|MM|dd|HH|mm|ss)/g, ($0: any, $1: string): any => {
			return (<any>this)[$1].call(this, date);
		});
	}

	private getDayRange(day: number = 0) {
		const daytime = 86400 * 1000;
		let datetime = new Date().getTime() + daytime * day;
		let value = this.convert("yyyy-MM-dd", datetime);
		return [`${value} 00:00:00`, `${value} 23:59:59`];
	}

	private getWeekRange(week: number = 0) {
		let day = new Date().getDay();
		let d1 = 0 - day + week;
		let weekDay = 6 + week;
		let startDay = this.getDayRange(d1 + 1)[0];
		let endDay = this.getDayRange(weekDay)[1];
		return [startDay, endDay];
	}

	private getMonthRange(m: number = 0) {
		let Y = new Date().getFullYear();
		let M = new Date().getMonth();
		let firstDay = this.convert("yyyy-MM-dd", new Date(Y, M + m, 1));
		let lastDay = this.convert("yyyy-MM-dd", new Date(Y, M + m + 1, 0));
		return [firstDay, lastDay];
	}

	private getYear(y: number = 0) {
		let Y = Number(new Date().getFullYear()) + y;
		return [`${Y}-01-01`, `${Y}-12-31`];
	}

	private getLastDay(d: number = 0) {
		let lastDay = this.getDayRange(d);
		let nowDay = this.getDayRange();
		return [lastDay[0], nowDay[1]];
	}

	private lastYear() {
		return this.getYear(-1);
	}
	private theYear() {
		return this.getYear();
	}

	private today() {
		return this.getDayRange();
	}

	private yesterday() {
		return this.getDayRange(-1);
	}

	private last7day() {
		return this.getLastDay(-7);
	}

	private last30day() {
		return this.getLastDay(-30);
	}

	private last90day() {
		return this.getLastDay(-90);
	}

	private theWeek() {
		return this.getWeekRange();
	}

	private lastWeek() {
		return this.getWeekRange(-7);
	}

	private theMonth() {
		return this.getMonthRange();
	}

	private lastMonth() {
		return this.getMonthRange(-1);
	}

	public dispath(method: string = "today") {
		try {
			return (<any>this)[method]();
		} catch (err) {
			return [];
		}
	}
}

export default new toDatetime();
