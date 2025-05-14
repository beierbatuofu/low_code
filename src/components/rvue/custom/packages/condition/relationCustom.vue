<!--
 * @Author: ben
 * @LastEditTime: 2021-08-19 15:27:31
-->
<template>
	<div>
		<rvue-input v-if="!column.type" :disabled="false" v-model="value"></rvue-input>
		<component
			v-else
			:isInTable="false"
			@input="handleUpdate"
			@blur="handleUpdate"
			:form="form"
			:prop="prop"
			@change="handleUpdate"
			@update="handleUpdate"
			:is="getComponent(column.type, column.component)"
			:config="column"
			:allReadonly="false"
		>
		</component>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, PropSync } from "vue-property-decorator";

	@Component
	export default class RelationInput extends Vue {
		@Prop({ type: String, default: "" }) placeholder!: string;
		@Prop({ type: [Array], default: () => [] }) val!: any;
		@Prop({ type: Object, default: () => ({}) }) filterData!: TJson;
		@Prop({ type: Array, default: () => [] }) dic!: any[];

		private value: any = "";
		private form: TJson = {};
		private prop = "";
		private key = 1;

		@Watch("filterData.method")
		onChangeMethod() {
			if (this.filterData.type == "creater") {
				this.filterData.judgeValues = [];
			}
		}
		private getComponent(type: any, component: any) {
			if (!type) return;
			if (component) return component;
			if (type == "create_time" || type == "update_time") {
				return `rfield-datetime`;
			} else if (type == "creater") {
				if (this.filterData.method == "contain_one") return `rfield-user`;
				return `rfield-userRadio`;
			} else if (type == "process_status") {
				return `rfield-select`;
			} else if (type == "radio") {
				return `rfield-select`;
			} else if (type == "checkbox") {
				return `rfield-selectMulti`;
			} else if (type == "uploadFile") {
				return ``;
			}

			return `rfield-${type}`;
		}

		private converType(type: string, value: any) {
			switch (type) {
				case "String":
					return String(value);
        case "Number":
          return value;
				case "Array":
					return Array.isArray(value) ? value : [];
			}

			return value;
		}

    private config:any = {}
    private method:string = ''
    private type:string = ''

		private get column() {
			try {
        	let sType = Object.prototype.toString.call(this.config.value?.custom || this.config.defVal).slice(8, -1);
				if (this.type == "number" ) {
          // debugger
          if(this.method =='between'){
            this.config.defVal =this.converType(sType, this.val);
            this.config.defVal = {
						"0": this.config.defVal[0] && !isNaN(this.config.defVal[0][0])  ? this.config.defVal[0][0] : "undefined",
						"1": this.config.defVal[0] && !isNaN(this.config.defVal[0][1])? this.config.defVal[0][1] : "undefined",
					 };
          }else if(this.method !=='between'){
            this.config.defVal = this.val
            if(this.config.defVal&&!isNaN(this.config.defVal)){
              this.config.defVal = this.config.defVal
              //  
            }else {
              this.config.defVal = 'undefined'
            }
          }
			  }else if (this.type == "selectMulti" || (this.type == "datetime")) {
					this.config.defVal = this.converType("Array", this.val);
				}else{
          	// let sType = Object.prototype.toString.call(this.config.value?.custom || this.config.defVal).slice(8, -1);
            this.config.defVal = this.converType(sType, this.val);
        }
        console.log(this.config,'this.config');
        
				this.config.edit = true;
				return this.config;
			} catch (err) {
				return {};
			}
		}

    protected mounted() {
      let { targetFieldCode, method, type } = this.filterData;
				 this.config = (<any>this).$utils.deepClone(
					this.dic.find((conf) => {
						let key = "fieldId";
						return conf[key] == targetFieldCode;
					}) || {}
				);
        this.prop = targetFieldCode;
        this.method = method
        this.type = type
    }

		private handleUpdate(context: any, value: any) {
      // debugger
      let val:any = ''
      if(value?.isTrusted){
        val = context
      }else{
        val = value
      }
			this.$emit("input", Array.isArray(val) ? val : [val]);
		}
	}
</script>
<style lang="scss">
	.code-error {
		.el-input__inner {
			border-color: red;
		}
	}
</style>
