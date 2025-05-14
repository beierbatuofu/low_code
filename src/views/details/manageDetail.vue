<script lang="tsx">
	import { Component, Watch, Vue } from "vue-property-decorator";
	import FormDetail from "@/components/formDetail/formDetail.vue";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({
		components: {
			"form-detail": FormDetail,
		},
	})
	export default class ManageDetail extends Vue {
		private handleClose() {
			this.$router.back();
		}

		private source: string | (string | null)[] = "";

		protected created() {
			this.source = this.$route.query.source || "";
		}
		//TODO 详情编辑
		protected render() {
			const { formCode, dataId } = this.$route.params;
			const props = { formCode, dataId };
			return (
				<div>
					<form-detail props={props} mode="manage" on-close={this.handleClose}></form-detail>
				</div>
			);
		}
	}
</script>
