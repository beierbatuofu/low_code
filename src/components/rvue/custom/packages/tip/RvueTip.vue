
<template>
    <div class="rvue-tip" v-if="content">   
        <el-tooltip class="item" :effect="effect" :placement="placement">
                 <i class="custom-icon-question-circle-o" />
                 <div slot="content">{{content}}</div>
        </el-tooltip>
    </div>    
</template>
<script>

const props = {
    effect:{
        type:String,
        default:'dark'
    },
    content:{
        type:String,
        default:''
    },
    placement:{
        type:String,
        default:'top-start'
    }
}

export default {
    props
}
</script>
<style lang="scss" scoped>
    .rvue-tip{
        display: inline-block;
        .custom-icon-question-circle-o{
            font-size:14px;
            color:#999;
            @include VertivalAlign(inline-block,top,null,14px)
        }
      
    }
      .el-tooltip__popper.is-dark{
            width: 200px!important;
            text-align: justify;
        }
</style>

