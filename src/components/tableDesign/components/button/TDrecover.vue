<template>
     <el-button type="primary" @click="handleAdd" :size="size">{{$t('tableDesign.recover')}}</el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from '../../core/BaseButton'

 @Component
 export default class TDRecover extends TDButton {
     private handleAdd(){
          this.$emit('add')
     }
 }
</script>

