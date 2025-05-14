<!--
 * @Author: your name
 * @Date: 2021-04-14 17:31:25
 * @LastEditTime: 2021-04-16 13:11:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /code-zero-ui/src/components/tableDesign/packages/button/TDbatch.vue
-->
<template>
     <el-button type="primary" @click="handleBatch" :size="size">{{$t('global.batch')}}</el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from '../../core/BaseButton'

 @Component
 export default class TDbatch extends TDButton {
     private handleBatch(){
          this.$emit('add')
     }
 }
</script>

