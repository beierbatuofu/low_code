<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	@Component({})
	class RvueCol extends Vue {
		@Model("change", { type: [String, Number] }) value!: string | number;
		public static install: (param: Vue) => any;
		public static compName = "rvue-col";

		@Prop({ type: Number, default: 24 }) span!: number;
		@Prop({ type: Number, default: 0 }) offset!: number;
		@Prop({ type: Number, default: 0 }) push!: number;
		@Prop({ type: Number, default: 0 }) pull!: number;
		@Prop({ type: [Number, Object], default: 0 }) xs!: number | Object;
		@Prop({ type: [Number, Object], default: 0 }) sm!: number | Object;
		@Prop({ type: [Number, Object], default: 0 }) md!: number | Object;
		@Prop({ type: [Number, Object], default: 0 }) lg!: number | Object;
		@Prop({ type: [Number, Object], default: 0 }) xl!: number | Object;
		@Prop({ type: String, default: "div" }) tag!: string;

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default || [];

			const props = {
				span: this.span,
				offset: this.offset,
				push: this.push,
				pull: this.pull,
				xs: this.xs,
				sm: this.sm,
				md: this.md,
				lg: this.lg,
				xl: this.xl,
				tag: this.tag,
			};
			return <el-col props={props}></el-col>;
		}
	}
	RvueCol.install = function (Vue: any) {
		Vue.component(RvueCol.compName, RvueCol);
	};
	export default RvueCol;
</script>
<style lang="scss" scoped></style>
