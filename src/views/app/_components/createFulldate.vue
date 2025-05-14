<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import AppIcon from "./appIcon.vue";
	import IconSet from "@/components/iconSet/icon.vue";
	import { saveFormSingle } from "@/api/form";
	import RvueLangInput from "@/components/rvue/custom/packages/lang/RvueLangInput";

	interface TFulldateForm {
		icon: string;
		isLeaf: 1;
		multiLanguage: Record<"zh" | "en", string>;
		name: string;
		type: "D";
		color?: string;
	}

	@Component({
		components: {
			"app-icon": AppIcon,
			"icon-set": IconSet,
			"rvue-langinput": RvueLangInput,
		},
	})
	export default class CreateFulldate extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) asyncVisible!: boolean;
		private form: TFulldateForm = Object.create({});

		private editIcon(f: TFulldateForm) {
			this.form = f;
		}

		@Watch("asyncVisible", { immediate: true })
		private changeAsyncVisible() {
			this.form = { icon: "el-icon-date", isLeaf: 1, multiLanguage: { zh: "", en: "" }, name: "", type: "D" };
		}

		private handleLangChange(multiLanguage: Record<string, any>) {
			let lang = window.localStorage.getItem("lang") || "zh";
			this.form.multiLanguage = multiLanguage;
			this.form.name = multiLanguage[lang];
		}

		private handleSubmit() {
			if (!(this.form.name && this.form.name.trim())) {
				this.$message.error("请输入日历图名称");
				return;
			}

			let { appCode, tenantId } = this.$route.params;
			saveFormSingle(appCode, this.form).then((resp: Record<string, any>) => {
				let formCode = resp.data;
				// /:tenantId/appd/:appCode/:flag/fulldate/:formCode/fulldate_design

				this.$router.replace({
					path: `/${tenantId}/appd/${appCode}/p/fulldate/${formCode}/fulldate_design`,
				});
				this.asyncVisible = false;
			});
		}
		protected render() {
			return (
				<rvue-dialog
					width="580px"
					on={{
						close: (v: boolean) => (this.asyncVisible = v),
					}}
					scopedSlots={{
						title: () => (
							<div class="dialog-title">
								<div class="dialog-title-font">{this.$t("appset.createFulldate")}</div>
							</div>
						),
						footer: () => (
							<div class="dialog-footer">
								<el-button on={{ click: () => (this.asyncVisible = false) }} size="mini">
									{this.$t("linkDataDialog.cancel")}
								</el-button>
								<el-button size="mini" on={{ click: this.handleSubmit }} type="primary">
									{this.$t("linkDataDialog.confirm")}
								</el-button>
							</div>
						),
					}}
					props={{ visible: this.asyncVisible }}
				>
					<el-form ref="form" props={{ model: this.form }} label-width="120px" style="padding-right:50px">
						<el-form-item props={{ label: this.$t("appset.fulldataIcon") }}>
							<icon-set props={{ default: this.form }} on={{ editIcon: this.editIcon }}></icon-set>
						</el-form-item>

						<el-form-item class="appForm" props={{ label: this.$t("appset.fulldataName"), required: true }}>
							<rvue-langinput on={{ change: this.handleLangChange }} class="el-form-item" props={{ maxlength: 100, field: this.form.multiLanguage }}></rvue-langinput>
						</el-form-item>
					</el-form>
				</rvue-dialog>
			);
		}
	}
</script>
