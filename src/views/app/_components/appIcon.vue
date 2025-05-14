<!--
 * @Author: ben
 * @LastEditTime: 2021-05-25 17:35:03
-->
<template>
	<i
		v-if="curAppIcon.icon"
		:class="curAppIcon.icon"
		:style="{
			background: curAppIcon.color,
		}"
		style="
			display: inline-block;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 30%;
			font-size: 20px;
			margin-right: 5px;
      color: #fff;
		"
	></i>
</template>
<script>
	import { FormModule } from "@/store/modules/form";

	export default {
		computed: {
			curAppIcon() {
				let curApp = FormModule.curApp;
				let { icon, color } = curApp;
				return {
					icon: icon || "el-icon-s-management",
					color: color || "-webkit-linear-gradient(#71bafc, #2873f3)",
				};
			},
		},
	};
</script>
