<script lang="tsx">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";

	interface TBtns {
		label: () => string;
		use: boolean;
	}

	@Component
	export default class BtnsPerm extends Vue {
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		private DEFINEBTNS = [
			{
				label: this.$t("newflow.pass"),
				use: true,
				value: "doPass",
			},
			{
				label: this.$t("newflow.back"),
				use: false,
				value: "doBack",
			},
			{
				label: this.$t("newflow.over"),
				use: false,
				value: "doOver",
			},
		];

		private btns: Record<string, any>[] = [];

		protected created() {
			if (!this.nodeConf.data.btns) this.nodeConf.data.btns = ["doPass"];
			let nodeBtns = this.nodeConf.data.btns;
			this.btns = this.DEFINEBTNS.concat();
			nodeBtns.length && this.btns.forEach((item) => (item.use = nodeBtns.includes(item.value)));
		}

		private switchChange(val: string, use: boolean) {
			let btns = new Set(this.nodeConf.data.btns || []);
			use ? btns.add(val) : btns.delete(val);
			this.$set(this.nodeConf.data, "btns", Array.from(btns));
		}

		protected render() {
			return (
				<div class="btns-wrap">
					{this.btns.length &&
						this.btns.map((item) => {
							return (
								<div class="group">
									<div class="name">{item.label}</div>

									<rvue-switch
										props={{
											value: item.use,
											"active-color": "#409EFF",
											disabled: item.value == "doPass",
										}}
										on={{
											change: (v: boolean) => {
												item.use = v;
												this.switchChange(item.value, item.use);
											},
										}}
									></rvue-switch>
								</div>
							);
						})}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.btns-wrap {
		font-size: 14px;
		padding: 5px 0;
		.name {
			font-weight: bold;
		}
		.group {
			display: flex;
			padding: 5px 0;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
