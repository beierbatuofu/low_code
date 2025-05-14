<template>
	<div class="attr-span" v-if="!data.isInTable">
		<rvue-label :tip="$t('widgetConfig.attrWidthTip')" :label="$t('global.fieldProportion')" />
		<div class="group">
			<div class="item" :class="[value == item.value ? 'on' : '']" v-for="(item, index) in options" :key="index" @click="bindClick(item)">
				{{ item.label }}
			</div>
		</div>
	</div>
</template>
<script>
	const OPTIONS = [
		{
			label: "50%",
			value: "50%",
		},
		{
			label: "100%",
			value: "100%",
		},
	];

	const computed = {
		value: {
			get() {
				return this.data.width;
			},
			set(n) {
				this.data.width = n;
			},
		},
	};

	const methods = {
		bindClick({ label, value }) {
			this.value = value;
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
		computed,
		methods,
		props,
		data() {
			return {
				options: OPTIONS,
			};
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
	}
</style>
