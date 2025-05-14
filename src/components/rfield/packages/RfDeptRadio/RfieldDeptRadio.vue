<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:01:35
-->
<template>
	<div class="avue-deptRadio">
		<OrgaUserCom :dialogVisible.sync="dialogVisible" :disabled="disabled" :tags.sync="orgVal" :readonly="readonly" />
		<RvueDepartmentMembers v-if="!disabled" :defaultTags.sync="orgVal" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="false" :hide="[1, 2]" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import OrgaUserCom from "../_components/orgaUserCom";
	import "./_core/RfDeptRadio";

	@Component({
		components: {
			OrgaUserCom,
		},
	})
	export default class RvueFieldDeptRadio extends WidgetField {
		private dialogVisible = false;
		private tags = [];

		private get orgVal() {
			if (typeof this.value == "string") return JSON.parse(this.value);
			return this.value;
		}

		private bindGetTags(tags: any, select: any) {
			this.tags = tags;
			(<any>this).value = tags;
			(<any>this).handleUpdate(tags);
			this.$emit("change", tags);
		}

		@Watch(`config.value`)
		onChangeOrgs(n: any) {
			this.tags = n;
		}

		protected created() {
			this.tags = this.config.value ? this.config.value : [];
		}

		private changeDialogVisible(data: any) {
			this.dialogVisible = data;
		}
	}
</script>
<style lang="scss">
	.avue-deptRadio {
		height: 44px;
	}
</style>
