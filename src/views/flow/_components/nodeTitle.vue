<script lang="tsx">
	import { Component, Vue, Prop } from "vue-property-decorator";

	@Component
	export default class NodeTitle extends Vue {
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		private get value() {
			return this.nodeConf.title.zh;
		}

		private set value(val: string) {
			this.nodeConf.title.zh = val;
		}

		private handleInput(e: any) {
			this.value = e;
		}

		protected render() {
			let props = { value: this.value };

			return (
				<div class="attr-group">
					<div class="title">{this.$t("flow.nodeName")}</div>
					<el-input props={props} on-input={this.handleInput}></el-input>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped></style>
