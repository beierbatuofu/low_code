<template>
	<el-calendar v-model="handlevalue" :range="range" :first-day-of-week="dayOfWeek">
		<template slot="dateCell" slot-scope="{ date, data }">
			<slot name="dateCell" :data="data" :date="date"> </slot>
		</template>
	</el-calendar>
</template>
<script lang="ts">
	import { Component, Vue, Model, Prop } from "vue-property-decorator";
	declare type TDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
	@Component({})
	class RvueCalendar extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-calendar";
		@Model("change", { type: [Date, Number, String] }) value!: string | number | Date;
		@Prop({ type: Array }) range!: any[];
		@Prop({ type: Number, default: 1 }) dayOfWeek!: TDayOfWeek;

		private get handlevalue() {
			return (<any>this).value;
		}
		private set handlevalue(n: [Date, Number, String]) {
			this.$emit("change", n);
		}
	}
	RvueCalendar.install = function (Vue: any) {
		Vue.component(RvueCalendar.compName, RvueCalendar);
	};
	export default RvueCalendar;
</script>
