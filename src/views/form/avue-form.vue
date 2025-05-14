<template>
	<div>
		<rvue-form-design
			ref="form"
			style="height: 100vh"
			:options="options"
			:oldOptions="oldOptions"
			:aside-left-width="'270px'"
			:aside-right-width="'360px'"
			:showGithubStar="false"
			:toolbar="['preview']"
			:custom-fields="customFields"
			@submit="submit"
			:key="tiemstamp"
		>
			<template slot="toolbar">
				<el-button size="small" class="jscode" @click="showJsEditor">JS</el-button>
				<rvue-button type="primary" size="small" @click="handleGetData">{{ $t("global.save") }}</rvue-button>
			</template>
		</rvue-form-design>

		<rvue-dialog v-dialogdrag :visible.sync="phoneVisible" width="400px" :append-to-body="true" :show-close="true" @close="phoneVisible = false">
			<div class="phone">
				<div class="phone_simulator">
					<MobileAvueForm :option="options" />
				</div>
			</div>
		</rvue-dialog>

		<rvue-drawer size="80%" :visible.sync="jsvisible" direction="ltr">
			<js-editor :value.sync="jscode"></js-editor>
		</rvue-drawer>
	</div>
</template>

<script>
	import { FormModule } from "@/store/modules/form";
	import { saveFormSingle, getFormSingle, updateFormSingle } from "@/api/form";
	import MobileAvueForm from "./mobileAvueForm";
	import JsEditor from "@/components/jscode/jsEditor";

	export default {
		name: "RvueForm",
		props: {
			callbacks: {
				type: Object,
			},
		},
		components: { MobileAvueForm, "js-editor": JsEditor },
		data() {
			return {
				jscode: ``,
				jsvisible: false,
				timeout: null,
				phoneVisible: false,
				curAppCode: this.$route.params.appCode, // 当前app
				customFields: [
					/*
					{
						component: 'el-alert',
						label: '流水号',
						span: 24,
						icon: 'el-icon-postcard',
						type: "serial",
						params: { // 组件的属性
							title: '自定生成无需填写',
							type: 'success',
							closable: false
						},
						event: { // 组件的事件
							close: () => {
								console.log('111')
							}
						}
					}, */
				],
				structure: {},
				formRelations: [],
				options: {},
				oldOptions: {},
				tiemstamp: 1,
			};
		},
		// mounted() {
		// 	let fullPath = this.$route.fullPath;
		// 	let supPath=fullPath.substr(0,fullPath.lastIndexOf('/form/'))
		// 	refreshJump(fullPath,this,supPath)
		// },

		beforeRouteLeave(to, from, next) {
			//window.onbeforeunload = null;
			next();
		},
		created() {
			this.init();
			this.callbacks["tab"] = this.confirm;
		},

		computed: {
			formCode() {
				return FormModule.form.formCode;
			},
			curFormCode() {
				return this.$route.params.id;
			},
		},
		methods: {
			showJsEditor() {
				this.jsvisible = true;
			},

			confirm(success = function () {}) {
				if (Object.keys(this.options).length == 0 || JSON.stringify(this.oldOptions) == JSON.stringify(this.options)) {
					return success();
				}

				this.$Rconfirm(this.$t("formPrompt.isSaveFormDesign"), "", {
					confirmButtonText: this.$t("global.save"),
					cancelButtonText: this.$t("global.notSave"),
					type: "warning",
					closeOnClickModal: false,
				})
					.then(() => {
						this.handleGetData(() => {
							this.oldOptions = this.$utils.clone(this.options);
							success();
						});
					})
					.catch(() => {
						success();
					});
			},
			init() {
				if (this.curFormCode) {
					getFormSingle(this.curAppCode, this.curFormCode).then((res) => {
						const { structure, name, dstructure, jscode } = res.data;
						this.options = { configList: structure ? dstructure.configList : [] };
						this.oldOptions = this.$utils.clone(this.options);
						this.jscode = res.data.structure?.jscode || "";
						FormModule.setForm({
							options: this.options,
							name,
							appCode: this.curAppCode,
							formCode: this.curFormCode,
							curFormType: res.data.type,
						});
						this.tiemstamp++;
					});
				}
			},
			resetForm() {
				//this.$refs.form.getData().then(res=>console.log(res))
			},
			handleMobilePreview() {
				this.$refs.form.getData().then((data) => {
					FormModule.setForm({
						options: data,
					});
					this.phoneVisible = true;
				});
			},
			handleGetData(cb = new Function()) {
				if (this.timeout) return;
				if (Object.keys(this.structure).length == 0) {
					this.$refs.form.getData().then((data) => {
						this.oldOptions = this.$utils.clone(data);
						this.handleSubmit(data, cb);
					});
				} else {
					this.handleSubmit(this.structure, cb);
				}
				this.timeout = setTimeout(() => {
					this.timeout = null;
				}, 300);
			},
			handleSubmit(structure, cb = new Function()) {
				// 重新收集每个字段的relation组合成外层新的structure.relation
				delete structure.relation;
				let formRelations = [];
				structure.configList.forEach((field) => {
					if (field.type == "tab") {
						let { children, ...attrs } = field;
						let child = [];
						children.forEach((item) => {
							let { id, title, configList } = item;
							child.push({ id, title });
							formRelations.push(...configList);
						});

						formRelations.push({
							...attrs,
							children: child,
						});
					} else {
						formRelations.push(field);
					}
				});

				updateFormSingle(this.curAppCode, this.curFormCode, {
					appCode: this.curAppCode,
					code: this.curFormCode,
					structure: {
						configList: formRelations,
						jscode: this.jscode,
					},
				})
					.then((res) => {
						if (res.code == "0") {
							this.structure = {};

							FormModule.setForm({
								options: structure,
							});
							this.oldOptions = this.$utils.clone(this.options);
							this.$message({
								message: this.$t("global.success"),
								type: "success",
							});
						} else {
							this.$message.error(res.msg);
						}
					})
					.finally(() => {
						try {
							cb();
						} catch (err) {}
					});
			},
			submit(structure) {
				//	this.structure = structure;
			},
		},
	};
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-drawer__header {
			margin: 0;
			padding: 0;
		}
	}
	html {
		overflow-y: hidden;
	}
	.phone {
		margin-top: 10px;
		min-width: 360px;
		padding: 10px;
		@include GlobalAvatar(360px, 600px, 12px, #f7f8fa);
		.phone_simulator {
			@include GlobalAvatar(100%, 100%, 12px, #fafafa);
			z-index: 1;
			box-sizing: border-box;
			overflow: hidden;
			box-shadow: 0 4px 12px #ebedf0;
			iframe {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
	.jscode {
		color: $color;
		background: #fff;
	}
</style>
