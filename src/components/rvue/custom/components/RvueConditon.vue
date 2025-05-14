<template>
	<div class="part ldtj">
		<p class="title">{{ $t(`linkDataDialog.${title}`) }}</p>
		<div class="onerules" :key="index" v-for="(rules, index) in matchRules">
			<div v-if="rules.length">
				<div class="onerule">
					<rvue-row :span="24" style="margin-bottom: 10px" :key="i" v-for="(rule, i) in rules" :gutter="10">
						<rvue-col :span="8">
							<RelationSelect
								:val.sync="rule.targetFieldCode"
								:key="rule.targetFieldCode"
								:placeholder="$t('linkDataDialog.targetField')"
								:options="dic2"
								@change="
									(code) => {
										rule.judgeValues = [];
										rule.method = '';
										handleChangeSelect(dic2, rule, code);
									}
								"
							></RelationSelect>
						</rvue-col>
						<rvue-col :span="3">
							<rvue-select :clearable="false" v-model="rule.method" :placeholder="$t('linkDataDialog.judge')" type="tree" :dic="typeMap[rule.type]"
               @change="(val)=>{
                       rule.dataType=''
                       rule.judgeValues = [];  
               }
                 ">
								<rvue-option v-for="(item, index) in typeMap[rule.type] " :key="index" :value="item.value" :label="$t(`formDesign.${item.label}`)">{{
									$t(`formDesign.${item.label}`)
								}}</rvue-option>
							</rvue-select>
						</rvue-col>
						<rvue-col :span="3">
							<rvue-select v-if="rule.method.indexOf('empty') < 0" :clearable="false" v-model="rule.dataType" @change="rule.judgeValues = []">
								<el-option v-for="item in DIC[(rule.type=='number' && rule.method=='between')?'number':'DATATYPE']" :key="item.value" :label="$t(`formDesign.${item.label}`)" :value="item.value"></el-option>
							</rvue-select>
						</rvue-col>

						<rvue-col :span="9">
							<template v-if="rule.method.indexOf('empty') < 0">
								<RelationCustom
									@input="
										(e) => {
											handleInput(e, rule, 'judgeValues');  
										}
									"
									:val="rule.judgeValues"
									:filterData="rule"
									:dic="dic2"
									:placeholder="$t('linkDataDialog.pleaseEnter')"
									v-if="rule.dataType === 0"
								/>

								<RelationSelect
									v-else
									:key="rule.judgeValues + ''"
									:val.sync="rule.judgeValues"
									:placeholder="$t('linkDataDialog.currentField')"
									:options="dic3"
									:filterData="rule"
									@change="(e) => (rule.judgeValues = [e])"
								></RelationSelect>
							</template>
						</rvue-col>
						<rvue-col :span="1">
							<rvue-button style="margin-top: 6px" icon="el-icon-delete" circle size="mini" @click.prevent="removeRule(index, i)"></rvue-button>
						</rvue-col>
					</rvue-row>
				</div>

			</div>
			<rvue-button icon="el-icon-circle-plus" @click="addAndRule(index)">{{ $t("linkDataDialog.andCondition") }}</rvue-button>
      <p v-if="index !== matchRules.length - 1" class="or">
					{{ $t("linkDataDialog.orCondition") }}
			</p>
		</div>
		<rvue-button v-if="modeFlag && matchRules.length == 0" icon="el-icon-circle-plus" @click="addAndRule('flag')">{{ $t("linkDataDialog.andCondition") }}</rvue-button>
		<el-button style="margin-top:10px;" v-if="!modeFlag" icon="el-icon-circle-plus-outline" @click="addRules">{{ $t("linkDataDialog.or") }}</el-button>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, PropSync } from "vue-property-decorator";
	import RelationSelect from "../packages/condition/relationSelect.vue";
	import RelationCustom from "../packages/condition/relationCustom.vue";
  import TypeMap from '../packages/form/core/TypeMap'

	@Component({
		components: { RelationSelect, RelationCustom },
	})
	export default class RvueCondition extends Vue {
		@Prop({ type: Array, default: () => [] }) dic2!: any;
		@Prop({ type: Array, default: () => [] }) dic3!: any;
		@Prop({ type: Object, default: () => {} }) DIC!: any;
		@Prop({ type: String, default: "title2" }) title!: any;
		@Prop({ type: Boolean, default: false }) modeFlag!: boolean;

		@PropSync("matchRulesProp", { type: Array, default: () => [] }) matchRules!: any;

    private lang =this.$utils.getLocalStorage("lang")

    private typeMap = TypeMap

   @Watch('matchRules',{
     deep:true,
     immediate:true
   })
   matchRulesChange(val:any){
     if(val.length==0){
       this.addRules()
     }
   }

		private handleInput(val: any, rule: any, key: string) {
       this.$set(rule, key, val);
			 rule[key] = val;
			
		}
		private handleChangeSelect(column: any, rule: any, code: any) {
			//表格子组件添加表格id
			column.map((item: TJson) => {
				if (code == item.fieldId && item.parentSubFormTargetFieldCode) {
					rule["parentSubFormTargetFieldCode"] = item.parentSubFormTargetFieldCode;
				} else if (code == item.fieldId && !item.parentSubFormTargetFieldCode) {
					delete rule["parentSubFormTargetFieldCode"];
				}
			});

			rule["targetFieldCode"] = code;
      rule['targetFieldName'] = column.find((item:any)=>item.fieldId == code ).title[this.lang] 
      rule['parentSubFormTargetFieldCode']=''
			rule["judgeValues"] = [];
			let curItem = column.find((item: any) => rule["targetFieldCode"].includes(item.fieldId)) || {};
			rule.type = curItem.type || "";
			
		}

		private changModeList() {
			if (!this.modeFlag) {
				this.matchRules.length > 0 && this.matchRules.splice(1);
			}
		}

		private addAndRule(index: number | string) {
			if (index == "flag") {
				this.addRules();
			} else {
				this.matchRules[index].push({ dataType: 0, judgeValues: [], method: "", targetFieldCode: "", type: "" });
			}
		}
		private addRules() {
			this.matchRules.push([{ dataType: 0, judgeValues: [], method: "", targetFieldCode: "", type: "" }]);
		}
		private removeRule(index: number, i: number) {
			this.matchRules[index].splice(i, 1);

			if (this.matchRules[index].length == 0) {
				this.matchRules.splice(index, 1);
			}
			// if (this.validatenull(this.matchRules[index])) {
			// 	this.matchRules.splice(index, 1);
			// }
		}

	}
</script>

<style lang="scss" scoped>
  .or{
    margin-top: 10px;
    font-size: 18px;
  }
</style>
