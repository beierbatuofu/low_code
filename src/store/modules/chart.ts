import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { FilterListItem, Rules } from "@/components/chartComps/_filterComponent/_configComponent/_type";

export interface ChartState {
	filterList: FilterListItem[];
}

@Module({ dynamic: true, store, name: "chart" })
class Chart extends VuexModule implements ChartState {
	public filterList: FilterListItem[] = [];
	@Mutation
	public SET_List(opts: FilterListItem[]) {
		this.filterList = opts;
	}

	@Mutation
	public DELETE_List(filterCode: string) {
		//删除对应code filter
		this.filterList = this.filterList.map((filterItem: FilterListItem) => {
			filterItem.matchRules = filterItem.matchRules.filter((ruleItem: Rules) => {
				return ruleItem.id !== filterCode;
			});
			return filterItem;
		});
	}
}

export const ChartModule = getModule(Chart);
