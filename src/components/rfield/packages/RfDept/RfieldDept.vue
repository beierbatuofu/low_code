<!--
 * @Author: ben
 * @LastEditTime: 2022-05-18 16:16:37
-->
<template>
	<div class="avue-dept" style="wid">
		<OrgaUserCom :dialogVisible.sync="dialogVisible" :disabled="disabled" :tags.sync="orgVal" :readonly="readonly" />
		<RvueDepartmentMembers ref="dept" v-if="!disabled" :defaultTags.sync="orgVal" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="true" :hide="[1, 2]" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import OrgaUserCom from "../_components/orgaUserCom";
	import "./_core/RfDept.ts";

	@Component({
		components: {
			OrgaUserCom,
		},
	})
	export default class RvueFieldDept extends WidgetField {
		private dialogVisible = false;

		private get orgVal() {
			if (typeof this.value == "string" && this.value) return JSON.parse(this.value || "[]");
			return this.value;
		}
		private bindGetTags(tags: any) {
			(<any>this).value = tags;
			(<any>this).handleUpdate(tags);
			this.$emit("change", tags);
		}
		protected mounted() {}
	}
</script>
<style lang="scss">
	.dept-chose {
		border: 1px solid #dcdfe6;
		min-height: 40px;
		line-height: 40px;
		overflow: hidden;
		padding: 0px 10px;
		border-radius: 4px;
		background-color: #fff;
		min-width: 100px;
		box-sizing: border-box;
		.chose-text {
			color: #c4c4c4;
			font-size: 13px;
			text-align: center;
			height: 30px;
		}
		.tags {
			margin-right: 4px;
		}
	}
	.dept-chose > div {
		height: 39px;
		line-height: 39px;
	}
</style>
