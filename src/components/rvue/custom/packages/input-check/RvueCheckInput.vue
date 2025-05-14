<template>
	<div style="position: relative; float: left; width: 100%">
		<div style="display: flex">
			<el-input @input="bindInput" v-model="value" :placeholder="placeholder" :type="type" @blur="bindBlur" />
			<slot name="item"></slot>
			<i class="el-icon-delete delete-check" @click="deleteHandler"></i>
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";

	@Component
	export default class InputCheck extends Vue {
		@Prop({ type: Boolean, default: false }) inline!: boolean;
		@Prop({ type: String, default: "" }) placeholder!: string;
		@Prop({ type: Object, default: () => ({}) }) field!: TJson;
		@Prop({ type: String, default: "text" }) type!: string;
		@Prop({ type: Object, default: {} }) data!: TJson;

		private form: TJson = {};
		private value: String = "";
		//选择类型
		private selectObj = {
			selectMulti: "array",
			select: "string",
			checkbox: "array",
			radio: "string",
		};
		protected created() {
			this.value = this.field.label;
		}

		private bindInput() {
			this.data.dicData.filter((item: TJson) => {
				if (this.field.value === item.value) {
					this.field.label = this.value;
					console.log("当前的input", item.value);
				}
			});
		}

		private bindBlur() {}

		private bindSubmit() {
			let data = (<any>this).$utils.clone(this.form);
		}

		private chearSelect() {
			(<any>this).selectObj[this.data.type] === "array" ? (this.data.value = []) : (this.data.value = "");
		}

		//删除当前项
		private deleteHandler() {
			this.data.dicData.forEach((item: TJson) => {
				if (this.data.dicData.length > 1 && this.field.value === item.value) {
					this.data.dicData.forEach((itemInner: TJson, index: number) => {
						if (item.value == itemInner.value) {
							this.data.dicData.splice(index, 1);
							this.chearSelect();
						}
					});
				}
			});
			this.$emit("delete", this.data);
		}
	}
</script>
<style lang="scss">
	%labelStyle {
		white-space: nowrap;
		display: block;
		font-size: 14px;
		padding-right: 12px;
	}

	.setlang {
		.form-item {
			margin-bottom: 22px;
		}
		.group {
			label {
				text-align: left;
				@extend %labelStyle;
				margin-bottom: 10px;
			}
			.input {
				padding-right: 25px;
				position: relative;
				flex: 1;
				.el-input {
					position: relative;
					// input {
					// 	height: 32px !important;
					// 	line-height: 32px !important;
					// }
				}
			}
			.custom-icon-record-sphere {
				font-size: 20px;
				@include PositionAbsoulte(50%, 0, null, null);
				transform: translateY(-50%);
				cursor: pointer;
				color: $color;
			}
		}

		.inline {
			display: flex;
			align-items: center;
			label {
				text-align: right;
				@extend %labelStyle;
				margin-bottom: 0px;
			}
		}
	}
	.delete-check {
		width: 50px;
		height: 50px;
		display: flex !important;
		justify-content: center;
		align-items: center;
	}
</style>
