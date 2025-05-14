<!--
 * @Author: ben
 * @LastEditTime: 2022-03-22 15:37:47
-->
<template>
	<div class="rvue-form-group" style="display: flex">
		<rvue-input
			type="text"
			:class="{ sn: mode != 'query' }"
			v-model="inputValue"
			:placeholder="mode != 'query' && orgin == 'formDesign' ? '自动生成无需填写' : '请输入'"
			:maxlength="maxInputLength"
			:readonly="readonly"
      :disabled="mode != 'query' && orgin == 'formDesign' ? true:false"
		></rvue-input>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfSn";

	@Component({})
	export default class RvueSn extends WidgetField {
		@Prop({ type: String, default: "formDesign" }) orgin!: "formDesign" | "queryDesign" | "flowDesign";

		private get inputValue() {
			return (<any>this).value;
		}

		private set inputValue(n: any) {
			if (this.mode !== "query") return;
			(<any>this).value = n;

			this.handleInput(n);
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
	.sn {
		input {
			// background: #f5f7fa;
		}
	}
</style>
