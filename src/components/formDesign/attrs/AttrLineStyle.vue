<!--
* @FileDescription: 分割线组件的样式属性： 虚线，实线，粗线， 无线框
* @Author: MaoJianghui
* @Date: 2021-03-15
* Copyright © 2021. All rights reserved.
-->
<template>
    <div>
        <div class="attr-span">
            <rvue-label :tip="t('widgetConfig.attrLineStyleTip')" :label="t('global.lineStyle')" />
            <div class="group">
                <div v-for="item in options" 
                :key="item.value" 
                class="item line-center" 
                :class="[styleValue == item.value?'on':'']"  
                @click="toStyle(item.value)">
                    <!-- <div class="line-center" :class="'sep-line-'+item.value" :style="styleValue == item.value?'border-color:#fff;':'border-color:#989898;'">{{item.label}}</div> -->
                    <div class="line-center" 
                        :class="['sep-line-'+item.value, styleValue == item.value?'line-on':'line-off']">{{item.label}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {create} from "../utils/create";

const name = 'AttrLineStyle';

const OPTIONS = [
  
    {
        label:'',
        value:'thin'
    },
    {
        label:'',
        value:'thick'
    }, 
    {
        label:'',
        value:'dashed'
    },
    {
        label:'无',
        value:'none'
    }
]

const methods = {
    toStyle(v) {
        this.styleValue = v;
        this.data.lineStyle.lineType = v;
    }
    
}

export default create({
    name,
    methods,
    data(){
        return{
            options: OPTIONS,
            styleValue: "thin",
        }
    },
    created() {
        console.log("AttrLineStyle==>", this.data.lineStyle);
        if(!this.data.lineStyle) {
            this.data.lineStyle = {
                color:"#989898",
                lineType:"thin",
            }
        }
        this.styleValue = this.data.lineStyle.lineType;
    }
})
</script>
<style lang="scss" >
    .attr-span{
          label{
              display: block;
              font-size:14px;
              margin-bottom: 10px;
          }  
          .group{
              display:flex;
              border:1px solid #DCDFE6;
              border-radius: 4px;
              margin-bottom: 18px;
              overflow: hidden;
              .item{
                  flex:1;
                  text-align: center;
                  border-right:1px solid #DCDFE6;
                  font-size: 14px;
                  line-height:30px;
                  background:#fff;
                  cursor: pointer;
                  &:last-child{
                      border:none;
                  }
              }
              .on{
                  background: $color;
                  color:#fff;
              }
              .line-on{
                  border-color:#fff;
              }
              .line-off{
                  border-color:#989898;
              }

            .line-center {
                @include JustityAndFlexWrap(flex,center,center,null);
                width: 60%;
            }
          }
    }

.sep-line-none {
    border-top:none;
}

.sep-line-thin {
    border-top: 1px solid transparent;
}

.sep-line-thick {
    border-top: 2px solid transparent;
}

.sep-line-dashed {
    border-top: 1px dashed transparent;
}

</style>