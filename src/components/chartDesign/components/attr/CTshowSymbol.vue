<template>
	<div class="ct-container">
		<div>显示折线点</div>
		<el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">显示折线点 </el-switch>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTshowSymbol extends BaseAttr {
		private get value() {
			return this.data.config.showSymbol;
		}
		private set value(n) {
			this.data.config.showSymbol = n;
		}
	}
</script>
<style lang="scss"></style>
