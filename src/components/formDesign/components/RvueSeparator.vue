<!--
* @FileDescription: 分割线组件
* @Author: MaoJianghui
* @Date: 2021-03-18
* Copyright © 2021. All rights reserved.
-->
<template>
    <div>
        <div class="widget-width widget-height-0">
                <!-- <div :class="getSepLineStyle()" :style="{'border-color': item.lineColor}"></div> -->
                <div :class="getSepLineStyle()" :style="{borderColor: item.lineColor}"></div>
        </div>
    </div>
</template>

<script>

const name = 'RvueSeparator';

const computed = {
    // lineStyleCSSVal: function() {
    //     if(this.item.lineStyle === "thin") {
    //         return {
    //             "border-top": "1px dashed transparent",
    //         }
    //     } else if (this.item.lineStyle === "thick") {
    //         return {
    //             "border-top": "2px dashed transparent",
    //         }
    //     } else if (this.item.lineStyle === "dashed") {
    //         return {
    //             "border-top": "1px dashed transparent",
    //         }
    //     }
        
    // }
};

const watch = {

};

const methods = {

    getSepLineStyle: function() {
        console.log("[Rvue][getSepLineStyle]this.item.lineStyle==", this.item.lineStyle);
        let styleCss = "";
        switch(this.item.lineStyle) {
            case "thin":
                styleCss = this.$data.thin;
                break;
            case "thick":
                styleCss = this.$data.thick;
                break;
            case "dash":
                styleCss = this.$data.dash;
                break;
            case "none":
                styleCss = this.$data.none;
                break;
            default:
                styleCss = this.$data.thin;
                break;
        }
        return styleCss;
    }

};

/**
 * @param item
 * {
 *  lineStyle:"thin"
 *  lineColor:"#989898"
 * }
 */
export default {
    name,
    computed,
    watch,
    methods,
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
        params: {
            type: Object,
            default: () => {
                return {
                };
            },
        },
    },
    data(){
        return {
            thin:"sep-line-thin",
            thick:"sep-line-thick",
            dash:"sep-line-dash",
            none:"sep-line-none",
        }
    },
    created() {
        console.log("[Rvue][created]this.item.lineStyle==", this.item);
        // console.log("[Rvue][created]this.item.lineStyle==", this.props.item.lineStyle);
        if(!this.item.lineColor) {
            this.item.lineColor = "#989898";
        }

        if(!this.item.lineStyle) {
            this.item.lineStyle = "thin";
        } 
    }
}
</script>

<style>

.widget-width {
    max-width: 100%;
}

.widget-height-0 .line-height-0 {
    height: 0;
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

.sep-line-dash {
    border-top: 1px dashed transparent;
}

/* .line-color {
    border-color:rgb(163, 27, 102);
} */
    
</style>