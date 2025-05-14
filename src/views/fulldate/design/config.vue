<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import Tool from "./_components/tool";
	import Dataset from "./_components/dataset";
	import SelectfieldIds from "./_components/selectfieldIds";
	import StatusStyle from "./_components/statusstyle";

	@Component({
		components: {
			tool: Tool,
			dataset: Dataset,
			"select-fieldids": SelectfieldIds,
			"status-style": StatusStyle,
		},
	})
	export default class Right extends Vue {
		@Prop({ type: Object, default: () => ({}) }) data!: TFullDateData;

		private sourceData: Record<string, any> = {};
		private get datetimeConfs() {
			try {
				let sysList =
					this.sourceData.sourceType == "dataset"
						? []
						: this.sourceData.data.type == "F"
						? [{ fieldId: "create_time", title: { zh: "提交时间", en: "create_time" } }]
						: [
								{ fieldId: "create_time", title: { zh: "提交时间", en: "create_time" } },
								{ fieldId: "update_time", title: { zh: "更新时间", en: "update_time" } },
						  ];

				let list = [...this.sourceData.data.configList.filter((conf: Record<string, any>) => ["datetime", "create_time", "update_time"].includes(conf.type)), ...sysList];
				if (this.sourceData.sourceType == "dataset") {
					return list.map((item: Record<string, any>) => ({
						...item,
						fieldId: item.fieldIdAsName,
					}));
				}
				return list;
			} catch (err) {
				return [];
			}
		}

		private get titleConfs() {
			try {
				let list = this.sourceData.data.configList.filter((conf: Record<string, any>) => !["tab", "table", "separator"].includes(conf.type));
				if (this.sourceData.sourceType == "dataset") {
					return list.map((item: Record<string, any>) => ({
						...item,
						fieldId: item.fieldIdAsName,
					}));
				}
				return list;
			} catch (err) {
				return [];
			}
		}

		private get statusConfs() {
			try {
				return this.sourceData.data.configList.filter((conf: Record<string, any>) => ["select", "radio"].includes(conf.type));
			} catch (err) {
				return [];
			}
		}

		private get styleConf() {
			let [code] = this.statusFieldId;
			return this.statusConfs.find((conf: Record<string, any>) => conf.fieldId == code);
		}

		private headerToolbar: THeaderToolbar<string> = Object.create({});

		private get statusFieldId() {
			return this.data.status.codes;
		}

		private set statusFieldId(a: string[]) {
			this.data.status.codes = a;
		}

		private get datetimeFiledId() {
			return this.data.dimensions;
		}
		private set datetimeFiledId(a: string[]) {
			this.data.dimensions = a;
		}

		private get titleFieldIds() {
			return this.data.indicators;
		}
		private set titleFieldIds(a: string[]) {
			this.data.indicators = a;
		}

		private isMove = false;
		private MIN_WIDTH = 300;
		private width = this.MIN_WIDTH;
		private isLoading = false;

		protected mounted() {
			document.body.addEventListener("mousemove", (e: Event & { pageX: number }) => {
				if (this.isMove) {
					let _w = window.innerWidth - e.pageX;
					this.width = _w;
					if (_w < this.MIN_WIDTH - 2) {
						this.isMove = false;
						this.width = this.MIN_WIDTH;
					}
				}
			});
		}

		private handleStatusChange(code: string) {
			this.statusFieldId = [code];
			this.data.status.styles = {};
			this.setMapFieldId();
		}

		private setMapFieldId() {
			let fieldIdList = [...this.data.dimensions, ...this.data.indicators, ...(this.data.status.codes || [])];
			let mapFieldId: Record<string, any> = {};
			console.log(this.sourceData.data.configList, fieldIdList);
			this.sourceData.data.configList.forEach((conf: Record<string, any>) => {
				let id = this.data.sourceType == "form" ? conf.fieldId : conf.fieldIdAsName;
				if (!fieldIdList.includes(id)) return;

				mapFieldId[id] = {
					fieldIdAsName: id,
					type: conf.type,
				};
			});

			this.$emit("updateMapFieldId", mapFieldId);
		}

		@Watch("headerToolbar", { deep: true })
		private changeTools() {
			this.$emit("updateOptions", { headerToolbar: this.headerToolbar });
		}

		@Watch("isMove")
		private changeIsMove() {
			!this.isMove && this.$emit("moveover");
		}

		protected created() {
			this.headerToolbar = this.data.options.headerToolbar;
		}

		protected render() {
			return (
				<div class="right" style={{ width: this.width + "px" }}>
					<div
						class="move"
						on={{
							mousedown: () => (this.isMove = true),
							mouseup: () => (this.isMove = false),
						}}
					></div>
					<div class="group">
						<h4 class="title">工具栏</h4>
						<div class="collapse-item">
							<tool props={{ opts: this.headerToolbar }}></tool>
						</div>
					</div>
					<div class="group">
						<h4 class="title">数据源</h4>
						<dataset
							props={{ data: this.data }}
							on={{
								change: (data: Record<string, any>) => {
									this.sourceData = data;

									this.$emit("change", data);
								},
								reset: (data: Record<string, any>) => {
									this.$emit("reset", data);
									this.$emit("updateMapFieldId", {});
								},
								loading: () => (this.isLoading = true),
							}}
						></dataset>
					</div>

					<div class="group">
						<h4 class="title">日历时间字段</h4>
						<div class="collapse-item">
							<select-fieldids
								props={{ options: this.datetimeConfs, value: this.datetimeFiledId[0], load: this.isLoading }}
								on={{
									change: (v: string) => (this.datetimeFiledId = [v]),
								}}
							></select-fieldids>
						</div>
					</div>
					<div class="group">
						<h4 class="title">日历文本字段</h4>
						<div class="collapse-item">
							<select-fieldids
								props={{ options: this.titleConfs, value: this.titleFieldIds, multiple: true, load: this.isLoading }}
								on={{
									change: (arr: string[]) => {
										this.titleFieldIds = arr;
										this.setMapFieldId();
									},
								}}
							></select-fieldids>
						</div>
					</div>
					{this.sourceData.sourceType == "dataset" ? (
						<div></div>
					) : (
						<div class="group">
							<h4 class="title">日历状态字段</h4>
							<div class="collapse-item">
								<select-fieldids
									props={{ options: this.statusConfs, value: this.statusFieldId[0], load: this.isLoading }}
									on={{
										change: this.handleStatusChange,
									}}
								></select-fieldids>
								<status-style props={{ conf: this.styleConf, data: this.data }}></status-style>
							</div>
						</div>
					)}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.move {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 2px;
		background: #fff;
		transition: background 0.3s;
		cursor: move;
		&:hover {
			background: #a8bdff;
		}
	}
	.group {
		margin-bottom: 28px;
	}
	.right {
		padding: 15px 0px;
		background: #fff;
		position: relative;
		user-select: none;
		overflow: auto;
	}
	.collapse {
		width: 100%;
	}
	.title {
		font-size: 14px;
		padding-left: 10px;
		color: $color;
		margin-bottom: 12px;
		line-height: 1;
		font-weight: bold;
		&:before {
			content: "";
			display: inline-block;
			height: 14px;
			width: 3px;
			background: #ffca6b;
			margin-right: 3px;
			vertical-align: top;
		}
	}
	.collapse-item {
		padding: 0 10px;
	}
</style>
