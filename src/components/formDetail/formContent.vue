<template>
	<div class="form-content">
		<div class="form-wrap">
			<rvue-form-box :key="formKey" :option="option" ref="rvueForm" :formType="formType" :form="form"></rvue-form-box>
		</div>
		<div class="btns-wrap">
			<template v-for="key in btns">
				<component
					:key="key"
					:ref="key"
					:button-type="key"
					@return="handleReturn"
					@error="handleError"
					@close="handleClose"
					@edit="handleEdit"
					:is="`dbtn-${key}`"
					:formRef="$refs['rvueForm']"
					:form="form"
					:btns.sync="btns"
					:rvueForm="rvueForm"
				></component>
			</template>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Inject } from "vue-property-decorator";
	import FormDetailCore from "./_core/FormDetailCore";
	import RuleConfig from "@/components/rvue/custom/packages/form/RuleConfig.ts";
	import "./_components/install.ts";

	@Component
	export default class FormContent extends Vue {
		@Prop({ type: Object, default: () => ({}) }) formConf!: TJson;
		@Prop({ type: String, default: "normal" }) mode!: string;
		@Inject() readonly conf!: TJson;
		private btns: string[] = [];
		private form: TJson = {};
		private formKey = 1;
		private addForm = {};
		private rvueForm: any = {};
		private jscode: string = "";
		private formType = "normal";
		private get option() {
			return this.formConf;
		}

		private handleReturn() {
			this.formType = "normal";
			this.btns = FormDetailCore.ins().btnMap[this.conf.formType].oUiBtns;
			(<any>this.$refs["rvueForm"]).setAllReadonly();
			this.load();
		}

		private handleError(err: TJson) {
			if (err.code == "FM-FORM_ADD_NO_SAME_VAL") {
				let rules = new RuleConfig();
				rules.notSame(err, this);
			}
		}

		private handleClose() {
			this.$emit("close");
		}

		private handleEdit() {
			(<any>this.$refs["rvueForm"]).resetAllReadonly();
		}

		private load() {
			let { doCreator, formData, jscode, permission } = this.formConf;

			this.form = this.$utils.deepClone(formData);

			this.jscode = jscode;
			this.rvueForm = this.$refs.rvueForm;

			this.btns = FormDetailCore.ins().btnMap[this.conf.formType].getBtns(permission, doCreator).uiBtns;

			this.$nextTick(() => {
				(<Record<string, any>>this.$refs["rvueForm"]).resetAllReadonly();
				if (this.conf.formType == "C") {
					(<Record<string, any>>this.$refs["rvueForm"]).setAllReadonly();
				}
				// TODO doCreator
				if (this.conf.formType == "F") {
					if (!permission || permission.length == 0) {
						(<Record<string, any>>this.$refs["rvueForm"]).setAllReadonly();
					}
				}
				if (this.mode == "manage") {
					this.btns = ["edit", "del"];
					(<Record<string, any>>this.$refs["rvueForm"]).setAllReadonly();
				}
			});
		}

		@Watch("formConf", { immediate: true })
		onChangeFormConf() {
			this.load();
		}
	}
</script>
<style lang="scss" scoped>
	.form-content {
		@include PositionRelative(null, 100%);
		overflow: hidden;
		margin-top: 60px;
		padding: 10px;
		box-sizing: border-box;
	}
	::v-deep .el-button {
		margin-left: 10px;
		margin-bottom: 5px;
	}

	.form-wrap {
		overflow-y: auto;
		// position: absolute;
		// top: 0;
		// bottom: 80px;
		// right: 0;
		// left: 0;

		height: 100%;
	}

	.btns-wrap {
		position: fixed;
		width: 70%;
		bottom: 20px;
		background-color: #fff;
	}

	@media screen and (max-width: 768px) {
		.form-content {
			height: auto;
			margin-top: 130px;
			margin-bottom: 80px;
		}
		.form-wrap {
			@include PositionRelative(null, null);
			bottom: 0;
		}
		.btns-wrap {
			//@include PositionRelative(null, null);
			width: 100%;
			z-index: 1001;
			height: 50px;
			line-height: 50px;
			text-align: center;
			bottom: 1px;
		}
	}
</style>
