<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
	})
	class RvueCheckbox extends Vue {
		@Model("change") value!: any;

		public static install: (param: Vue) => any;
		public static compName = "rvue-checkbox";
		@Prop({ type: [String, Number, Boolean] }) label!: string | number | boolean;
		@Prop({ type: [String, Number] }) trueLabel!: string | number;
		@Prop({ type: [String, Number] }) falseLabel!: string | number;
		@Prop({ type: Boolean, default: false }) border!: boolean;
		@Prop({ type: String }) size!: string;
		@Prop({ type: String }) name!: string;
		@Prop({ type: Boolean, default: false }) checked!: boolean;
		@Prop({ type: Boolean, default: false }) indeterminate!: boolean;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		private handleChange(val: string) {
			this.$emit("change", val);
		}

		protected render(h: CreateElement) {
			let defaultSlots = this.$slots.default || [];
			let props: TJson = {
				label: this.label,
				"true-label": this.trueLabel,
				"false-label": this.falseLabel,
				border: this.border,
				size: this.size,
				name: this.name,
				checked: this.checked,
				indeterminate: this.indeterminate,
				disabled: this.disabled,
			};

			return (
				<el-checkbox value={this.value} props={props} on-input={this.handleChange}>
					{defaultSlots.length ? defaultSlots.map((item: TJson) => item) : ""}
				</el-checkbox>
			);
		}
	}

	RvueCheckbox.install = function (Vue: any) {
		Vue.component(RvueCheckbox.compName, RvueCheckbox);
	};
	export default RvueCheckbox;
</script>
<style lang="scss" scoped>
	.el-checkbox {
		white-space: normal;
		line-height: 24px;
	}
	@media screen and (max-width: 768px) {
		.el-checkbox {
			margin-right: 26px;
		}
	}
	::v-deep .el-checkbox__label {
		display: inline-block;
		white-space: pre-line;
		word-wrap: break-word;
		overflow: hidden;
		vertical-align: middle;
		line-height: 18px;
		max-width: 80%;
	}
	::v-deep .el-tabs__nav {
		& > div {
			padding: 0 10px;
		}
	}
</style>
