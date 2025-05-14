<!--
 * @Author: ben
 * @LastEditTime: 2022-05-19 09:33:19
-->
<template>
	<div>
		<rvue-label :label="$t('tableDesign.defaultValue')" />

		<RfieldDatetime :key="key" type="datetimerange" :config="config" @update="handledateTimeChange" :fieldStyle="fieldStyle" :disabled="config.edit" :mode="'attr'"></RfieldDatetime>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	@Component
	export default class TDdefaultDate extends BaseAttr {
		private handledateTimeChange(val: any) {
			this.config.defVal = val;
		}

		private key = 1;

		private get fieldStyle() {
			if (this.config.queryStyle == 0) return "default";
			if (this.config.queryStyle == 1) return "select";
		}

		@Watch("config.queryStyle")
		private changeQueryStyle() {
			let { queryStyle } = this.config;

			this.config.defVal = queryStyle == "default" ? [] : "";

			this.key++;
		}
	}
</script>
<style lang="scss"></style>
