<template>
	<div class="form-edit">
		<m-header style="margin-bottom: 5px">
			<div>
				<i @click="handleReturn" class="el-icon-arrow-left" style="color: #ccc; font-size: 26px; cursor: pointer"></i>
				<div :content="$l('global.rename')" placement="bottom">
					<span class="header-app-name" style="width: 274px">{{ name }}</span>
				</div>
			</div>
			<template v-slot:center>
				<rvue-tabs :value="tabValue" @tab-click="handleClick">
					<template v-for="(item, index) in tabsList">
						<rvue-tab-pane v-if="formType == item.formType || !item.formType" :key="index" :label="item.label" :name="item.name"> </rvue-tab-pane>
					</template>
				</rvue-tabs>
			</template>
		</m-header>
		<router-view :callbacks="callbacks" :key="$route.params.id"></router-view>
	</div>
</template>

<script lang="js">
	import Vue from 'vue'
	import MHeader from '@/components/m-header/m-header.vue'
	import { FormModule } from '@/store/modules/form';
	import { updateFormName,getFormSingle } from '@/api/form';
	import { refreshJump } from "@/utils/global";

	export default Vue.extend({
	       name: 'Form',
	       components: {
	       MHeader
	       },
	    //    watch:{
	    //        $route:function(){
	    //           window.onbeforeunload = function (e) {
	    //               let dialogText = "";
	    //               e.returnValue = dialogText;
	    //               return dialogText;
	    //        };
	    //        }
	    //    },

	       data() {
	       return {

	       callbacks:{
	               tab:cb=>cb()
	           },
	       activeName: 'first',
	       inputVisible: false,
	       inputValue: '',
	           tabsList:[
	               {
	                   name:'form_design',
	                   label:this.$t("Mheader.formDesign"),
	                   path:function(){
	                          return `/${this.$route.params.tenantId}/appd/${this.appCode}/p/form/${this.formCode}/form_design`
	                       },


	               },
	               {
	                   name:'flow_design',
	                   label:this.$t("Mheader.processDesign"),
	                   path:function(){
	                          return `/${this.$route.params.tenantId}/appd/${this.appCode}/p/form/${this.formCode}/flow_design`

	                       },
	                   formType:'F'

	               },
	               {
	                   name:'list_design',
	                   label:this.$t("Mheader.tableDesign"),
	                   path:function(){
	                           return `/${this.$route.params.tenantId}/appd/${this.appCode}/p/form/${this.formCode}/list_design`
	                       },

	               },
				   {
	                   name:'data_management',
	                   label:this.$t("Mheader.dataManagement"),
	                   path:function(){
	                   return `/${this.$route.params.tenantId}/appd/${this.appCode}/p/form/${this.formCode}/data_management`
	                     },

	                 }
	           ]
	       };
	       },
	       created(){
	        //    getFormSingle(this.$route.params.appCode, this.$route.params.id).then((res) => {
	        //            const { structure, name } = res.data;
	        //            FormModule.setForm({
	        //                name,
	        //                appCode: this.$route.params.appCode,
	        //                formCode: this.$route.params.Code,
	        //                curFormType: res.data.type,
	        //                options: { configList: structure ? structure.column || structure.configList : [] },
	        //            });
	        //        })
	       },
	       computed: {
	       tabValue() {

	               return this.$route.path.split('/').pop();
	           // return this.$route.path.indexOf('form-publish') > -1?'form-publish':this.$route.path.indexOf('form-data') > -1?'form-data':this.$route.path.indexOf('form-flow') > -1?'form-flow':'first'
	       },
	       name() {
	           return FormModule.curFormName
	       },
	       appCode() {
	           return this.$route.params.appCode
	       },
	       formCode() {
	           return this.$route.params.id
	       },
	       formType() {
	              console.log(FormModule.form,'FormModule.form.type')
	           return FormModule.form.curFormType || "";
	       }
	       },
		   mounted() {
			let fullPath = this.$route.fullPath;
			let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd/"));
			let jumpPath=supPath+'appd/'+this.$route.params.appCode+'/p/';

	           getFormSingle(this.$route.params.appCode, this.$route.params.id).then(resp=>{
	                   const { structure, name, type } = resp.data;
	                       FormModule.setForm({
	                           options: structure,
	                           name,
	                           type,
	                           curFormType: type,
	                       });



	                          if(!["C","F"].includes(resp.data.type)){

	                              this.$router.push('/not_permission')
	                          }

	               })

	          //refreshJump(fullPath, this, jumpPath);
		},
		destroyed() {
			window.onbeforeunload = null;
			window.onpopstate = null;
		},
	       methods: {
	           handleReturn(){
				   if(this.tabValue=='data_management'){
	                       this.$router.push({
	                           path: `/${this.$route.params.tenantId}/appd/${this.appCode}/p/`,
	                           replace:true
	                       })
				   }else{
					    this.callbacks?.tab(()=>{
	                       this.$router.push({
	                           path: `/${this.$route.params.tenantId}/appd/${this.appCode}/p/`,
	                           replace:true
	                       })
	                   });
				   }


	           },

	       handleClick({name}) {
	               const curItem = this.tabsList.find(item=>item.name == name);
	               const path = curItem.path.call(this);

					  if(this.tabValue!='data_management'){
						   this.callbacks?.tab(()=>{
	                       	 this.$router.push({ path });
	                   });
					  }else{
						 this.$router.push({ path});
					  }



	       },
	       showInput() {
	       this.inputVisible = true;
	       this.inputValue = this.name;
	       this.$nextTick(_ => {
	           this.$refs.inputRef.$refs.input.focus();
	       });
	       },
	       handleInputConfirm() {
	       const inputValue = this.inputValue;
	       if (inputValue && inputValue !== this.name) {
	           //   save

	           updateFormName(this.appCode, this.formCode, {
	               name: this.inputValue
	           }).then(res=> {
	               if(res.data) {
	                   FormModule.setForm({name: inputValue});
	                   this.$message({
	                       message: '修改成功！',
	                       type: 'success'
	                   });
	               }
	           })
	       }
	       this.inputVisible = false;
	       this.inputValue = '';
	       }
	       }
	})
</script>
<style scoped>
	.cur-name {
		margin-left: 20px;
		padding-bottom: 2px;
		color: #fff;
		border-bottom: 1px dashed #fff;
	}
	.el-tabs__header {
		margin-bottom: 0 !important;
	}
	.form-edit {
		height: 100vh;
		overflow: hidden;
		background: #eff4f7;
	}

	.el-tabs__item {
		padding: 0 !important;
	}
</style>
