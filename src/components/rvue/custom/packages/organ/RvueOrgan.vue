<template>
	<div class="rvue-organ">
		<div class="add" v-if="!$slots.add" @click="showDialog">
			<div class="choose" v-if="defaultTags.length == 0">{{ $t("global.pleaseChoose") }}</div>
			<div v-else>
				<el-tag style="margin-right: 5px; margin-bottom: 5px" v-for="(item, index) in defaultTags" :key="index">{{ item.name }}</el-tag>
			</div>
		</div>

		<RvueDepartmentMembers :defaultTags.sync="defaultTags" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :multiple="multiple" :hide="hide" />
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class TDdefaultOrg extends Vue {
		@Prop({ type: Array, default: () => [] }) tags!: any[];
		@Prop({ type: Boolean, default: true }) multiple!: boolean;
		@Prop({ type: [Array, String, Number], default: -1 }) hide!: any;

		private defaultTags = [];

		private showDialog() {
			this.dialogVisible = true;
		}

		private dialogVisible = false;
		private bindGetTags(d: any) {
			// this.$emit('change',d)
			this.defaultTags = d;

			this.$emit("change", d);
		}

		public created() {
			this.defaultTags = JSON.parse(JSON.stringify(this.tags));
		}
	}
</script>
<style lang="scss" scoped>
	.rvue-organ {
		.add {
			max-height: 100px;
			overflow: auto;
		}

		.add {
			box-sizing: border-box;
			border: 1px solid #dcdfe6;
			padding: 10px;
		}
		.choose {
			text-align: center;
			font-size: 14px;
			line-height: 36px;
		}
	}
</style>
