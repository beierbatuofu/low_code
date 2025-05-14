<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueOptionGroup extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-option-group";
		@Prop({ type: [String, Number], default: "" }) label!: string | number;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		protected render(h: CreateElement) {
			let props = {
				label: this.label,
				disabled: this.disabled,
			};

			let SlotDefaults: any = this.$slots.default || [];
			return (
				<el-option-group props={props}>
					{SlotDefaults.map((item: TJson) => {
						return <el-option props={item.componentOptions.propsData}></el-option>;
					})}
				</el-option-group>
			);
		}
	}

	RvueOptionGroup.install = function (Vue: any) {
		Vue.component(RvueOptionGroup.compName, RvueOptionGroup);
	};
	export default RvueOptionGroup;
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
</style>
