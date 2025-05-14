<template>
	<div>
		<div class="group" style="height: 194px; overflow: auto; margin: 2% 8% 0% 8%">
            <div v-if="data.length > 0" :key="reLoadKey">
                <div v-for="(item, index) in data" :key="index">
                    <el-checkbox @change="bindChecked(item)" :label="item" :checked="setChecked(item)" :key="item.id" class="roleItem">
                        {{item.name}}
                    </el-checkbox>
                </div>
            </div>
            <div class="noInfo" v-else>{{ $t("global.empty") }}</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Ref, PropSync, Watch, Inject } from "vue-property-decorator";
@Component({})
export default class extends Vue {
	@Prop({ type: Array, default: [] }) data!: any[];
	@Prop({ type: Array, default: {} }) tags!: any[];
	@PropSync("tags", { type: Array, default: {} }) syncTags!: any[];
	@Inject() readonly parent!: any;

    private reLoadKey = 1;
    private setChecked(node: any) {
		let index = this.syncTags.findIndex((item: any) => item.id == node.id);
		return index >= 0;
	}

    private bindChecked(node: any) {
		let multiple = (this.parent as any).multiple;
		if (multiple) {
			this.getCheckData(node);
		} else {
			this.getRadioData(node);
		}
	}

    private getCheckData(node: any) {
		let index = this.syncTags.findIndex((item: any) => item.id == node.id);
		index < 0
			? this.syncTags.push({
					type: "1",
					id: node.id,
					name:node.name,
					code:node.code,
					user:node.users,
			  })
			: this.syncTags.splice(index, 1);
	}

	private getRadioData(node: any) {
        let index = this.syncTags.findIndex((item: any) => item.id == node.id);
        index < 0
		    ? this.syncTags = [
			    {
				    type: "1",
				    id: node.id,
				    name: node.name,
					code:node.code,
					user:node.users,
			    }]
            : this.syncTags.splice(index, 1);
	};
    @Watch("syncTags")
	onChangeSyncTags(n: any) {
		this.reLoadKey++;
	}
}
</script>
<style lang="scss" scoped>
.noInfo {
	text-align: center;
	margin: 10%;
}
.roleItem{
    padding:5px 0;
}
</style>