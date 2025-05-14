<script lang="tsx">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";

	@Component
	export default class FixedChars extends Vue {
		@Prop({ type: Object, default: () => ({}) }) conf!: Record<string, any>;

		protected render() {
			return (
				<div>
					<rvue-input
						type="text"
						on={{
							change: (v: any) => {
								this.conf.value = v;
							},
						}}
						placeholder="请输入内容"
						props={{
							value: this.conf.value,
							maxlength: 100,
						}}
					></rvue-input>
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
	}
</style>
