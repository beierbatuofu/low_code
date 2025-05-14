<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.dataShow") }}</div>
		<el-checkbox v-model="checked">{{ $t("chartDesign.limit") }}</el-checkbox>
		<rvue-input v-if="checked" v-model="value" placeholder="请输入内容"></rvue-input>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTlimitdata extends BaseAttr {
		private get value() {
			return this.data.top.limit;
		}
		private set value(n) {
			this.$set(this.data.top, "limit", n);
		}

		private get checked() {
			return this.data.top.enable;
		}
		private set checked(n) {
			this.$set(this.data.top, "enable", n);
		}
	}
</script>
<style lang="scss"></style>
