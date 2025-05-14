<script lang="tsx">
	import { Component, Provide, Vue, Watch, PropSync } from "vue-property-decorator";
	import { t } from "../../../ui/lang";
	type TFormat = "year" | "month" | "week" | "date";

	@Component
	export default class RvueClock extends Vue {
		@PropSync("params", { type: Object, default: () => ({ type: "year", month: [1], weekDay: [1], date: [1], time: "00:00" }) }) syncParams!: {
			type: TFormat;
			month: number[];
			weekDay: number[];
			date: number[];
			time: string;
		};

		private time: string = "00:00";
		private timekey = 1;

		private getDays(m: number) {
			let year = new Date().getFullYear();
			return new Array(new Date(year, 7, 0).getDate()).fill("placehoder");
		}

		private update() {}

		private monthComp() {
			return (
				<div class="group">
					<el-select
						class="select"
						props={{ value: this.syncParams.month, multiple: true }}
						placeholder="请选择月"
						on={{
							change: (arr: number[]) => {
								this.syncParams.month = arr;
							},
						}}
					>
						{new Array(12).fill("placehoder").map((m: string, idx: number) => {
							return (
								<el-option
									props={{
										value: idx + 1,
										label: Number(idx + 1) + t("clock.m"),
									}}
								></el-option>
							);
						})}
					</el-select>
				</div>
			);
		}

		private dateComp() {
			return (
				<div class="group">
					<el-select
						on={{
							change: (arr: number[]) => {
								this.syncParams.date = arr;
							},
						}}
						class="select"
						props={{ value: this.syncParams.date, multiple: true }}
						placeholder="请选择日"
					>
						{new Array(31).fill("placehoder").map((val: string, idx: number) => {
							return (
								<el-option
									props={{
										value: idx + 1,
										label: Number(idx + 1) + t("clock.d"),
									}}
								></el-option>
							);
						})}
					</el-select>
				</div>
			);
		}

		private timeComp() {
			return (
				<div class="group">
					<el-time-select
						placeholder="请选时间"
						on={{
							input: (v: string) => {
								this.syncParams.time = v;
								this.timekey++;
							},
						}}
						style={{ width: "100px" }}
						props={{
							key: this.timekey,
							value: this.syncParams.time,
							"picker-options": { step: "00:30", start: "00:00", end: "23:30" },
						}}
					></el-time-select>
				</div>
			);
		}

		private dayComp() {
			return (
				<div class="group">
					<el-select
						class="select"
						props={{ value: this.syncParams.weekDay, multiple: true }}
						placeholder="请选择"
						on={{
							change: (arr: number[]) => {
								this.syncParams.weekDay = arr;
							},
						}}
					>
						{new Array(7).fill("placehoder").map((m: string, d: number) => {
							return (
								<el-option
									props={{
										value: d + 1,
										label: t("clock.day" + Number(d + 1)),
									}}
								></el-option>
							);
						})}
					</el-select>
				</div>
			);
		}

		protected render() {
			const options: Record<"value" | "label", TFormat>[] = [
				{ value: "year", label: "year" },
				{ value: "month", label: "month" },
				{ value: "week", label: "week" },
				{ value: "date", label: "date" },
			];

			return (
				<div class="wrap">
					<div class="group">
						<el-select
							style={{ width: "100px" }}
							props={{ value: this.syncParams.type }}
							on={{
								change: (v: TFormat) => {
									this.syncParams.type = v;
									this.syncParams.month = [1];
									this.syncParams.weekDay = [1];
									this.syncParams.date = [1];
								},
							}}
						>
							{options.map((opts: Record<"label" | "value", TFormat>) => {
								return (
									<el-option
										props={{
											value: opts.value,
											label: t(`clock.${opts.label}`),
										}}
									></el-option>
								);
							})}
						</el-select>
					</div>

					{this.syncParams.type == "year" && this.monthComp()}
					{["year", "month"].includes(this.syncParams.type) && this.dateComp()}
					{this.syncParams.type == "week" && this.dayComp()}
					{this.timeComp()}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.group {
		height: 40px;
	}
	.select {
	}
	::v-deep {
		.el-select .el-select__tags > span {
			display: flex !important;

			overflow: hidden;
		}
		.el-tag.el-tag--info {
			display: block;
		}
	}
</style>
