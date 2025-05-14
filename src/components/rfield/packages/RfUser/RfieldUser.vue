<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:05:03
-->
<template>
	<div class="avue-userRadio">
		<OrgaUserCom :readonly="readonly" :disabled="disabled" :dialogVisible.sync="dialogVisible" :tags.sync="orgVal" />
		<RvueDepartmentMembers v-if="!disabled" :defaultTags.sync="orgVal" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="true" :hide="[0, 1]" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import OrgaUserCom from "../_components/orgaUserCom";
	import "./_core/RfUser";

	const sOrg = "value";

	@Component({
		components: {
			OrgaUserCom,
		},
	})
	export default class RvueFieldUser extends WidgetField {
		private dialogVisible = false;

		private get orgVal() {
			if (typeof this.value == "string") return JSON.parse(this.value);
			return this.value;
		}

		private bindGetTags(tags: any) {
			(<any>this).value = tags;
			(<any>this).handleUpdate(tags);
			this.$emit("change", tags);
		}
	}
</script>
<style lang="scss"></style>
