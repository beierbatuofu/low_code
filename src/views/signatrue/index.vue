<template>
    <div class="wap">
        <div class="wap-finish" v-if="finish">
            发送成功
        </div>
        <div v-else v-loading="loading" class="wap-signature" :class="isVertical ? 'wap-signature__vertical' : 'wap-signature__across'">
            <div class="wap-signature-board" ref="signnatrueBoard">
                <signatrue-component ref="signatureRef" :size="size"></signatrue-component>
            </div>
            <div class="wap-signature-maintain">
                <template v-for="(button, key) in buttons">
                    <div class="wap-signature-maintain-button" :key="key" :style="{ 'background-color': button.bgColor }" @click.stop="buttonClick(key)">
                        {{ button.label }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Watch, Ref} from 'vue-property-decorator';
import SignatrueComponent from './signatrue.vue';

interface KeyValue {
    [key:string]:any
}

@Component({
    components:{
        SignatrueComponent
    }
})
export default class Signature extends Vue{
    @Ref()signatureRef !: SignatrueComponent; 

    @Ref()signnatrueBoard !: HTMLElement;

    private loading = false;

    private isVertical = false;

    private finish = false;

    private buttons = {
        submit:{
            label: '使用',
            type: 'primary',
            bgColor: '#6087FD'
        },
        clear:{
            label: '清除',
            type: 'warning',
            bgColor: '#E6A23C'
        },
        back:{
            label:'返回',
            type:'info',
            bgColor: '#909399'
        }
    }

    private size = 0;

    mounted(){
        this.loading = false;
        //window.onorientationchange = this.onorientationchange
        const height = this.signnatrueBoard.offsetHeight || document.body.clientHeight;
        const width = this.signnatrueBoard.offsetWidth || document.body.clientWidth;
        this.size = height > width ? height : width;
        this.onorientationchange();
    }

    beforeDestroy(){
        //window.onorientationchange = ()=>{};
    }

    private onorientationchange(){
        const vertical = [0,180].includes(Number(window.orientation)) ? false : true;
        this.isVertical = vertical;
        this.$nextTick(()=>{
            this.signatureRef.changeDirection(Number(window.orientation), this.signnatrueBoard);
        })
    }

    private buttonClick(key:string){
        const that = this as KeyValue
        if(that[key]) that[key]();
    }

    private async submit():Promise<File>{
        this.loading = true;
        try{
            if (this.signatureRef) {
                const image:File = await this.signatureRef.getImage();
                if(!image) throw '获取图片失败'
                this.finish = true;
                return Promise.resolve(image);
            }
            throw '获取图片失败'
        }
        catch(e){
            return Promise.reject(e);
        }
        finally{
            this.loading = false;
        }
    }

    private clear(){
        this.$nextTick(()=>{
        if (this.signatureRef) this.signatureRef.clearCanvas();
        })
    }
    
}
</script>
<style lang="scss">
.wap{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    &-finish{
        @include JustityAndFlexWrap(flex,center,center,null);
        height:100%;
    }
    &-signature{
        &__vertical { 
            .wap-signature{
                &-maintain {
                    right: 0;
                    top: 0;
                    height: 100vh;
                    flex-direction: column;
                    flex-wrap: wrap;
                    &-button {
                        height:33%;
                        width: 60px;
                    }
                }
            }
        }
        &__across { //竖
            .wap-signature{
                &-maintain{
                    left: 0;
                    bottom: 0;
                    width: 100vw;
                    align-items: center;
                    &-button{
                        height: 30px;
                        width:33%;
                    }
                }
            }
        }
        &-maintain {
            position: absolute;
            @include JustityAndFlexWrap(flex,space-around,null,null);
            flex: 1;
            &-button{
                @include JustityAndFlexWrap(flex,center,center,null);
                color:white;
            }
        }
        &-board {
            overflow: hidden;
            height: 100vh;
            width: 100vw;
        }
    }
}
</style>