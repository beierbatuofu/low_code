<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueOption extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-option";
		@Prop({ type: [String, Number], default: "" }) label!: string | number;
		@Prop({ type: [String, Number], default: "" }) value!: string | number;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: [String, Number], default: "" }) key!: number | string;

		protected render(h: CreateElement) {
			let props = {
				label: this.label,
				value: this.value,
				disabled: this.disabled,
			};

			return <el-option props={props}></el-option>;
		}
	}

	RvueOption.install = function (Vue: any) {
		Vue.component(RvueOption.compName, RvueOption);
	};
	export default RvueOption;
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
