<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.grid") }}</div>
		<div class="add" @click="hanldeVisible('add')" v-if="!data.config.markLine.data"><i class="el-icon-plus"></i>{{ $t("chartDesign.addGuide") }}</div>
		<ul class="show-list" v-if="data.config.markLine.data">
			<li>
				<div @click="hanldeVisible('edit')">{{ data.config.markLine.label.normal.formatter }}</div>
				<i class="el-icon-delete" @click="deleteConfigItem()"></i>
			</li>
		</ul>

		<CTmarkLineDialog :data="data" :type="type" :visible.sync="visible" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import CTmarkLineDialog from "./CTmarkLine/CTmarkLineDialog.vue";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {
			CTmarkLineDialog,
		},
	})
	export default class CTmarkLine extends BaseAttr {
		private visible: boolean = false;
		private type: string = "add";

		private deleteConfigItem() {
			this.$set(this.data.config.markLine, "data", "");
		}
		private hanldeVisible(type: string) {
			this.visible = true;
			this.type = type;
		}
	}
</script>
<style lang="scss" scoped>
	.ct-container {
		.add {
			cursor: pointer;
		}
		.show-list {
			li {
				cursor: pointer;
				@include JustityAndFlexWrap(flex, space-around, center, null);
				div {
					width: 100%;
				}
				div:hover {
					background: #eee;
				}
			}
		}
	}
</style>
