<template>
	<div>
		<rvue-form-box ref="form" :option="option" v-model="obj" @submit="submit"></rvue-form-box>
	</div>
</template>
<script>
	import Vue from "vue";
	import { RCall } from "@/utils/RCall";
	import { transDlToAt } from "@/utils/transform";
	// import { checkToken, getFormSingle, tempLogin, saveData } from "@/api/form";

	export default Vue.extend({
		name: "ExtLink",
		data() {
			return {
				option: { emptyBtn: false },
				obj: {},
			};
		},
		async created() {
			let that = this;
			let { id } = this.$route.params;
			// tampLogin 获取临时token
			let r = await RCall.newIns().post(`/codeZero/ext-link/login`, { token: id });
			this.token = r.data;
			// window.localStorage.setItem("token", r.data);
			// 外链验证
			let res = await RCall.newIns().header({ token: this.token }).post(`/codeZero/ext-link/check/${id}`);
			let { appCode, formCode } = res.data;
			this.appCode = appCode;
			this.formCode = formCode;
			// 获取表单结构
			RCall.newIns()
				.header({ token: this.token })
				.post(`/codeZero/app/${appCode}/form/${formCode}/query`)
				.then((res) => {
					const { structure, name, type } = res.data;
					const options = { ...structure };
					options.column = options.column.map((column) => {
						const eventKeys = ["change", "blur", "focus", "click"];
						eventKeys.forEach((event) => {
							if (column[event]) column[event] = new Function("meta", column[event]);
						});
						return column;
					});
					if (options.relation) {
						const formRelationEvent = new FormRelationEvent(
							appCode,
							formCode,
							// 表单关联规则数据
							options.relation,
							// 在请求数据后会回调这个方法
							(resp, formRelations) => {
								if (resp.code === "0") {
									let row = resp.data;
									Reflect.ownKeys(row).forEach((key) => row[key] && (row[key] = row[key][0]));
									that.form = row;
								}
							},
							// 这个方法是用来取表单值的
							(fieldCodes) => {
								// fieldCodes： 组件的fieldCode
								// 返回值为 fieldCodes对应的json数据
								const json = {};
								fieldCodes.forEach((v) => {
									json[v] = that.form[v];
								});
								return json;
							}
						);
						options.column = options.column.map((column) => {
							function a() {
								formRelationEvent.excuteEvent(column.prop);
							}
							column["blur"] = a;
							return column;
						});
					}
					this.option = options ? { ...options, emptyBtn: false } : { column: [] };
				});
		},
		methods: {
			submit(form, done) {
				RCall.newIns()
					.header({ token: this.token })
					.post(`/codeZero/app/${this.appCode}/form/${this.formCode}/save`, transDlToAt(form))
					.then((res) => {
						this.$message.success("提交成功");
						done();
						this.$refs.form.resetForm();
						this.obj = {};
						// 流程表单 发起流程
						/* if (this.curFormType === "F") {
						changeFlowState({
							dataId: res.data,
							formCode: this.$route.params.id,
							status: -1,
							message: "批准",
						});
					} */
					})
					.catch((err) => {
						console.log(err);
					});
			},
		},
	});
</script>
<style scoped></style>
