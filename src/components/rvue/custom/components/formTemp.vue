<template>
	<div>
		<component
			:formType="formType"
			:customError="customError"
			:is="`rfield-${config.type}`"
			:config="config"
			ref="temp"
			:timestamp="timestamp"
			:form="form"
			@input="handleUpdate"
			@update="handleUpdate"
			@change="handleUpdate"
			@blur="handleBlur"
			@delfile="handleDelfile"
			:fieldId="fieldId"
			:mode="mode"
			:rules="rules"
			:tableConfig="tableConfig"
			:allReadonly="allReadonly"
			:closeForm="closeForm"
		>
		</component>
	</div>
</template>

<script>
	export default {
		name: "form-temp",
		data: function () {
			{
				return {
					key: 1,
				};
			}
		},
		watch: {
			config: {
				handler: function (n, o) {
					//config 修改后刷新组件
					// this.key++;
				},
				immediate: true,
				deep: true,
			},
		},

		props: {
			formType: {
				type: String,
			},
			customError: {
				type: Object,
				default: () => {
					return {};
				},
			},
			closeForm: {
				type: Boolean,
				default: true,
			},
			timestamp: Number,
			prop: String,
			allReadonly: {
				type: Boolean,
				default: false,
			},
			tableConfig: {
				type: Object,
				default: () => {
					return {};
				},
			},
			tableCellVal: Object,
			columnSlot: {
				type: Array,
				default: () => {
					return [];
				},
			},
			rules: {
				type: Object,
				default: () => {
					return {};
				},
			},

			mode: {
				type: String,
				default: () => {
					return "preview";
				},
			},

			type: {
				type: String,
			},

			fieldId: {
				type: String,
			},

			config: {
				type: Object,
				default: () => {
					return {};
				},
			},
			form: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},

		methods: {
			handleBlur(event) {
				this.$emit("blur", event);
			},
			handleUpdate(event, value, prop, type = "") {
				console.log(event, value, prop, type, "event, value, prop, type");
				this.$emit("validB", value, prop);
				this.$emit("change", value, prop, type);
				this.$emit("update", value, prop, type);
			},
			handleValid(prop) {
				//this.$emit("validB", prop);
			},
			handleDelfile(file) {
				this.$emit("delfile", file);
			},
		},
		mounted() {},
	};
</script>
