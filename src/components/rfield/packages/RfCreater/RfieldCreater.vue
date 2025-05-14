<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:00:32
-->
<template>
	<div class="avue-userRadio">
		<OrgaUserCom :dialogVisible.sync="dialogVisible" :tags.sync="userValue" />
		<RvueDepartmentMembers v-if="!disabled" :defaultTags.sync="userValue" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="false" :hide="[0, 1]" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import OrgaUserCom from "../_components/orgaUserCom";
	import { UserModule } from "@/store/modules/user";
	import "./_core/RfCreater";

	const sOrg = "value";

	@Component({
		components: {
			OrgaUserCom,
		},
	})
	export default class RvueFieldUser extends WidgetField {
		private dialogVisible = false;
		private once = true;

		private get userValue() {
			if (this.config.otherValue == "currentUsers" && this.once) {
				let { id, userName: name, avatar, userId: dtUserId } = UserModule.userInfo;
				let type = 2;
				this.value = [
					{
						name,
						id,
						type,
						avatar,
						dtUserId,
					},
				];
			}
			return this.value;
		}

		private bindGetTags(tags: any) {
			this.once = false;
			(<any>this).value = tags;
			(<any>this).handleUpdate(tags);
		}
	}
</script>
<style lang="scss"></style>
