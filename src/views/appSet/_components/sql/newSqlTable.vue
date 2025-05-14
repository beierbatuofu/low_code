<template>
	<div class="sql-table">
    <el-table :data="tableData" border stripe style="width: 100%" >
      <el-table-column v-for="item in tableTitle" :key="item.fieldId" :prop="item.fieldId" :render-header="(h, obj) => renderHeader(h, obj, item)" :label="item | getLang" align="center">
        <el-table-column  :prop="item.fieldId" min-width="200" :render-header="(h, obj) => renderTypeHeader(h, obj, item)" align="center">
          <template v-slot:default="scope">
          <div v-if="filterArray(scope.row[item.fieldId])">
            <span v-for="(item, index) in JSON.parse(scope.row[item.fieldId])" :key="index">
              {{ item.name ? item.name : item }}
            </span>
          </div>
          <div v-else>{{ scope.row[item.fieldId] | processStatus(item.type) | filAddress(scope.row[item.fieldId])}}</div>
        </template>
        </el-table-column>
      </el-table-column>
    </el-table>
	</div>
</template>

<script lang="tsx">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";

	@Component({
		filters: {
			processStatus: (val: any, type: string) => {
				if (type != "process_status") return val;
				switch (val) {
					case 1:
						return "进行中";
					case 9:
						return "流转完成";
					case 8:
						return "强制结束";
					default:
						return val;
				}
			},
      filAddress:(val: any, type: string)=>{
       try{  
          let address = JSON.parse(type);
           
          if (address && address.hasOwnProperty("city")) {
            return address.province + address.district + address.city + address.detail;
          }else{
            return val;
          }
        }catch(e){
          return val;
        }
      }
		},
	})
	export default class sqlTable extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) params!: any;
		@Prop({ type: Object, default: () => {} }) parOldMapObj!: any;

		private dialogVisible = false;
		private tableTitle: any = [];
		private allKeys: any = {};
		private tableData: any[] = [];

    private eidtFlag =''
    private eidtName =''

		private originType = "1623057706432_91012";
		private fieldType = "";
		private originName = "";
		private fieldName = "";
		private fieldId = "";
		private typeOptions: any = [
			{
				label: "单行文本",
				value: "input",
			},
			{
				label: "多行文本",
				value: "textarea",
			},
			{
				label: "数字",
				value: "number",
			},
			{
				label: "日期时间",
				value: "datetime",
			},
			{
				label: "成员单选",
				value: "userRadio",
			},
			{
				label: "成员多选",
				value: "user",
			},
			{
				label: "部门单选",
				value: "deptRadio",
			},
			{
				label: "部门多选",
				value: "dept",
			},
			{
				label: "下拉单选框",
				value: "select",
			},
			{
				label: "单选按钮组",
				value: "radio",
			},
			{
				label: "下拉复选框",
				value: "selectMulti",
			},
			{
				label: "复选按钮组",
				value: "checkbox",
			},
      {
				label: "地址",
				value: "address",
			},
      {
				label: "附件",
				value: "uploadFile",
			},
      {
				label: "提交人",
				value: "creater",
			}
		];
    private displayFlag:boolean = false
    private sameFlag:boolean = false
    private sameArr:string[] = []
    private checkId:string = ''
    private newMapObj:any = {}
    private oldMapObj:any = {}

    @Watch("params",{
      immediate: true,
			deep: true,
    })
    paramsChange(val:any){
      this.displayFlag = val.flag
      this.sameFlag = val.same
      this.sameArr = val.sameArr?val.sameArr:[]
    }

    @Watch("data", {
			immediate: true,
			deep: true,
		})
    dataChange(val:any){
			let that = this;
			that.tableTitle = [];
			that.tableData = [];
			val.datasetData?.forEach((item: any, index: number) => {
				let obj: any = {};
				for (const key in item) {
					obj = {
						...obj,
						...item[key],
					};
				}

				that.tableData.push(obj);
			});

   
      // for (const key in val.columnField) {
      //   val.columnField[key].forEach((item:any)=>{
      //     let newFieldIds =  item.fieldId
      //     let newFieldIdAsNames =  item.fieldIdAsName
      //      let tdemo:any = {}
      //      tdemo.title = {
			// 			zh: newFieldIdAsNames,
			// 			en: newFieldIdAsNames,
			// 		};
			// 		tdemo.type = "";
			// 		tdemo.oldTitle = {
			// 			zh: newFieldIdAsNames,
			// 			en: newFieldIdAsNames,
			// 		};
      //     tdemo.fieldId = newFieldIds
		  // 		tdemo.fieldIdAsName = newFieldIdAsNames
      //     that.tableTitle.push(tdemo);
      //   })
      //   console.log(that.tableTitle,44444444);
      // }
 
      

      let filterArr: any = [];
      val.defaultColumnField?.forEach((item: any) => {
				let obj: any = {};
				let object: any = {};
        let newFieldId
        let newFieldIdAsName 
				if (item.fieldId.indexOf(".") > -1 || item.fieldId.indexOf("`") > -1) {
           newFieldId = item.fieldId.indexOf("`") > -1 ? item.fieldId : item.fieldId.split(".", -1)[1];
           newFieldIdAsName =  item.fieldId.indexOf("`") > -1 ? item.fieldIdAsName : item.fieldIdAsName.split(".", -1)[1];
					
				}else{
           newFieldId = item.fieldId
           newFieldIdAsName =  item.fieldIdAsName
        }
        object.title = {
						zh: newFieldIdAsName,
						en: newFieldIdAsName,
					};
					object.type = "";
					object.oldTitle = {
						zh: newFieldIdAsName,
						en: newFieldIdAsName,
					};
					// object.oldType = item.type || "input";
					object.fieldId = newFieldId
		  		object.fieldIdAsName = newFieldIdAsName
					that.tableTitle.push(object);
      })
       that.tableTitle.forEach((item:any)=>{
        this.newMapObj[`${item.fieldId+item.fieldIdAsName}`] = item.type
      })

      this.$emit("newMapObj", this.newMapObj);

      if(Object.keys(this.parOldMapObj).length>0){
        for (let newKey in this.newMapObj) {
          for (let oldKey in this.parOldMapObj) {
            if(newKey==oldKey){
              this.newMapObj[newKey] = this.parOldMapObj[oldKey]
            }
          }
        }
      }


      that.tableTitle.forEach((item:any)=>{
        if(this.newMapObj.hasOwnProperty(`${item.fieldId+item.fieldIdAsName}`)){
          item.type = this.newMapObj[`${item.fieldId+item.fieldIdAsName}`]
        }
      })
    }

		@Watch("tableTitle", {
			immediate: true,
			deep: true,
		})
		tableTitleChange(val: any) { 
      this.$emit("change", val); 
     
		}

		private filterArray(val: any) {
			try {
				if (Array.isArray(JSON.parse(val)) || Array.isArray(val)) {
					return true;
				} else {
					return false;
				}
			} catch (err) {
				return false;
			}
		}

		private renderHeader(h: any, { column }: any, val: any) {
			return (
        <div>
           <div>
            {
              // val.title.zh == this.eidtFlag && this.checkId == column.id ?
              // <el-input 
              //   value = {this.eidtName}
              //   onBlur={(info:string)=>{this.eidtFn(info,val)}} 
              //   onInput={(info:string)=>this.eidtName = info}
              // > 
              // <el-button slot="append" icon="el-icon-check" width="26px" onClick={(info:string)=>{this.eidtFn(info,val)}}></el-button>
              // </el-input>
              //  :	 
              //  <div>
              //   <span>{column.label}</span>
              //   <i class="el-icon-edit-outline" style="color:#6087FD;margin-left:5px;" onClick={() => this.columnEdit(val,column)}>
              //   </i>
              // </div>
               <span>{column.label}</span>
            }
            </div>
            <div>
            {this.sameArr.some((item:string)=>item == val.fieldIdAsName) && this.sameFlag?<div style={{display: this.sameArr.some((item:string)=>item == val.fieldIdAsName) && this.sameFlag?'block':'none',color:'red', fontSize:'12px',lineHeight:"20px"}}>字段名称不能相同</div>:<div style="height:0px"></div>}
            </div>
        </div>
       
        
			);
		}

    	private renderTypeHeader(h: any, { column }: any, val: any) {
			return (
				<div>
           <rvue-select 
            value={val.type}
            onChange={(type:any) =>this.selectChang(type,val) }
            >
              {this.typeOptions.map((item:any)=>{
                return <el-option key="item.value" props={{label: item.label,value: item.value}}></el-option>
              })}
            </rvue-select>
            {val.type =='' && this.displayFlag?<div style={{display: val.type =='' && this.displayFlag?'block':'none',color:'red', fontSize:'12px',height:"20px"}}>请指定类型</div>:<div style="height:20px"></div>}
            
				</div>
			);
		}

    private selectChang(type:string,val:any){
      val.type = type
      this.newMapObj[`${val.fieldId+val.fieldIdAsName}`] = val.type
      this.$emit("newMapObj", this.newMapObj);
    }

    private columnEdit(val:any,column:any){
      this.eidtFlag = val.title.zh
      this.eidtName = val.title.zh
      this.checkId = column.id
    }

    private eidtFn(info:string,val:any){
      this.eidtFlag = ''
      this.checkId = ''
      val.fieldIdAsName = this.eidtName
      val.title.zh = this.eidtName
      val.title.en = this.eidtName
    }


		protected created() {}
	}
</script>

<style lang="scss" scoped>
	.propItem {
		margin-bottom: 20px;
		text-align: center;
		.defaultProp {
			width: 217px;
			height: 40px;
			line-height: 40px;
			border: 1px solid #e4e7ed;
			display: inline-block;
			vertical-align: middle;
			text-align: left;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			padding: 0 30px;
			background-color: #f5f7fa;
			color: #c0c4cc;
			cursor: not-allowed;
		}
		.widget-config-label {
			margin-right: 40px;
		}
	}

	::v-deep.el-table {
		overflow: auto;
		.el-table__row {
			td {
				.cell {
					min-height: 23px;
					div {
						text-overflow: ellipsis !important;
						white-space: nowrap !important;
						overflow: hidden;
					}
				}
			}
    
		}
    th{
    .cell{
        // white-space:nowrap !important;
        // text-overflow:ellipsis;
        // word-break:break-all;
        span{
          display: inline-block;
          max-width: auto;
          white-space:nowrap !important;
          overflow: hidden;
          text-overflow:ellipsis;
          word-break:break-all;
          vertical-align: text-bottom;
        }
      }
    } 
	}
</style>
