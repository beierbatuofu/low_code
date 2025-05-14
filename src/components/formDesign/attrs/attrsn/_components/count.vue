<script lang="tsx">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";

	@Component
	export default class Count extends Vue {
		@Prop({ type: Object, default: () => ({}) }) conf!: Record<string, any>;
		protected render() {
			return (
				<div>
					<el-input-number
						props={{
							value: this.conf.digitsNum,
							min: 1,
							max: 10,
						}}
						on={{
							change: (v: number) => (this.conf.digitsNum = v),
						}}
					></el-input-number>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-input__inner {
			height: 32px;
			line-height: 32px;
			padding: 5px 10px;
		}
		.el-input-number__decrease,
		.el-input-number__increase {
			height: 32px;
			line-height: 32px;
			top: 3px;
		}
	}
</style>
