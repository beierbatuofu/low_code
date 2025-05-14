<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import { getFormSingle } from "@/api/form";
	import Fulldate from "../components/fulldate";

	@Component({
		components: {
			fulldate: Fulldate,
		},
	})
	export default class Detail extends Vue {
		private struct: TFullDateData = Object.create({});

		protected render() {
			return (
				<div class="detail">
					<fulldate></fulldate>
				</div>
			);
		}
	}
</script>
<style scoped lang="scss">
	.detail {
		background: #fff;
		min-height: calc(100vh - 56px);
		padding: 10px;
	}
</style>
