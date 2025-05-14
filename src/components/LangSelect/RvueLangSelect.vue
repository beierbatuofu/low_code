<template>
	<el-dropdown trigger="click" class="international" @command="handleSetLanguage">
		<div style="color: #fff">{{ $t("global.language") }}</div>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
			<el-dropdown-item :disabled="language === 'en'" command="en">
				English
			</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { LangModule } from "@/store/modules/lang";
	import locale from "element-ui/lib/locale";

	@Component({
		name: "Language",
	})
	export default class Language extends Vue {
		get language() {
			return LangModule.language;
		}

		private handleSetLanguage(lang: string) {
			this.$i18n.locale = lang;
			LangModule.SetLanguage(lang);
			this.$message({
				message: <string>this.$l("global.success"),
				type: "success",
			});
		}
		protected created() {
			LangModule.SetLanguage(LangModule.language);
		}
	}
</script>
<style lang="scss">
	.international {
		padding: 3px 5px;
		font-size: 14px;
		line-height: 1;
		border-radius: 4px;
		box-sizing: border-box;
		margin-right: 10px;
		margin-left:5px;
		.el-dropdown-selfdefine {
			font-weight: bold;
      color:#333 !important;
		}
	}
</style>
