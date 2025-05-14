<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:00:03
-->
<template>
	<div class="rvue-form-group">
		<rvue-input
			type="textarea"
			@blur="handleBlur"
			v-model="inputValue"
			:placeholder="$t('global.placeholder')"
			:disabled="disabled"
			:rows="rows"
			:autosize="autosize"
			:readonly="readonly"
			:maxlength="maxInputLength"
		></rvue-input>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfTextarea";

	@Component
	export default class RvueFieldTextarea extends WidgetField {
		@Prop({
			type: Number,
			default: 2,
		})
		rows!: number;
		@Prop({
			type: Object,
			default: () => ({
				minRows: 2,
				maxRows: 2,
			}),
		})
		autosize!: TJson;

		public get inputValue() {
			// console.log(this.value, "this.value");
			return this.value;
		}

		public set inputValue(n: any) {
			this.value = n;
			this.handleInput(n);
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/index.scss";

	::v-deep {
		textarea {
			padding: 5px 30px !important;
			min-height: 60px !important;
		}
	}
</style>
