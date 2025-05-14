<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:05:12
-->
<template>
	<div class="avue-userRadio">
		<OrgaUserCom :readonly="readonly" :disabled="disabled" :dialogVisible.sync="dialogVisible" :tags.sync="userValue" />
		<RvueDepartmentMembers v-if="!disabled" :defaultTags.sync="userValue" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="false" :hide="[0, 1]" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import OrgaUserCom from "../_components/orgaUserCom";
	import { UserModule } from "@/store/modules/user";
	import "./_core/RfUserRadio";

	const sOrg = "value";

	@Component({
		components: {
			OrgaUserCom,
		},
	})
	export default class RvueFieldUser extends WidgetField {
		private dialogVisible = false;

		private get userValue() {
			if (this.config.rely?.type == "currentuser" && this.value.length == 0 && this.mode != "design") {
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
<style lang="scss">
	.avue-userRadio {
		height: 44px;
	}
</style>
