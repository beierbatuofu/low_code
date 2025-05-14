<script lang="tsx">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	declare type TType = "line" | "circle" | "dashboard";
	declare type TStatus = "success" | "exception" | "warning";
	declare type TStrokeLinecap = "butt" | "round" | "square";
	@Component({})
	class RvueProgress extends Vue {
		@Prop({ type: String, default: "line" }) type!: TType;
		@Prop({ type: Number, default: 0 }) percentage!: number;
		@Prop({ type: Number, default: 6 }) strokeWidth!: number;
		@Prop({ type: Boolean, default: false }) textInside!: boolean;
		@Prop({ type: String }) status!: TStatus;
		@Prop({ type: [String, Function, Array] }) color!: string | Function | any[];
		@Prop({ type: Number, default: 126 }) width!: number;
		@Prop({ type: Boolean, default: true }) showText!: boolean;
		@Prop({ type: String, default: "round" }) strokeLinecap!: TStrokeLinecap;
		@Prop() format!: any;

		protected render(h: CreateElement) {
			let { type, percentage, strokeWidth, textInside, status, color, width, showText, strokeLinecap, format } = this;
			let props = { type, percentage, strokeWidth, textInside, status, color, width, showText, strokeLinecap, format };
			return <el-progress props={props}></el-progress>;
		}
		public static install: (param: Vue) => any;
		public static compName = "rvue-progress";
	}
	RvueProgress.install = function (Vue: any) {
		Vue.component(RvueProgress.compName, RvueProgress);
	};
	export default RvueProgress;
</script>
