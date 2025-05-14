<template>
	<div class="flowcenter"><FlowTable :title="$t('flow.carbonCopy')" /></div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import FlowTable from "./_components/flowTable.vue";

	@Component({
		name: "CCUsers",
		components: {
			FlowTable,
		},
	})
	export default class extends Vue {}
</script>
