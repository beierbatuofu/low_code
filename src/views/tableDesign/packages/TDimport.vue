<template>
     <el-button type="primary" @click="handleImport">{{$t('global.import')}}<i class="el-icon-upload2 el-icon--right"></i></el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from './TDButton'

 export default class TDimport extends TDButton {
     private handleImport(){
          this.$emit('add')
     }
 }
</script>

