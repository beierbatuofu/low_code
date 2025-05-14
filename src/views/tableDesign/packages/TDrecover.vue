<template>
     <el-button type="primary" @click="handleAdd">{{$t('global.recover')}}</el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from './TDButton'

 export default class TDRecover extends TDButton {
     private handleAdd(){
          this.$emit('add')
     }
 }
</script>

