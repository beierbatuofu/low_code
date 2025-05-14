<template>
    <div class="signatrue-component" :style="{
        width:`${canvasSize}px`,
        height:`${canvasSize}px`,
        transform: transform
    }">
        <canvas :width="canvasSize" :height="canvasSize" ref="canvas" />
    </div>
</template>
<script lang="ts">
import {Vue, Component, Ref, Prop, Watch} from 'vue-property-decorator';
interface Point{
    x: number; 
    y: number;
    radius?: number;
    diff?: number;
    t?: number
}
@Component
export default class SignatrueComponent extends Vue{
    @Ref()canvas !: HTMLCanvasElement;

    @Prop({default: false}) readonly !: boolean;
    
    @Prop({ default: 1000 }) canvasSize !: number; // canvas尺寸 越大精度越高，系统压力越大
    
    @Prop({ default: 1000 }) size !: number; // 外层容器最大尺寸

    @Prop({ default: 15 }) maxRadius !: number; //最大笔触半径

    @Prop({ default: 5 }) minRadius !: number; //最小笔触半径

    @Prop({ default: 0.05 }) ratio !: number; //笔触半径衰减力度 
    private deg = 0;

    private width = 0;

    private height = 0;

    private tracks:Point[] = [];

    private pressed = false;

    private radius = (this.maxRadius - this.minRadius) / 2 + this.minRadius;

    private lastPoint:Point = {
        x: -1,
        y: -1,
        radius: this.radius
    }

    private get transform():string {
        return `translateX(${(this.width - this.canvasSize) / 2}px) translateY(${(this.height - this.canvasSize) / 2}px) scale(${this.size / (this.canvasSize || 1)})`
    }

    private get scale():number{
        return this.size / (this.canvasSize || 1);
    }

    @Watch('lastPoint',{deep:true, immediate:true})
    watchLastPoint(lastPoint:Point){
        this.tracks.push(lastPoint);
    }

    mounted(){
        const start:any = this.drawEvent('start', this.canvas, ()=>this.pressed);
        ['mousedown', 'touchstart'].forEach((event:string)=>{
            this.canvas.addEventListener(event, start);
        });
        const move:any = this.drawEvent('move', this.canvas, ()=>this.pressed);
        ['mousemove', 'touchmove'].forEach((event:string)=>{
            this.canvas.addEventListener(event, move);
        });
        ['mouseleave', 'mouseup', 'touchend'].forEach((event:string)=>{
            this.canvas.addEventListener(event, ()=>{
                this.togglePressed()
            });
        });
    }

    beforeDestroy(){
        ['mousedown', 'touchstart','mousemove', 'touchmove','mouseleave', 'mouseup', 'touchend'].forEach((event:string)=>{
            this.canvas.removeEventListener(event, ()=>{});
        })
    }

    private getContext(): CanvasRenderingContext2D | null{
        return this.canvas.getContext('2d');
    }

    private pythagorean(from:Point, to:Point):number{
        return Math.floor(
            Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
        );
    }

    private togglePressed(status: boolean = false){
        this.pressed = status;
    }

    private drawEvent = (mode: string, canvas: HTMLCanvasElement , pressed: () => boolean) => (e: TouchEvent | MouseEvent): void=>{
        e.preventDefault();
        if(mode == 'start') this.togglePressed(true);
        if(pressed()){
            const { x, y } = canvas.getBoundingClientRect();
            const point:Point = (e instanceof TouchEvent) ? {
                x:Math.round(e.touches[0].clientX) - x,
                y:Math.round(e.touches[0].clientY) - y
            } : {
                x:Math.round(e.clientX) - x,
                y:Math.round(e.clientY) - y
            }
            this.paint(mode, point);
        }
    }

    private paintRadius(point:Point):number{
        if(this.lastPoint.radius && this.lastPoint.diff){
            const positionDiff = this.pythagorean(this.lastPoint, point);
            const beThin = this.lastPoint.diff < positionDiff;
            const swing = this.ratio * positionDiff;
            if(beThin) return this.lastPoint.radius - swing < this.minRadius ? this.minRadius : this.lastPoint.radius - swing;
            return this.lastPoint.radius + swing > this.maxRadius ? this.maxRadius : this.lastPoint.radius + swing;
        }
        return (this.maxRadius - this.minRadius) / 2 + this.minRadius
    }

    private async paint(mode: string, point: Point) {
        const radius:number = this.paintRadius(point);
        let diff = 0;
        if (mode == 'move') {
            this.radius = radius;
            await this.paintLink({ ...this.lastPoint }, { ...point, radius });
            diff = this.pythagorean(this.lastPoint, point);
        }
        this.lastPoint = { ...point, radius, diff, t: Date.now() };
    }

    private async paintLink(from:Point, to:Point){
        const positionDiff:number = this.pythagorean(from, to);
        if(positionDiff){
            let i = 0;
            const xSplitDiff = (to.x - from.x) / positionDiff;
            const ySplitDiff = (to.y - from.y) / positionDiff;
            const mathRadius = (fromRadius:number, toRadius:number, index:number, total:number):number=>{
                const fRadius = fromRadius - (index + 1) * this.ratio;
                const tRadius = toRadius - (total - index) * this.ratio;
                const result = fRadius > tRadius ? fRadius : toRadius;
                return result < this.minRadius ? this.minRadius : result;
            }
            while(i<positionDiff){
                const radius = mathRadius(from.radius || this.radius, to.radius || this.radius, i, positionDiff);
                await this.paintPoint(
                    {
                        x: from.x + xSplitDiff * i,
                        y: from.y + ySplitDiff * i
                    },
                    {
                        x: from.x + xSplitDiff * (i + 1),
                        y: from.y + ySplitDiff * (i + 1)
                    },
                    radius
                );
                i++;
            }
        }
        else{
            await this.paintPoint(from, to, to.radius || this.radius)
        }
    }

    private async paintPoint(from:Point, to:Point, radius:number){
        const context:CanvasRenderingContext2D | null = this.getContext();
        if(context){
            context.lineWidth = radius;
            context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            context.lineCap = 'round';
            context.lineJoin = 'bevel';
            context.miterLimit = 1;
            context.beginPath();
            context.moveTo(from.x / (this.scale || 1), from.y / (this.scale || 1));
            context.lineTo(to.x / (this.scale || 1), to.y / (this.scale || 1));
            context.stroke();
        }
    }

    changeDirection(deg:number, parent:HTMLElement){
        this.deg = deg;
        this.width = parent.offsetWidth;
        this.height = parent.offsetHeight;
    }

    clearCanvas(){
        if(!this.readonly){
            const context = this.getContext();
            if(context) context.clearRect(0,0,this.canvasSize,this.canvasSize);
        }
    }

    getTrack():string{
        return '';
    }

    async getImage(): Promise<any> {
        try {
            const base = this.canvas.toDataURL('image/png', 0.5);
            const file = await this.baseToFile(base);
            return Promise.resolve({ base, file });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async baseToFile(base: string): Promise<any> {
        try {
            const arr: string[] = base.split(',');
            const fileType = arr[0].match(/:(.*?);/) as string[];
            const bstr = atob(arr[1]);
            let l: number = bstr.length;
            const u8Arr = new Uint8Array(l);
            while (l--) {
                u8Arr[l] = bstr.charCodeAt(l);
            }
            const blob: Blob = new Blob([u8Arr], {
                type: fileType[1]
            });
            const blobToFile = (newBlob: Blob, fileName: string): File => {
                return new File([newBlob], `${fileName}.${newBlob.type}`, {
                    type: newBlob.type
                });
            };
            return Promise.resolve(blobToFile(blob, 'sign'));
        } catch (e) {
            console.error('image base64 to file error!');
        }
    }
}
</script>
<style lang="scss">
.signatrue-component{
    padding: 0;
    margin: 0;
}
</style>