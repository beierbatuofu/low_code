<!--
 * @Author: ben
 * @LastEditTime: 2021-09-22 16:36:45
-->
<template>
	<div class="scan" v-if="!readonly">
		<i class="custom-icon-qrcode" @click="handleScan" v-if="allowScan"></i>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import * as dd from "dingtalk-jsapi";

	@Component
	export default class Scan extends Vue {
		@Prop({ type: String, default: "pc" }) platform!: string;
		@Prop({ type: Object, default: () => ({}) }) oConfig!: TJson;
		//
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) readonly!: boolean;

		private get allowScan() {
			return this.oConfig?.scanQrCode?.allowScan;
		}

		private handleScan() {
			// 调起钉钉扫码API
			let that = this;
			let types: TJson = {
				scanQrCode: "qrCode",
				scanbarcode: "barCode",
			};
			let type: string = types[(<any>this).scanType];
			dd.ready(function () {
				dd.biz.util.scan({
					type: "all", // type 为 all、qrCode、barCode，默认是all。
					onSuccess: function (data: any) {
						that.$emit("updateCode", data.text);
					},
					onFail: function (err: any) {
						alert(JSON.stringify(err));
					},
				});
			});
		}
	}
</script>
<style lang="scss" scoped>
	.scan {
		display: flex;
		&-disabled {
			color: #333 !important;
		}
	}
	.custom-icon-qrcode {
		display: block;
		font-size: 30px;
		margin-left: 5px;
		color: $color;
	}
</style>
