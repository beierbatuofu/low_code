<script lang="tsx">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueDropdownMenu extends Vue {
		protected render() {
			let defaultSlots = this.$slots.default || [];
			return <el-dropdown-menu>{defaultSlots.map((item) => item)}</el-dropdown-menu>;
		}
		public static install: (param: Vue) => any;
		public static compName = "rvue-dropdown-menu";
	}
	RvueDropdownMenu.install = function (Vue: any) {
		Vue.component(RvueDropdownMenu.compName, RvueDropdownMenu);
	};
	export default RvueDropdownMenu;
</script>
