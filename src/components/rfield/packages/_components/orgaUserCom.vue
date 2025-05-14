<!--
 * @Author: ben
 * @LastEditTime: 2022-01-29 13:50:29
-->

<template>
	<div @click="handleOpenDialog" :class="className">
		<div v-if="presentText.length > 0">
			<el-tag class="tags" :key="tag" v-for="tag in presentText" :disable-transitions="false">
				{{ tag }}
			</el-tag>
		</div>

		<p class="chose-text" v-else-if="!readonly">{{ $t("global.pleaseChoose") }}</p>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop, Watch, Emit, PropSync } from "vue-property-decorator";

	@Component
	export default class OrgaUserCom extends Vue {
		@PropSync("dialogVisible", { type: Boolean, default: true }) syncDialogVisible!: boolean;
		@PropSync("tags", { type: [Array, String], default: () => [] }) syncTags!: any;
		@Prop({ type: Boolean, default: false }) readonly!: boolean;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		private get className() {
			if (this.readonly) {
				return "dept-chose dept-readonly";
			}

			if (this.disabled) {
				return "dept-chose dept-disabled";
			}

			return "dept-chose";
		}

		private handleOpenDialog() {
			if (this.readonly || this.disabled) return;
			this.syncDialogVisible = true;
		}

		private get presentText() {
			let arr: any = this.syncTags || [];
			let temp: any[] = [];
			if (arr.length == 0 || arr == "currentuser") return "";

			arr = Array.isArray(arr) ? arr : JSON.parse(arr);
			// console.log("aaaaaaa", arr);
			arr.forEach((item: TJson) => {
				temp.push(item.name);
			});

			return temp;
		}
	}
</script>

<style lang="scss">
	.dept-chose {
		border: 1px solid #dcdfe6;

		& > div {
			height: 40px !important;
			line-height: 40px;

			overflow: auto;
		}

		@include GlobalAvatar(null, null, 4px, #fff);
		.chose-text {
			color: #c4c4c4;
			font-size: 13px;
			text-align: center;
		}
		.tags {
			margin-right: 4px;
		}
	}
	.dept-readonly {
		border: none !important;
		border-bottom: 1px solid #dcdfe6 !important;
		& > div {
			height: auto !important;
		}
	}
	.dept-disabled {
		background: #f5f7fa !important;
	}
</style>
