<!--
 * @Author: ben
 * @LastEditTime: 2021-12-20 09:10:33
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.fieldId')" />

		<rvue-input v-if="!disabled" v-model="value" @blur="handleBlur"></rvue-input>
		<div class="readonly" v-else>{{ value }}</div>

		<div class="msg">{{ msg }}</div>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import RefieldCore from "@rfield/core/RfieldCore.ts";

	const name = "AttrFieldId";

	const getFieldIds = (configList) => {
		let sConfigList = JSON.stringify(configList);
		if (!sConfigList) return [];
		let result = sConfigList.match(/fieldId":"[^"]+"/g);
		try {
			return result.map((item) => item.split(":").pop().replace(/"/g, ""));
		} catch (err) {
			return [];
		}
	};

	export default create({
		name,
		data() {
			return {
				maxLength: "100%",
				titleShow: this.data.titleShow,
				ofieldId: "",
				msg: "",
				value: "",
			};
		},
		methods: {
			checkTitleShow() {
				this.$set(this.data, "titleShow", this.titleShow);
			},
			handleChange(form) {
				this.data.title = this.$utils.deepClone(form);
			},
			handleBlur() {
				let v = this.value;
				let idx = this.newFieldIds.findIndex((id) => id == v);
				let sysfieldIds = RefieldCore.sysfieldIds;
				this.msg = "";
				if (sysfieldIds.includes(v)) {
					this.value = this.data.fieldId;
					return (this.msg = `${v}为系统字段,无法使用`);
				} else if (!/^[a-zA-Z\d]+[a-zA-Z\d_]+[a-zA-Z\d]$/.test(v) || v.length < 6 || v.length > 32) {
					this.value = this.data.fieldId;
					return (this.msg = `组件id需由数字,字母,下划线(开头和结尾无法使用)组成6~32个字符`);
				} else if (idx != -1 && this.value != this.data.fieldId) {
					this.value = this.data.fieldId;
					return (this.msg = `${v}已被使用`);
				}

				this.data.fieldId = this.value.toLocaleLowerCase();
			},
		},
		computed: {
			fIdVal: {
				get() {
					return this.data.fieldId;
				},
				set(v) {},
			},
			oldFieldIds() {
				return getFieldIds(this.oldOptions.configList);
			},
			newFieldIds() {
				return getFieldIds(this.configList);
			},
			disabled() {
				this.ofieldId = this.data.fieldId;
				let idx = this.oldFieldIds.findIndex((fid) => fid == this.ofieldId);

				return idx >= 0;
			},
		},
		watch: {
			data: {
				handler: function (n, o) {
					this.value = this.data.fieldId;
					this.ofieldId = this.data.fieldId;
				},
				imediate: true,
				deep: true,
			},
		},
		created() {},
	});
</script>

<style lang="scss" scoped>
	.readonly {
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		padding: 0 30px;
		background: #f5f7fa;
	}
	// .checkBox {
	// 	padding: 8px 0;
	// }
	.msg {
		color: #f56c6c;
		font-size: 12px;
		height: 20px;
		line-height: 20px;
	}
</style>
