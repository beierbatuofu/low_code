import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import cnLocale from "@fullcalendar/core/locales/zh-cn";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

const defOptions = Symbol();

class RvueFullCalendar {
	el;
	dataClick = () => {};
	[defOptions] = {
		aspectRatio: 2,
		customButtons: {
			// next: {
			// 	text: "next",
			// 	click: (mouseEvent, htmlElement) => {
			// 		this.calendar.next();
			// 		console.log(this.calendar.getDate());
			// 	},
			// },
		},
		headerToolbar: {
			left: "prev,today,next",
			center: "title",

			right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
		},
		plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
		initialView: "dayGridMonth",
		locale: cnLocale,
		weekNumbers: true,

		dateClick: (info) => {
			this.calendar.changeView("timeGridDay", info.dateStr);
		},
		eventClick: (eventInfo) => {},
		events: [],
	};

	calendar = null;
	render(el = null) {
		this.el = el;
		console.log(this[defOptions]);
		this.calendar = new Calendar(this.el, this[defOptions]);
		this.calendar.render();
		return this;
	}
	reset(opts = {}) {
		this[defOptions] = { ...this[defOptions], ...opts };

		this.calendar.resetOptions(this[defOptions], "dayGridMonth");
	}
}

RvueFullCalendar.instance = null;

RvueFullCalendar.ins = function () {
	if (RvueFullCalendar.instance == null) {
		RvueFullCalendar.instance = new RvueFullCalendar();
	}
	return RvueFullCalendar.instance;
};

export default RvueFullCalendar.ins();
