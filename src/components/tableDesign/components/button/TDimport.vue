<template>
     <el-button type="primary" @click="handleImport" :size="size">{{$t('global.import')}}<i class="el-icon-upload2 el-icon--right"></i></el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from '../../core/BaseButton'

 @Component
 export default class TDimport extends TDButton {
     private handleImport(){
          this.$emit('add')
     }
 }
</script>

