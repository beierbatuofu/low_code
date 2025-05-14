<template>
	<div class="flowcenter">
		<FlowTable :title="$t('flow.mylaunch')" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import FlowTable from "./_components/flowTable.vue";

	@Component({
		name: "create",
		components: {
			FlowTable,
		},
	})
	export default class extends Vue {}
</script>
