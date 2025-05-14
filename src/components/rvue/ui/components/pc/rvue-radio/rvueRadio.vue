<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
	})
	class RvueRadio extends Vue {
		@Model("change", { type: [String, Number, Array] }) value!: string | number | any[];
		@Prop({ type: [String, Number, Boolean] }) label!: string | number | boolean;
		@Prop({ type: Boolean, default: false }) border!: boolean;
		@Prop({ type: String }) name!: string;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		public static install: (param: Vue) => any;
		public static compName = "rvue-radio";

		private oldVal = "";

		private handleChange(props: TJson) {
			console.log(props);
			this.$emit("change", props.label);
		}

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default || [];
			// let SlotEmpty: any = this.$slots.empty || [];
			// let SlotPrefix: any = this.$slots.prefix || [];

			let props = {
				value: this.value,
				label: this.label,
				// @ts-ignore
				disabled: this.disabled,
				// @ts-ignore
				border: this.border,
				// @ts-ignore
				name: this.name,
			};

			return (
				<el-radio props={props} on-change={() => this.handleChange(props)}>
					{SlotDefaults.map((item: TJson) => item)}
				</el-radio>
			);
		}
	}

	RvueRadio.install = function (Vue: any) {
		Vue.component(RvueRadio.compName, RvueRadio);
	};
	export default RvueRadio;
</script>
<style lang="scss" scoped>
	.el-tabs {
		* {
			font-weight: normal;
		}
	}
	::v-deep .el-collapse-item {
		display: inline;
	}
	::v-deep .el-tabs__nav {
		& > div {
			padding: 0 10px;
		}
	}
	.el-radio {
		white-space: normal;
		line-height: 24px;
	}
</style>
