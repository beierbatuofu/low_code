<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('widgetConf.scanQrCode.scan')" :tip="t('widgetConfig.attrScanCodeTip')" />
		<br />
		<el-checkbox :label="t('widgetConf.scanQrCode.allowScan')" v-model="allowScan"></el-checkbox>
		<p>
			<label v-if="allowScan" class="attrscan-comment">
				{{ t("widgetConf.scanQrCode.comment") }}
			</label>
		</p>
		<el-checkbox v-if="allowScan" :label="t('widgetConf.scanQrCode.editable')" v-model="editable" v-bind:disabled="!allowScan"></el-checkbox>
		<br />

		<!-- <el-select v-model="codeType" v-bind:disabled="!allowScan" v-if="allowScan">
			<el-option
				:label="t('widgetConf.scanQrCode.scanQrCode')"
				value="scanQrCode"
			></el-option>
			<el-option
				:label="t('widgetConf.scanQrCode.scanBarcode')"
				value="scanBarcode"
			></el-option>
		</el-select> -->
	</div>
</template>
<script>
	import { create } from "../utils/create";

	export default create({
		name: "AttrScanQrCode",

		computed: {
			allowScan: {
				get() {
					if (!this.data.scanQrCode.allowScan) {
						this.data.scanQrCode.editable = false;
					}
					try {
						return this.data.scanQrCode.allowScan;
					} catch (err) {
						this.$set(this.data, "scanQrCode", { allowScan: false });
						return this.data.scanQrCode.allowScan;
					}
				},
				set(v) {
					this.data.scanQrCode.allowScan = v;
				},
			},
			editable: {
				get() {
					try {
						return this.data.scanQrCode.editable;
					} catch (err) {
						this.$set(this.data, "scanQrCode", { editable: false });
						return this.data.scanQrCode.editable;
					}
				},
				set(v) {
					this.data.scanQrCode.editable = v;
				},
			},
			// codeType: {
			// 	get() {
			// 		return this.data.scanQrCode.codeType;
			// 	},
			// 	set(v) {
			// 		this.data.scanQrCode.codeType = v;
			// 	},
			// },
		},
	});
</script>

<style lang="scss">
	.attrscan-comment {
		margin-top: 8px;
		margin-left: 25px;
		font-size: 10px;
		color: #999;
	}
</style>
