

<template>
     <el-button type="primary" @click="handleExport" :size="size">{{$t('global.export')}}<i class="el-icon-download el-icon--right"></i></el-button>
</template>
<script lang="ts">
 import {  Component ,Watch, Prop} from "vue-property-decorator";
 import TDButton from '../../core/BaseButton'

 @Component
 export default class TDexport extends TDButton {
     private handleExport(){
          this.$emit('add')
     }
 }
</script>

