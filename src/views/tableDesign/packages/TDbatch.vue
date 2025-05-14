<template>
     <el-button type="primary" @click="handleBatch">{{$t('global.batch')}}</el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from './TDButton'

 export default class TDbatch extends TDButton {
     private handleBatch(){
          this.$emit('add')
     }
 }
</script>

