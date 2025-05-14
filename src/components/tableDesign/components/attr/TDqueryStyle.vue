<template>
	<div>
		<rvue-label :label="$t('tableDesign.style')" />
		<el-select v-model="selectValue" style="width: 100%" :size="size">
			<el-option v-for="item in config.queryOptions" :key="item.value" :label="$t(item.label)" :value="item.value"> </el-option>
		</el-select>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	@Component
	export default class TDstyle extends BaseAttr {
		private handleAdd() {
			this.$emit("add");
		}

		private defConfig: any = {};
		private get selectValue() {
			console.log(this.config);
			return this.config.queryStyle;
		}

		private set selectValue(n) {
			if (this.config.type == "datetime" || this.config.type == "create_time" || this.config.type == "update_time") {
				if (n == "default") {
					this.config.defVal = [];
					this.config.linkVal = "between";
				} else {
					this.config.linkVal = "dynamic";
				}
				console.log(this.config);
			}

			this.config.queryStyle = n;
		}
	}
</script>
<style lang="scss">
	.TD-attr-style {
	}
</style>
