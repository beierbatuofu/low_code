<script lang="tsx">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueDropdownItem extends Vue {
		@Prop() command!: any;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) divided!: boolean;
		@Prop({ type: String }) icon!: string;

		private handleClick() {}

		protected render(h: CreateElement) {
			let defaultSlots = this.$slots.default || [];
			let { command, disabled, divided, icon } = this;
			let props = { command, disabled, divided, icon };
			return (
				<el-dropdown-item props={props} nativeOn={{ click: this.handleClick }}>
					{defaultSlots.map((item) => item)}
				</el-dropdown-item>
			);
		}
		public static install: (param: Vue) => any;
		public static compName = "rvue-dropdown-item";
	}
	RvueDropdownItem.install = function (Vue: any) {
		Vue.component(RvueDropdownItem.compName, RvueDropdownItem);
	};
	export default RvueDropdownItem;
</script>
