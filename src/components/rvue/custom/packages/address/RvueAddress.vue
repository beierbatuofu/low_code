<script lang="tsx">
	import { Component, Provide, Vue, Watch, Prop, Model } from "vue-property-decorator";
	import options from "./_core/options";

	@Component({})
	export default class RvueAddress extends Vue {
		@Model("update") value!: string[];
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) readonly!: boolean;
		@Prop({ type: Object, default: () => ({ label: "name", value: "name", checkStrictly: true }) }) props!: Record<string, string | boolean>;

		private options = options;
		private arr: string[] = [];

		protected render() {
			return (
				<el-cascader
					on={{
						change: (arr: string[]) => {
							this.$emit("update", arr);
						},
					}}
					props={{
						disabled: this.disabled,
						value: this.value,
						options: this.options,
						props: this.props,
					}}
				></el-cascader>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.readonly {
		height: 25px;
		line-height: 25px;
		margin: 0 !important;
		box-sizing: border-box;
	}
	::v-deep {
		input {
			padding-left: 30px;
		}
	}
</style>
