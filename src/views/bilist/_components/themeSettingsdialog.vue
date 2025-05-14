<template>
	<rvue-dialog :visible.sync="visibleSync" top="10vh" width="30%" title="主题风格" customClass="theme-container">
		<ul @click="onChangeTheme">
			<!-- <li :class="tempTheme == 'eduardo' ? 'choose' : ''" data-name="eduardo">主题eduardo</li> -->
			<li :class="tempTheme == 'dark' ? 'choose' : ''" data-name="dark">主题dark</li>
			<!-- <li :class="tempTheme == 'blue' ? 'choose' : ''" data-name="blue">主题blue</li> -->
			<li :class="tempTheme == 'roma' ? 'choose' : ''" data-name="roma">主题roma</li>
		</ul>
		<span slot="footer" class="dialog-footer">
			<el-button size="mini" @click="visibleSync = false">取 消</el-button>
			<el-button size="mini" type="primary" @click="handleSave">确 定</el-button>
		</span>
	</rvue-dialog>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
	@Component({
		components: {},
	})
	export default class extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		@PropSync("theme", { type: String, default: "eduardo" }) themeSync!: String;
		private tempTheme: String = "";
		private onChangeTheme(e: Event) {
			this.tempTheme = (<HTMLBodyElement>e.target).getAttribute("data-name") as string;
		}

		private handleSave() {
			this.themeSync = this.tempTheme;
			this.visibleSync = false;
		}

		@Watch("theme")
		onThemeChange(n: String) {
			this.tempTheme = n;
		}
	}
</script>

<style lang="scss" scoped>
	.theme-container {
		ul {
			@include JustityAndFlexWrap(flex, null, null, wrap);
			li {
				text-align: center;
				width: 50%;
				cursor: pointer;
			}
			.choose {
				border: 1px solid #eee;
			}
		}
	}
</style>
