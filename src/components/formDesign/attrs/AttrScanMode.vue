<template>
    <div class="widget-config-group">
        <div class="widget-config-label">
             <el-checkbox v-model="checked">
                 {{t('global.scanMode')}}
                 <rvue-tip :content="t('widgetConfig.attrScanMode')" />
             </el-checkbox>
        </div>
        <div v-if="checked">
            <el-radio v-model="value" label="qrcode">{{t('global.qrcode')}}</el-radio>
            <el-radio v-model="value" label="barcode">{{t('global.barcode')}}</el-radio>
        </div>
    </div>
</template>
<script>
import {create} from '../utils/create';

const name = 'AttrScanMode';

const KEY = 'scanmode';

const computed = {
    value:{
        set(val){
            this.$set(this.data,KEY,val)
        },
        get(){
            !this.data.mode && this.$set(this.data,KEY,'qrcode')
             return this.data.mode
        }
    }
}


export default create({
    computed,
    data(){
        return {
            checked:false
        }
    },
    created(){
        this.checked = !!this.data.mode;
    }
})
</script>
