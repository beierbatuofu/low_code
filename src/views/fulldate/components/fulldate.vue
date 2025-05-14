<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import RvueFulldate from "@/components/rvue/custom/packages/fullCalendar/rvueFulldate";
	import { querySourceData, getFormSingle } from "@/api/form";

	let timeout = null;

	@Component({
		components: {
			"rvue-fulldate": RvueFulldate,
		},
	})
	export default class Fulldate extends Vue {
		@Prop({ type: Object, default: () => ({}) }) data!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) mapFieldId!: Record<string, any>;
		@Prop({ type: String, default: "preview" }) mode!: "design" | "preview";

		private options: TFullDateOpts = Object.create({});
		private timeout: number | null = null;
		private events: TFullDataEvent[] = [];
		private opts: TFullDateData = {
			options: {
				headerToolbar: {
					left: "prev,today,next",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
				},
			},
			sourceType: "",
			sourceCode: "",
			dimensions: [],
			indicators: [],
			matchRules: [],
			status: {
				codes: [],
				styles: {},
			},
		};
		private nowYear = new Date().getFullYear();

		protected created() {
			let { appCode, formCode } = this.$route.params;
			let lang = window.localStorage.getItem("lang") || "zh";

			getFormSingle(appCode, formCode).then((resp: Record<string, any>) => {
				resp.data.structure && (this.opts = resp.data.structure);

				if (resp.data.type != "D") {
					this.$router.push("/not_permission");
				}

				this.$emit("update", {
					opts: this.opts,
					data: resp.data,
				});
				this.options = {
					...this.opts.options,
				};
				this.mode == "preview" && this.queryData(this.opts);
			});
		}

		@Watch("data", { deep: true })
		private changeData() {
			if (this.timeout) clearTimeout(this.timeout);

			if (!this.timeout) {
				this.queryData(this.data);
			}
			this.timeout = window.setTimeout(() => {
				this.timeout = null;
			});
		}

		private queryData(data: Record<string, any>) {
			if (!data.sourceCode) return;
			let { appCode, formCode, tenantId } = this.$route.params;
			this.events = [];
			let { status, options, mapFieldId, ...params } = data;
			let mapId = Object.keys(this.mapFieldId).length == 0 ? mapFieldId : this.mapFieldId;

			let { dimensions, indicators } = params;
			if (!params.sourceCode || !dimensions.length || !indicators.length) return;

			let events: TFullDataEvent[] = [];

			let oDimensions = dimensions.map((k: string) => {
				if (mapId && mapId[k]) return mapId[k];
				return { fieldIdAsName: k };
			});
			let oIndicators = indicators.map((k: string) => {
				if (mapId && mapId[k]) return mapId[k];
				return { fieldIdAsName: k };
			});

			data.sourceType == "form" &&
				(oIndicators = oIndicators.concat(
					data.status.codes.map((k: string) => {
						if (mapId) return mapId[k];
						return { fieldIdAsName: k };
					})
				));

			querySourceData(appCode, formCode, {
				...params,
				appCode,
				dimensions: oDimensions,
				indicators: oIndicators,
				timeRange: {
					method: "year",
					value: this.nowYear,
				},
			}).then((resp: Record<string, any>) => {
				if (!resp.data || resp.data.length == 0) return;

				let ids: string[] = [];

				indicators.forEach((key: string) => {
					if (mapId.hasOwnProperty(key)) {
						let { fieldIdAsName } = mapId[key];
						ids.push(fieldIdAsName);
					}
				});

				resp.data.reduce((list: TFullDataEvent[], item: Record<string, any>) => {
					let dateFieldId: string | undefined;

					if ((dateFieldId = Object.keys(item).find((fid: string) => dimensions.includes(fid)))) {
						list.push({
							type: params.sourceType,
							allDay: item[dateFieldId].indexOf(":") == -1,
							start: item[dateFieldId],
							end: item[dateFieldId],
							title: this.toEventTitle(ids, item),
							classNames: this.setStatusClassNames(status, item),
							route: item.id ? `/#/${tenantId}/app/${appCode}/p/form/${params.sourceCode}/${item.id}` : "",
						});
						return list;
					}
				}, events);

				this.events = events;
			});
		}

		private setStatusClassNames(stat: Record<string, any>, item: Record<string, any>) {
			let code = stat.codes[0];
			let classNames: string[] = [];
			if (!code) return classNames;
			let val = item[code];
			let styles = stat.styles;
			for (let l in styles) {
				if (val && val.indexOf(l) != -1) {
					classNames.push(`fulldata-${styles[l]}`);
				}
			}

			return classNames;
		}

		private toEventTitle(ids: string[], form: Record<string, any>) {
			let arr: string[] = [];

			ids.forEach((key: string) => {
				let val = "";

				try {
					let obj = JSON.parse(form[key]);
					if (obj.hasOwnProperty("city")) {
						val = obj.province + obj.city + obj.district + obj.detail;
					} else if (Array.isArray(obj)) {
						obj[0].hasOwnProperty("name") ? obj.forEach((it: Record<string, any>) => (val += it.name)) : (val = obj.join(""));
					} else {
						val = obj;
					}
				} catch (err) {
					val = form[key];
				}

				val && arr.push(val);
			});

			return arr.join("-");
		}

		private turning(date: Date) {
			let month = date.getMonth();
			let newYear = date.getFullYear();
			if (newYear != this.nowYear) {
				this.nowYear = newYear;
				this.queryData(this.opts);
			}
		}

		protected render() {
			let vm = this;
			return (
				<div>
					<rvue-fulldate
						props={{
							options: this.options,
							events: this.events,
							dateClick: (info: Record<string, any>, calendar: Record<string, any>) => {
								calendar.changeView("timeGridDay", info.dateStr);
							},
							eventClick: (eventInfo: Record<string, any>, fullCalendar: Record<string, any>) => {
								let { route } = eventInfo.event.extendedProps;
								if (!route) return;
								let a = document.createElement("a");
								a.href = route;
								a.target = "_blank";
								a.click();
							},
							nextClick: (fullCalendar: Record<string, any>) => {
								fullCalendar.next();
								this.turning(fullCalendar.getDate());
							},
							prevClick: (fullCalendar: Record<string, any>) => {
								fullCalendar.prev();
								this.turning(fullCalendar.getDate());
							},
						}}
					></rvue-fulldate>
				</div>
			);
		}
	}
</script>

<style lang="scss">
	.fulldata {
		&-blue {
			background: #409eff;
			border-color: #409eff;
			color: #fff;
		}
		&-green {
			background: #67c23a;
			border-color: #67c23a;
			color: #fff;
		}
		&-orange {
			background: #e6a23c;
			border-color: #e6a23c;
			color: #fff;
		}
		&-red {
			background: #f56c6c;
			border-color: #f56c6c;
			color: #fff;
		}
		&-gray {
			background: #909399;
			border-color: #909399;
			color: #fff;
		}
	}
	.fc-button-primary {
		background: $color !important;
		border-color: $color !important;
		&:not(:disabled).fc-button-active {
			background: $color;
			border-color: $color;
		}
		&:not(:disabled):active {
			background: $color;
			border-color: $color;
		}
		&:focus {
			box-shadow: none !important;
		}
	}
	.fc-button-active,
	.fc-button-active:focus {
		box-shadow: none !important;
	}
</style>
