<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import MHeader from "@/components/m-header/m-header.vue";
	import { FormModule } from "@/store/modules/form";
	import Config from "./config.vue";
	import Fulldate from "../components/fulldate";
	import { getFormSingle, updateFormSingle } from "@/api/form";

	@Component({
		components: {
			"m-header": MHeader,
			config: Config,
			fulldate: Fulldate,
		},
	})
	export default class FulldateDesign extends Vue {
		private formName: string = "";
		private mapFieldId: Record<string, any> = {};

		private handleSave() {
			let { appCode, formCode } = this.$route.params;

			updateFormSingle(appCode, formCode, { appCode, code: formCode, structure: { ...this.data, mapFieldId: this.mapFieldId } }).then((resp: Record<string, any>) => {
				this.$message({ type: "success", message: "保存成功" });
			});
		}

		private customRight() {
			return (
				<rvue-button class="submit" on={{ click: this.handleSave }}>
					保存
				</rvue-button>
			);
		}
		private data: TFullDateData = {
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
		private timestamp = 1;

		private sourceData: Record<string, any> = {};

		private handleReturn() {
			let { appCode, formCode, tenantId } = this.$route.params;
			this.$router.push(`/${tenantId}/appd/${appCode}/p/`);
		}

		protected render() {
			let lang = window.localStorage.getItem("lang") || "zh";
			return (
				<div class="design">
					<m-header
						scopedSlots={{
							default: () => <span></span>,
							bread: () => (
								<div class="header-app-name">
									<i on={{ click: this.handleReturn }} class="el-icon-arrow-left" style="color: #ccc; font-size: 26px; cursor: pointer"></i>
									{this.formName}
								</div>
							),
							"custom-right": () => <div class="custom-right">{this.customRight()}</div>,
						}}
					></m-header>
					<div class="body">
						<div class="left">
							<div class="wrap">
								<fulldate
									on={{
										update: (d: Record<string, any>) => {
											this.data = d.opts;
											this.mapFieldId = d.data.structure?.mapFieldId || {};
											this.formName = d.data.multiLanguage[lang];
										},
									}}
									props={{ data: this.data, mapFieldId: this.mapFieldId, mode: "design" }}
								></fulldate>
							</div>
						</div>

						<config
							props={{ data: this.data, mapFieldId: this.mapFieldId }}
							on={{
								updateMapFieldId: (d: Record<string, any>) => {
									this.mapFieldId = d;
								},
								//change: (d: Record<string, any>) => (this.sourceData = d),
								moveover: () => this.timestamp++,
								updateOptions: (d: Record<string, any>) => (this.data.options = { ...d, ...this.data.options }),
							}}
						></config>
					</div>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.submit {
		width: 80px;
	}
	.el-icon-arrow-left {
		vertical-align: top;
	}
	.design {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: #eff4f7;
	}
	.body {
		display: flex;
		height: calc(100vh - 55px);
	}
	::v-deep {
		.nav-bar {
			padding-right: 0px;
		}
	}
	.left {
		flex-grow: 1;
		position: relative;
		user-select: none;
	}
	.wrap {
		overflow: auto;
		position: absolute;
		top: 5px;
		right: 5px;
		left: 5px;
		bottom: 5px;
		background: #fff;
		padding: 10px;
	}
</style>
