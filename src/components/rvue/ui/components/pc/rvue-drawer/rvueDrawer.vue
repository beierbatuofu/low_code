<script lang="ts">
	import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	declare type TDirection = "rtl" | "ltr" | "ttb" | "btt";

	@Component({})
	class RvueDrawer extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-drawer";

		@Prop({ type: Boolean, default: false }) appendToBody!: boolean;
		@Prop({ type: Function }) beforeClose!: () => void;
		@Prop({ type: Boolean, default: true }) closeOnPressEscape!: boolean;
		@Prop({ type: String }) customClass!: string;
		@Prop({ type: Boolean, default: false }) destroyOnClose!: boolean;
		@Prop({ type: Boolean, default: true }) modal!: boolean;
		@Prop({ type: Boolean, default: true }) modalAppendToBody!: boolean;
		@Prop({ type: String, default: "rtl" }) direction!: TDirection;
		@Prop({ type: Boolean, default: true }) showClose!: boolean;
		@Prop({ type: [String, Number], default: "30%" }) size!: string | number;
		@Prop({ type: String }) title!: string;
		@PropSync("visible", { type: Boolean, default: false }) syncVisible!: boolean;
		@Prop({ type: Boolean, default: true }) wrapperClosable!: boolean;
		@Prop({ type: Boolean, default: true }) withHeader!: boolean;

		private open() {
			this.$emit("open");
		}
		private opened() {
			this.$emit("opened");
		}
		private close() {
			this.$emit("close");
		}
		private closed() {
			this.$emit("closed");
		}
		public closeDrawer() {
			(<TJson>this.$refs.drawer).closeDrawer();
		}
		protected created() {}

		protected render(h: CreateElement) {
			const self = this;
			let titleSlot = this.$slots.title || [];
			let defaultSlot = this.$slots.default || [];
			const props = {
				"append-to-body": this.appendToBody,
				"before-close": this.beforeClose,
				"close-on-press-escape": this.closeOnPressEscape,
				"custom-class": this.customClass,
				"destroy-on-close": this.destroyOnClose,
				modal: this.modal,
				"modal-append-to-body": this.modalAppendToBody,
				direction: this.direction,
				"show-close": this.showClose,
				size: this.size,
				title: this.title,
				visible: this.syncVisible,
				wrapperClosable: this.wrapperClosable,
				withHeader: this.withHeader,
			};

			const on = {
				"update:visible": function (b: boolean) {
					self.syncVisible = b;
				},
				open: self.open,
				opened: self.opened,
				close: self.close,
				closed: self.closed,
			};

			return h(
				"el-drawer",
				{
					props,
					on,
					ref: "drawer",
				},
				[titleSlot, defaultSlot]
			);
		}
	}
	RvueDrawer.install = function (Vue: any) {
		Vue.component(RvueDrawer.compName, RvueDrawer);
	};

	export default RvueDrawer;
</script>
<style lang="scss"></style>
