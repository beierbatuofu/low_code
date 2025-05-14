

<template>

       
        <el-input v-model="value" :type="type" placeholder="请输入内容"></el-input>

</template>
<script lang="ts">
 import {  Component ,Watch, Prop , Vue} from "vue-property-decorator";

 @Component
 export default class DTinput extends Vue {
    @Prop({type:Object,default:()=>({})}) config!:TJson 
    @Prop({type:String,default:"text"}) type!:string;

    private get value(){
        return (<any>this).config.defaultValue;
    }


    private set value(val:string|number) {
        this.$emit('change',val)
    }
    

 }
</script>
<style lang="scss">
    .TD-attr-style{

    }
</style>

