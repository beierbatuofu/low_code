<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 10:37:18
-->
<template>
	<div class="rvue-form-group" style="display: flex">
		<rvue-input type="text" @blur="handleBlur" v-model="inputValue" :disabled="bDisabled" :placeholder="$t('global.placeholder')" :maxlength="maxInputLength" :readonly="readonly"></rvue-input>
		<!-- v-if="platform == 'dd'" -->
		<DdScan :platform="platform" :oConfig="config" @updateCode="handleGetCode" :readonly="readonly" :disabled="bDisabled"></DdScan>
		<!-- <DdScan v-if="platform == 'dd' && bShowScan" :platform="platform" :oConfig="config" @updateCode="handleGetCode" :readonly="readonly" :disabled="bDisabled"></DdScan> -->
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import DdScan from "../_components/ddScan";
	import * as dd from "dingtalk-jsapi";
	import "./_core/RfInput";

	@Component({
		components: {
			DdScan,
		},
	})
	export default class RvueFieldInput extends WidgetField {
		private handleGetCode(code: string) {
			this.inputValue = code;
		}

		private get bDisabled() {
			if (dd.env.platform !== "notInDingTalk" && this.config.scanQrCode.allowScan) return !this.config.scanQrCode.editable;
			return this.disabled;
		}

		private get inputValue() {
			return (<any>this).value;
		}

		private set inputValue(n: any) {
			(<any>this).value = n;

			this.handleInput(n);
		}

		private get bShowScan() {
			return this.config.scanQrCode.allowScan;
		}
		private get platform() {
			if (dd.env.platform !== "notInDingTalk") return "dd";
			return "pc";
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
</style>
