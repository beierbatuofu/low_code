<script lang="tsx">
	import { Component, Watch, Vue } from "vue-property-decorator";
	import FormDetail from "@/components/formDetail/formDetail.vue";
	import { CreateElement } from "vue";

	@Component({
		components: {
			"form-detail": FormDetail,
		},
	})
	export default class DataDetail extends Vue {
		private handleClose() {
			this.$router.back();
		}

		protected render() {
			const { formCode, dataId } = this.$route.params;
			const props = { formCode, dataId };
			return (
				<div>
					<form-detail props={props} on-close={this.handleClose}></form-detail>
				</div>
			);
		}
	}
</script>
