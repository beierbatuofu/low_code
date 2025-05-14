<template>
    <el-upload ref="elUpload"
               :action="action"
               :headers="headers"
               :multiple="multiple"
               :data="data"
               :name="name"
               :with-credentials="withCredentials"
               :show-file-list="showFileList"
               :drag="drag"
               :accept="accept"
               :list-type="listType"
               :auto-upload="autoUpload"
               :file-list="fileList"
               :disabled="disabled"
               :limit="limit"
               @preview="handlePreview"
               @remove="handleRemove"
               @success="handleSuccess"
    >
        <slot></slot>
    </el-upload>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
declare type TListType="text" | "picture" | "picture-card";
export interface TRvueUpload extends Vue {
    clearFiles:() => any;
    abort:(flie:object)=>any;
    submit:()=>any;
} 

@Component({})

class RvueUpload extends Vue implements TRvueUpload {
	public static install: (param: Vue) => any;
	public static compName = "rvue-upload";
    @Prop({ type: String }) action!:string;
    @Prop({ type: Object }) headers!:object;
    @Prop({ type: Boolean }) multiple!:boolean;
    @Prop({ type: Object }) data!:object;
    @Prop({ type: String, default: "file" }) name!:string;
    @Prop({ type: Boolean, default: false }) withCredentials!:boolean;
    @Prop({ type: Boolean, default: true }) showFileList!:boolean;
    @Prop({ type: Boolean, default: false }) drag!:boolean;
    @Prop({ type: String }) accept!:string;
    @Prop({ type: String, default: "text" }) listType!:TListType;
    @Prop({ type: Boolean, default: true }) autoUpload!:boolean;
    @Prop({ type: Array, default: [] }) fileList!:[];
    @Prop({ type: Boolean, default: false }) disabled!:boolean;
    @Prop({ type: Number }) limit!:number;

    public clearFiles(){
        return (<TRvueUpload>this.$refs.elUpload).clearFiles();
    }
    public abort(flie:object){
        return (<TRvueUpload>this.$refs.elUpload).abort(flie);
    }
    public submit(){
        return (<TRvueUpload>this.$refs.elUpload).submit();
    }

    private handlePreview(file:any){
        this.$emit("preview",file)
    }

    private handleRemove(file: any, fileList: []){
        this.$emit("remove", file, fileList)
    }

    private handleSuccess(response:any, file: any, fileList: []){
        this.$emit("success",response, file, fileList)
    }

    private handleError(err:any, file: any, fileList: []){
        this.$emit("success", err, file, fileList)
    }

    private handleProgress(event:any, file: any, fileList: []){
        this.$emit("progress", event, file, fileList)
    }

    private handleChange( file: any, fileList: []){
        this.$emit("change", file, fileList)
    }

    private handleExceed( files: any, fileList: []){
        this.$emit("exceed", files, fileList)
    }

}
RvueUpload.install = function (Vue: any) {
	Vue.component(RvueUpload.compName, RvueUpload);
};
export default RvueUpload;
</script>