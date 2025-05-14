<template>
	<div>
		<div>test</div>
		<div id="calendar"></div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync, Inject } from "vue-property-decorator";
	import createCalendar from "./comp.js";

	@Component({})
	export default class Test extends Vue {
		protected mounted() {
			createCalendar();
		}
	}
</script>
<style lang="scss">
	.fc-daygrid-day-number {
		cursor: pointer;
		&:hover {
			color: $color;
		}
	}
	.myclass1 {
		background: green;
		border-color: green;
		color: #fff;
	}
	.myclass2 {
		background: orange;
		border-color: orange;
	}
</style>
