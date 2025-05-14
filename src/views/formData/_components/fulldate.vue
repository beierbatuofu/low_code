<template>
	<div class="date-full" ref="full">
		<div class="select">
			设置时间
			<el-radio-group v-model="radio">
				<el-radio v-for="(opt, idx) in getDateConf" :label="opt.fieldId" :key="idx">{{ opt.title["zh"] }}</el-radio>
			</el-radio-group>
		</div>
		<div class="select">
			设置标题

			<el-select v-model="titles" multiple size="small" style="width: 50%" placeholder="请选择">
				<el-option v-for="(opt, idx) in getTitleConf" :key="idx" :label="opt.title['zh']" :value="opt.fieldId"> </el-option>
			</el-select>
		</div>
		<div id="calendar"></div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync, Inject } from "vue-property-decorator";
	import fullCalendar from "@/components/rvue/custom/packages/fullCalendar/fullCalendar.js";

	@Component({})
	export default class DateFull extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Array, default: () => ({}) }) configlist!: Record<string, any>[];
		private radio = "create_time";
		private titles: string[] = [];

		private get getTitleConf() {
			return this.configlist.filter((conf: Record<string, any>) => ["radio", "input", "textarea", "number"].includes(conf.type));
		}

		private get getDateConf() {
			let sys = [
				{
					title: {
						zh: "默认",
						cn: "default",
					},
					type: "create_time",
					fieldId: "create_time",
				},
			];
			let dates: Record<string, any>[] = [];
			this.configlist.forEach((conf: Record<string, any>) => {
				if (conf.type == "datetime") {
					dates.push(conf);
				}
				// if (conf.type == "table") {
				// 	dates.push(...conf.children.filter((c: Record<string, any>) => c.type == "datetime"));
				// }
			});

			return [...sys, ...dates];
		}

		private get events() {
			let events: Record<string, any>[] = [];
			this.data.forEach((d: Record<string, any>) => {
				let time = d[this.radio] || "";
				let className = "status";
				let title: string[] = [];
				if (time) {
					if (d.process_status) {
						className = `status process-status-${d.process_status}`;
					}
					Object.keys(d).forEach((k: string) => {
						let idx = this.titles.findIndex((s: string) => s == k);
						if (idx >= 0) {
							title[idx] = d[k];
						}
					});
					console.log(time, time.split(" "));

					events.push({
						allDay: true,
						start: time,
						id: d.id,
						classNames: [className],
						title: title.join("-"),
					});
				}
			});
			return events;
		}
		private toDetail(eventInfo: Record<string, any>) {
			let { tenantId, appCode, formCode } = this.$route.params;
			let a = document.createElement("a");
			let { host, protocol } = window.location;

			a.href = `/#/${tenantId}/app/${appCode}/p/form/${formCode}/${eventInfo.event.id}`;
			a.target = "_blank";
			a.click();
		}

		protected mounted() {
			fullCalendar.render({
				events: this.events,
				eventClick: this.toDetail,
			});
		}

		private update(opts: Record<string, any>) {
			fullCalendar.reset(opts);
		}

		@Watch("data", { deep: true })
		private onChangeData() {}

		@Watch("events")
		private onChangeRadio() {
			this.update({
				events: this.events,
			});
		}
	}
</script>
<style scope lang="scss"></style>
<style lang="scss">
	.status {
		white-space: initial !important;
		.fc-event-title {
			word-break: break-all;
			align-items: top;
			text-align: justify;
			padding: 0 3px;
		}
		.fc-event-time {
			font-weight: bold;
			padding-left: 3px;
		}
	}

	.fc-daygrid-dot-event {
		align-items: flex-start;
	}
	@mixin statusStyle($m1, $b2, $z) {
		background: $m1;
		border-color: $m1;
		color: #fff;
		transition: background 0.3s;
		.fc-daygrid-event-dot {
			border: none;
		}
		&:hover {
			background: $b2 !important;
			color: $z !important;
			.fc-event-main {
				color: $z !important;
			}
		}
		.fc-v-event .fc-event-main {
			color: $z !important;
		}
	}

	.process-status {
		//1
		&-1 {
			@include statusStyle(#409eff, #ecf5ff, #2c67a3);
		}

		//9
		// &-9 {
		// 	@include statusStyle(#67c23a, #f0f9eb, #4f922d);
		// }

		//8
		&-9 {
			@include statusStyle(#f56c6c, #fef0f0, #9c3939);
		}
	}
	.select {
		padding: 10px 0;
	}
	.fc-daygrid-day-number {
		cursor: pointer;
		&:hover {
			color: $color;
		}
	}
	.myclass1 {
		background: green;
		border-color: green;
		color: #fff;
	}
	.myclass2 {
		background: orange;
		border-color: orange;
	}
	.date-full .fc .fc-button-primary {
		background: $color;
		border-color: $color;
		&:not(:disabled).fc-button-active {
			background: $color;
			border-color: $color;
		}
		&:not(:disabled):active {
			background: $color;
			border-color: $color;
		}
	}
</style>
