import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import cnLocale from "@fullcalendar/core/locales/zh-cn";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default () => {
	let calendarEl = document.getElementById("calendar");
	let calendar = new Calendar(calendarEl, {
		headerToolbar: {
			left: "prev,next today",
			center: "title",
			right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
		},
		plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
		initialView: "dayGridMonth",
		locale: cnLocale,
		weekNumbers: true,

		dateClick: function (info) {
			calendar.changeView("timeGridDay", info.dateStr);
		},
		eventClick: function (eventInfo) {
			console.log(arguments);
		},
		events: [
			{
				// this object will be "parsed" into an Event Object
				allDay: false,
				title: "已完成", // a property!
				start: "2022-05-16 12:30:00",
				end: "2022-05-16 14:30:00",
				classNames: ["myclass1"],
			},
			{
				allDay: false,
				// this object will be "parsed" into an Event Object
				title: "超时", // a property!
				start: "2022-05-16 16:30:00", // a property!
				classNames: ["myclass2"],
			},
			{
				// this object will be "parsed" into an Event Object
				title: "已完成", // a property!
				start: "2022-05-17", // a property!
				classNames: ["myclass1"],
			},
			{
				// this object will be "parsed" into an Event Object
				title: "未完成", // a property!
				start: "2022-05-18", // a property!
			},
			{
				// this object will be "parsed" into an Event Object
				allDay: false,
				title: "未完成", // a property!
				start: "2022-05-19 12:30:00",
			},
			{
				allDay: false,
				// this object will be "parsed" into an Event Object
				title: "未完成", // a property!
				start: "2022-05-19 16:30:00", // a property!
			},
		],
		// options here
	});
	calendar.render();
};
