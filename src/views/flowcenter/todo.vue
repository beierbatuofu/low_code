<template>
	<div class="flowcenter">
		<FlowTable :title="$t('flow.currentTodo')" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import FlowTable from "./_components/flowTable.vue";

	@Component({
		name: "Todo",
		components: {
			FlowTable,
		},
	})
	export default class extends Vue {}
</script>
