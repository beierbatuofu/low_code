<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, Model } from "vue-property-decorator";

	@Component
	export default class Datetime extends Vue {
		@Prop({ type: Array, default: () => [] }) options!: Record<string, any>[];
		@Model("change") value!: any;
		@Prop({ type: Boolean, default: false }) multiple!: boolean;
		@Prop({ type: Boolean, default: false }) load!: boolean;
		private get undefinedValues() {
			let undefVals: string[] = [];

			if (!this.value || this.value.length == 0) return [];
			(Array.isArray(this.value) ? this.value : [this.value]).forEach((k: string) => {
				if (this.options.findIndex(({ fieldId }: Record<"fieldId", string>) => fieldId == k) < 0) {
					undefVals.push(k);
				}
			});

			return undefVals;
		}

		protected render() {
			let lang = window.localStorage.getItem("lange") || "zh";
			if (!this.load) return <div></div>;

			return (
				<div>
					<rvue-select style="width:100%" props={{ value: this.value, multiple: this.multiple }} on={{ change: (v: string) => this.$emit("change", v) }}>
						{this.options.map((conf: Record<string, any>) => (
							<rvue-option
								props={{
									value: conf.fieldId,
									label: conf.title[lang],
								}}
							></rvue-option>
						))}
					</rvue-select>
					{this.undefinedValues.length ? (
						<div class="error">
							{this.undefinedValues.map((s: string) => (
								<span>{s}字段不存在</span>
							))}
						</div>
					) : (
						<div></div>
					)}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.error {
		color: red;
		padding: 3px;
		font-size: 12px;
		transform: scale(0.9);
		transform-origin: left;
		span {
			display: block;
			padding-right: 5px;
		}
	}
</style>
