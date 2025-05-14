<!--
 * @Author: ben
 * @LastEditTime: 2021-09-22 18:04:31
-->
<script lang="ts">
	import { Component, Watch, Vue } from "vue-property-decorator";

	@Component({
		name: "notPermission",
	})
	export default class NotPermission extends Vue {
		protected render(createElement: any) {
			return createElement("div");
		}
		protected created() {
			let tenant = JSON.parse(localStorage.getItem("tenant") || "{}");
			this.$alert(<any>this.$t("global.errorPage"), {
				confirmButtonText: "确定",
				callback: (action) => {
					if (Object.keys(tenant).length == 0) {
						localStorage.clear();
						return this.$router.push({
							path: `/tenants`,
							replace: true,
						});
					}
					this.$router.push({
						path: `/${tenant.tenantId}/workbench`,
						replace: true,
					});
				},
			});
		}
	}
</script>
