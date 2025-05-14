<template>
     <el-button type="primary" @click="handleDel" :size="size">{{$t('global.deletion')}}</el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from '../../core/BaseButton'

 @Component
 export default class TDdelete extends TDButton {
     private handleDel(){
          this.$emit('add')
     }
 }
</script>