<!--
 * @Author: ben
 * @LastEditTime: 2022-01-04 16:27:20
-->
<template>
    <div class="widget-config-group">
        <rvue-label
			:label="t('widgetConfig.attrTextRange')"
			style="margin-right: 10px"
			:tip="t('widgetConfig.attrTextRangeTip')"
		/>
		<br />
        <el-checkbox :label="t('widgetConf.textRange.limitTextRange')" v-model="isLimit"></el-checkbox>
        <div class="attrconf-nowrap margin-left-10" v-if="isLimit" >
          
           
          <rvue-number-range @blur="timestamp++" :key="timestamp" v-model="aNum" :min="ext.textRange.min" :max="ext.textRange.max" style="width:100%;"></rvue-number-range>
         
        </div>
        </div>
    </div>    
</template>
<script>
import {create} from '../utils/create';
import {widgetLimit} from '../commons/defaultValue'

const computed = {
    aNum:{
        get(){
            return [
                this.data.textRange.min,
                this.data.textRange.max
            ]
        },
        set(n){
            this.$set(this.data.textRange,'min',n[0])
            this.$set(this.data.textRange,'max',n[1])
         
        }
    },
    isLimit:{
        get(){
            try{
                 return this.data.textRange.enable
            }catch{
                return true;
            }
        },
        set(b){

            this.data.textRange.min = 'undefined';
            this.data.textRange.max = 'undefined';
            this.data.textRange.enable = b;
        }
    }
}



export default create({
    name: 'AttrTextRange',
    computed,
    data(){
        return{
           timestamp:1
        }
    }
})
</script>
<style lang="scss" scoped>
    .attrconf-nowrap{
        display: flex;
        align-items: center;
    }
</style>

