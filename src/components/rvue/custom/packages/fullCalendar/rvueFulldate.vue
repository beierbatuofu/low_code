<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import fullCalendar from "./fullCalendar.js";

	@Component
	export default class RvueFulldate extends Vue {
		@Prop({ type: Object, default: () => ({}) }) options!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) events!: TFullDataEvent[];
		@Prop({ type: Function, default: function () {} }) dateClick!: (info: Record<string, any>, fullCalendar: Record<string, any>) => void;
		@Prop({ type: Function, default: function () {} }) eventClick!: (eventInfo: Record<string, any>, fullCalendar: Record<string, any>) => void;
		@Prop({ type: Function, default: function () {} }) nextClick!: (fullCalendar: Record<string, any>) => void;
		@Prop({ type: Function, default: function () {} }) prevClick!: (fullCalendar: Record<string, any>) => void;
		protected render() {
			return <div ref="calendar"></div>;
		}

		protected mounted() {
			fullCalendar.render(this.$refs.calendar);
		}

		private resetOpts() {
			fullCalendar.reset({
				...this.options,
				events: this.events,
				dateClick: (info: Record<string, any>) => this.dateClick.call(this, info, fullCalendar.calendar),
				eventClick: (eventInfo: Record<string, any>) => {
					this.eventClick.call(this, eventInfo, fullCalendar.calendar);
				},
				customButtons: {
					next: {
						text: "next",
						click: (mouseEvent: Element, htmlElement: Element) => {
							this.nextClick(fullCalendar.calendar);
						},
					},
					prev: {
						text: "prev",
						click: (mouseEvent: Element, htmlElement: Element) => {
							this.prevClick(fullCalendar.calendar);
						},
					},
				},
			});
		}

		@Watch("events", { deep: true })
		private changeEvents() {
			this.resetOpts();
		}

		@Watch("options", { deep: true })
		private changeOptions() {
			this.resetOpts();
		}
	}
</script>
<style lang="scss">
	.fc-col-header,
	.fc-daygrid-body,
	.fc-scrollgrid-sync-table {
		width: 100% !important;
	}
</style>
