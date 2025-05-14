<!--
* @FileDescription: AttrFormID
* @Author: MaoJianghui
* @Date: 2021-03-10
* Copyright © 2021. All rights reserved.
-->
<template>
    <div>
        <el-form-item label="表单ID">
            <el-input v-model="formId" :disabled='true'></el-input>
        </el-form-item>
        
    </div>
</template>

<!--
* @Description: 接收父组件中传递的 'formId'字段
-->
<script>
import {create} from '../utils/create';

const name = 'AttrFormId';

export default create({
    name,
    props:['formId'],

})
</script>

<style>
    
</style>