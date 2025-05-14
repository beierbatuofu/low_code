<template>
	<rvue-button type="primary" icon="el-icon-delete" @click="handleClick">
		{{ $t("global.deletion") }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Inject } from "vue-property-decorator";
	import { delData } from "@/api/form";

	@Component
	export default class DetailDelete extends Vue {
		static readonly compName = "dbtn-del";
		@Inject() readonly conf!: TJson;
		private handleClick() {
			let { dataId } = this.conf;
			let { formCode, appCode } = this.conf;
			this.$Rconfirm(<string>this.$t("setting.confirmDelete"), "", {
				confirmButtonText: this.$t("linkDataDialog.confirm"),
				cancelButtonText: this.$t("linkDataDialog.cancel"),
				type: "warning",
			}).then(() => {
				delData(appCode, formCode, dataId).then(() => {
					this.$emit("close");
				});
			});
		}
	}
</script>
