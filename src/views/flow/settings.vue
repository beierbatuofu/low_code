<script lang="tsx">
	import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";

	@Component
	export default class Settings extends Vue {
		@Prop({ type: Object, default: () => ({}) }) settings!: Record<string, any>;

		private defSettings = {
			ddNotify: false,
		};

		private handleddNotifyChange(v: any) {
			this.defSettings.ddNotify = v;
			this.$emit("change", this.defSettings);
		}

		protected created() {
			if (this.settings) {
				this.defSettings = JSON.parse(JSON.stringify(this.settings));
			}
			// let { settings } = this.defineFlow;
			// settings && (this.settings = settings);

			// this.defineFlow["settings"] = this.settings;
		}

		protected render() {
			return (
				<div style={{ padding: "10px 10px 0px" }}>
					<ul>
						<li class="flex">
							<div>{this.$t("newflow.ddNotify")}</div>
							<div>
								<rvue-switch
									props={{
										value: this.defSettings.ddNotify,
										"active-color": "#409EFF",
									}}
									on={{
										change: this.handleddNotifyChange,
									}}
								></rvue-switch>
							</div>
						</li>
					</ul>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
