<script lang="tsx">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Node from "@/components/rvue/custom/packages/flow/_packages/node/node.vue";

	@Component({})
	class RvueTabPane extends Vue {
		@Prop({ type: String }) label!: string;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: String }) name!: string;
		@Prop({ type: Boolean, default: false }) closable!: boolean;
		@Prop({ type: Boolean, default: false }) lazy!: boolean;

		protected render(h: CreateElement) {
			let { label, name, disabled, closable, lazy } = this;
			let props = { label, name, disabled, closable, lazy };

			return <el-tab-pane props={props}></el-tab-pane>;
		}
		public static install: (param: Vue) => any;
		public static compName = "rvue-tab-pane";
	}
	RvueTabPane.install = function (Vue: any) {
		Vue.component(RvueTabPane.compName, RvueTabPane);
	};
	export default RvueTabPane;
</script>
<style lang="scss" scoped></style>
