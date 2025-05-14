<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueCollapseItem extends Vue {
		@Prop({ type: [String, Number] }) name!: string | number;
		@Prop({ type: String }) title!: string;
		@Prop({ type: Boolean }) disabled!: boolean;

		public static install: (param: Vue) => any;
		public static compName = "rvue-collapse-item";

		protected render() {
			let SlotDefaults: any = this.$slots.default;
			const props = {
				name: this.name,
				title: this.title,
				disabled: this.disabled,
			};
			return <el-collapse-item props={props}>{SlotDefaults && SlotDefaults.map((item: any) => item)}</el-collapse-item>;
		}
	}
	RvueCollapseItem.install = function (Vue: any) {
		Vue.component(RvueCollapseItem.compName, RvueCollapseItem);
	};
	export default RvueCollapseItem;
</script>
<style lang="scss" scoped></style>
