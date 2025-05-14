<!--
* @FileDescription: 分割线组件
* @Author: MaoJianghui
* @Date: 2021-03-22
* Copyright © 2021. All rights reserved.
-->
<template>
	<div class="rvue-form-group" style="both: clear">
		<div class="widget-width widget-height-0">
			<div :class="'sep-line-' + config.lineStyle.lineType" :style="{ borderColor: config.lineStyle.color, marginTop: '5px' }"></div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Model } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfSeparator";

	@Component
	export default class RvueFieldSeparator extends WidgetField {
		created() {
			if (!this.config.lineStyle.color) {
				this.config.lineStyle.color = "#989898";
			}

			if (!this.config.lineStyle.lineType) {
				this.config.lineStyle.lineType = "thin";
			}
		}

		// getSepLineStyle() {
		//     let styleCss = "";
		//     switch(this.props.lineStyle.lineType) {
		//         case "thin":
		//             styleCss = this.thin;
		//             break;
		//         case "thick":
		//             styleCss = this.thick;
		//             break;
		//         case "dashed":
		//             styleCss = this.dashed;
		//             break;
		//         case "none":
		//             styleCss = this.none;
		//             break;
		//         default:
		//             styleCss = this.thin;
		//             break;
		//     }
		//     return styleCss;
		// }
	}
</script>

<style lang="scss">
	@import "../../styles/index.scss";

	.widget-width {
		max-width: 100%;
	}

	.widget-height-0 .line-height-0 {
		height: 0;
	}

	.sep-line-none {
		border-top: none;
	}

	.sep-line-thin {
		border-top: 1px solid transparent;
	}

	.sep-line-thick {
		border-top: 2px solid transparent;
	}

	.sep-line-dashed {
		border-top: 1px dashed transparent;
	}
</style>
