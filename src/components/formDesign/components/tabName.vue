<script lang="tsx">
	import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

	@Component({})
	export default class TabName extends Vue {
		@Prop({ type: Object, default: () => ({}) }) title!: TJson;

		private handleChange(title: TJson) {
			this.$emit("change", this.$utils.deepClone(title));
		}

		protected created() {}

		protected render() {
			const props = {
				field: this.title,
			};

			return (
				<div style={{ marginBottom: "5px" }}>
					<rvue-lang-input props={props} on-change={this.handleChange}></rvue-lang-input>
				</div>
			);
		}
	}
</script>
