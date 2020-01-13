class Text extends Tool{
    constructor(e){
        super(document.querySelector("#play_video"));
        if(Tool.drow == 1 && Tool.status == 3 && document.querySelector("#text_s")){
            this.Drow();
        }
    }
    Drow(){
        this.drow_area.addEventListener("click",()=>{
            this.setdetail();
            if(Tool.status !== 3 || document.querySelector("#text_s") == null) return false;
            if(Tool.drow == 2){
                if(document.querySelector("#text_s") && document.querySelector("#text_s").value.length > 0){
                    this.createCanvas();
                    this.id = Tool.canvas_num[View.video_num];
                    this.canvas = document.querySelector("#canvas"+Tool.canvas_num[View.video_num]);
                    this.ctx = this.canvas.getContext("2d");
                    this.ctx.fillStyle = this.color;
                    this.ctx.font = this.text +"px ''";
                    this.tx = parseInt(document.querySelector("#text_s").style.left) + 2;
                    this.ty = (parseInt(document.querySelector("#text_s").style.top) + this.text + 2);
                    this.ctx.fillText(document.querySelector("#text_s").value,this.tx,this.ty);
                    this.name = Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['id'];
                    this.text_height = this.text < 16 ? 18 : this.text <= 18 ? 21 : this.text <=24 ? 28 : 32;
                    Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]={"video":View.video_num,"number":Tool.canvas_num[View.video_num],"id":this.name,"path":{"x":this.tx,"y":this.ty},"width":parseInt((document.querySelector("#text_s").style.width)),"height":this.text_height,"value":document.querySelector("#text_s").value,"text_size":this.text,"type":"text","start_t":0,"keep_t":Track.end_t,"add":[this.id]}
                    Tool.drow = false;
                    document.querySelector("#text_s").remove();
                }else{document.querySelector("#text_s").remove(); Tool.drow = false;}
            }else {Tool.drow = false;}
        });
    }
}