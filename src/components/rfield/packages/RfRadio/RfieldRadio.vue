<template>
	<div class="rvue-form-group" :class="{ readonly: readonly }">
		<!-- 表格内部特殊展示 -->

		<!-- 		
		<rvue-select-group
			:placeholder="tableProp && mode == 'design' ? '' : '请选择'"
			v-if="tableProp && !isTableDetail"
			props="value"
			:options="config.dicData"
			v-model="select"
			:disabled="readonly"
		>
		</rvue-select-group> -->

		<rvue-select
			@change="handleChanges"
			:readonly="readonly"
			:clearable="true"
			v-model="select"
			:placeholder="mode === 'design' ? '请选择' : '请选择'"
			v-if="(tableProp && !isTableDetail) || selectMode"
		>
			<template slot="prefix">
				<svg
					t="1630288783331"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="2152"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="128"
					height="128"
				>
					<path
						d="M512 1024c-285.257143 0-512-226.742857-512-512s226.742857-512 512-512 512 226.742857 512 512-226.742857 512-512 512zM512 80.457143C277.942857 80.457143 80.457143 277.942857 80.457143 512s190.171429 431.542857 431.542857 431.542857 431.542857-190.171429 431.542857-431.542857S746.057143 80.457143 512 80.457143z"
						p-id="2153"
						fill="#6087FD"
					></path>
					<path d="M256 512c0 138.971429 117.028571 256 256 256s256-117.028571 256-256S650.971429 256 512 256 256 373.028571 256 512z" p-id="2154" fill="#6087FD"></path>
				</svg>
			</template>
			<rvue-option v-for="item in config.dicData" :key="item.value" :label="item.label" :value="item.label">
				<span class="circle" :class="select == item.label ? 'circle-active' : ''"> </span>
				<span style="float: left" class="itemEl">{{ item.label }} </span>
			</rvue-option>
		</rvue-select>

		<rvue-radio-box
			v-else
			:readonly="readonly"
			:config="config"
			@change="handleChanges"
			:disabled="disabled"
			:options="config.dicData"
			:checkLayout="config.checkLayout"
			v-model="select"
		></rvue-radio-box>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfRadio.ts";

	@Component
	export default class RvueFieldRadio extends WidgetField {
		@Prop({ type: Boolean, default: false }) selectMode!: boolean;

		private get select() {
			return (<any>this).value;
		}

		private set select(n: any) {
			(<any>this).value = n;
		}

		private handleChanges(val: any) {
			(<any>this).select = val;
			this.handleUpdate(val);
		}

		// @Watch("select")
		// private watchSelect(n:any) {
		// 	(<any>this).handleChange(val);
		// }
	}
</script>
<style lang="scss" scoped>
	::v-deep .el-cascader-node > .el-radio {
		margin-bottom: 3px !important;
		display: block;
	}
	.itemEl {
		max-width: 230px;
		overflow: hidden;
		text-overflow: ellipsis;
		whitewhite-space: nowrap;
	}
	.circle {
		float: left;
		border: 4px solid #eee;
		@include GlobalAvatar(14px, 14px, 50%, null);
		margin-top: 11px;
		margin-right: 9px;
	}
	.circle-active {
		border: 4px solid #4c81ff;
	}
	.icon {
		width: 16px;
		height: 16px;
		margin-top: 12px;
		margin-left: 3px;
		float: left;
	}
	::v-deep.el-select-dropdown__list {
		max-width: auto !important;
		min-width: auto !important;
	}
</style>
