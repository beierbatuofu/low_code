<template>
	<div>
		<template v-if="parentType == 'table'">
			<tableWidth :data="data"></tableWidth>
		</template>
		<template v-else>
			<commonWidth :data="data"></commonWidth>
		</template>
	</div>
</template>
<script>
	import commonWidth from "./commonWidth";
	import tableWidth from "./tableWidth";
	import { create } from "../../utils/create";

	export default create({
		components: {
			commonWidth,
			tableWidth,
		},
	});
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
