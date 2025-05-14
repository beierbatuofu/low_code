<template>
	<div class="attr-span">
		<rvue-label :tip="$t('widgetConfig.attrWidthTip')" :label="$t('global.fieldProportion')" />
		<div class="group">
			<div class="item" :class="[label == item.label ? 'on' : '']" v-for="(item, index) in options" :key="index" @click="bindClick(item)">
				{{ $t(`global.${item.label}`) }}
			</div>
		</div>
		<div class="table-width-custom" v-if="label === 'custom'">
			<el-input-number v-model="value" controls-position="right" :min="100" :max="400"></el-input-number>
			<span>px</span>
		</div>
	</div>
</template>
<script>
	import { create } from "../../utils/create";
	import setComputed from "../../core/syncData";
	import i18n from "@/lang";
	const name = "AttrTableWidth";
	const OPTIONS = [
		{
			label: "small",
			value: "100",
		},
		{
			label: "standard",
			value: "200",
		},
		{
			label: "big",
			value: "300",
		},
		{
			label: "custom",
			value: "0",
		},
	];

	const methods = {
		bindClick({ label, value }) {
			this.label = label;
			label !== "custom" && (this.value = value);
		},
	};

	const computed = {
		value: {
			get() {
				if (/%/g.test(this.data.width)) {
					this.data.width = 200;
				}
				return this.data.width;
			},
			set(n) {
				this.data.width = n;
			},
		},
	};

	const props = {
		data: {
			type: Object,
			default: () => ({}),
		},
	};

	export default {
		name,
		methods,
		computed,
		props,
		data() {
			return {
				options: OPTIONS,
				label: "standard",
			};
		},
		watch: {
			value: {
				handler: function (n) {
					// console.log(n);
					let bool = false;
					this.options.forEach((element) => {
						if (element.value == n) {
							bool = true;
							this.label = element.label; //导致自定义点不动
						}
					});
					!bool && (this.label = "custom");
				},
				immediate: true,
			},
		},
	};
</script>
<style lang="scss">
	.attr-span {
		label {
			display: block;
			font-size: 14px;
			margin-bottom: 10px;
		}
		.group {
			display: flex;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
			margin-bottom: 18px;
			overflow: hidden;
			.item {
				flex: 1;
				text-align: center;
				border-right: 1px solid #dcdfe6;
				font-size: 14px;
				line-height: 30px;
				background: #fff;
				cursor: pointer;
				&:last-child {
					border: none;
				}
			}
			.on {
				background: $color;
				color: #fff;
			}
		}
		.table-width-custom {
			display: flex;
			align-items: center;
		}
	}
</style>
