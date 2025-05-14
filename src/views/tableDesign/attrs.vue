<template>
	<div class="TD-attr">
		<el-tabs type="card" v-model="activeName"  style="margin-right: 10px">
			<el-tab-pane label="基础属性" name="first">
				<div class="TD-attr-group" v-for="(item, index) in attrs" :key="index">
					<component
						:key="index"
						:is="item"
						@setTabHeader="setTabHeader"
						:config="attrList"
						@pageSelectChange="pageSelectChange"
						@confChange="confChange"
						:ext="ext"
						:mode="'attr'"
						:getTabTitleList="getTabTitleList"
					/>
				</div>
			</el-tab-pane>
			<el-tab-pane label="列表属性" name="second">
        <div>
          <label class="ql-label">标题为:</label>
			  	<rvue-input placeholder="请输入列表设计名称" v-model="rightList.name" :disabled="isCustom"></rvue-input>
        </div>
        <div v-if="!isCustom" class="mar-top">
          <label class="ql-label">选择角色组</label>
          <rvue-select placeholder="请选择角色组" value-key="id" v-model="selectRoleList" multiple @change="selectRoleListChange" >
            <el-option v-for="item in roleArray" :key="item.id" :label="item.name" :value="item"></el-option>
          </rvue-select>
        </div>
        <div class="mar-top">
          <rvue-checkbox v-model="checked" style="width:200px">仅发起流程</rvue-checkbox>
        </div>

			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";


	@Component
	export default class TDConfig extends Vue {
		@Prop({
			type: Object,
			default: () => {},
		})
		attrList!: object;

		@Prop({
			type: Boolean,
			default: true,
		})
		isProcess!: boolean; //是否为流程表单

		@Prop({
			type: Array,
			default: () => [],
		})
		getTabTitleList!: any[];

		@Prop({
			type: Boolean,
			default: false,
		})
		toggle!: boolean;

    @Prop({
			type: Boolean,
			default: false,
		})
		isCustom!: boolean;
    

		@Prop({
			type: Array,
			default: () => [],
		})
		authList!: any[];

  	@Prop({
			type: Array,
			default: () => [],
		})
		roleList!: any[];


		@Prop({
			type: Object,
			default: {},
		})
		rightList!: any;

		private config: TJson = {}; //attr 对应的配置项
		private attrs = [];
		private oFiled: any = {};
		private ext: any = {};
		private activeName: any = "first";
		// private authVal: string = "";
		private isGuest: boolean = false;
    private checked:boolean= true
    private selectRoleList:any = []
    private roleArray:[]=[]

		@Watch("attrList", {
			immediate: true,
			deep: true,
		})
		onChangeAttrList(val: any) {
			//返回TDtableSet组件
			if (val.type == "tableSet") {
				(<any>this).attrs = ["TDtableSet"];
				return;
			}
			this.oFiled = val.type && val.title ? (<any>RfieldCore.ins()).fieldConsMap[val.type].fieldDef.ins() : {};

			(<any>this).attrs = this.oFiled.QueryConf?.fieldSort;
			this.ext = this.oFiled.ext ? this.oFiled.ext : {};
		}

		@Watch("toggle", {
			immediate: true,
			deep: true,
		})
		onChangeActiveName(val: any) {
			this.activeName = "first";
		}

    @Watch("roleList", {
			immediate: true,
			deep: true,
		})
		onChangeroleList(val: any) {
			this.roleArray = val.map((item:any)=>{
        let obj = {
          name:item.name,
          type:item.type,
          id:item.id
        }
        return obj
      })
      
      let arr = this.selectRoleList?.map((item:any)=>item?.id)
      this.selectRoleList = this.roleArray.filter((item:any)=>arr.includes(item.id))
		}

		@Watch("getTabTitleList", {
			immediate: true,
			deep: true,
		})
		onChangeGetTabTitleList(val: any) {
			this.selectDataSet();
		}

  	@Watch('rightList',{
      immediate: true,
			deep: true,
    })
    onChangeRightList(val:any){
      if (val.type == "9" || val.type == "8") {
				this.isGuest = true;
			}
      this.selectRoleList= val.perms || []
    }



    private selectRoleListChange(val:any){
     this.rightList.perms = val
    }


		private confChange(val: any) {
			this.attrList = val;
			this.$emit("confChange", val);
		}

		private setTabHeader(val: any) {
			this.$emit("setTabHeader", val);
		}

		private pageSelectChange(val: any) {
			this.$emit("pageSelectChange", val);
		}

		private selectDataSet() {
			if ((<any>this).attrList.type == "tableSet") {
				(<any>this).attrList.sortOptions = this.isProcess
					? [
							{
								label: "流程状态",
								value: "process_status",
							},
							{
								label: "提交人",
								value: "creater",
							},
							{
								label: "提交时间",
								value: "create_time",
							},
					  ]
					: [
							{
								label: "提交人",
								value: "creater",
							},
							{
								label: "提交时间",
								value: "create_time",
							},
							{
								label: "更新时间",
								value: "update_time",
							},
					  ];

				this.getTabTitleList.forEach((item: any) => {
					if (
						item.type == "input" ||
						item.type == "radio" ||
						item.type == "number" ||
						item.type == "select" ||
						item.type == "datetime" ||
						item.type == "deptRadio" ||
						item.type == "userRadio"
					) {
						let obj: any = {};
						obj.label = item.title.zh;
						obj.value = item.fieldId;
						(<any>this).attrList.sortOptions.push(obj);
					}
				});
				let flag = (<any>this).attrList.sortOptions.find((item: any) => item.value == (<any>this).attrList.sortCondition);
				if (!flag) {
					(<any>this).attrList.sortCondition = "";
				}
			}
		}




	}
</script>
<style lang="scss">
	.el-tabs__nav {
		width: 100% !important;
	}
	#tab-first,
	#tab-second {
		width: 50% !important;
		text-align: center;
	}
	.el-tabs__content {
		margin-top: 10px;
	}
	#tab-first.is-active,
	#tab-second.is-active {
		background: #6087fd;
		color: #fff;
	}
  .mar-top{
    margin-top: 10px;;
  }
</style>
