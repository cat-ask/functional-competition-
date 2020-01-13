class Squre extends Tool{
    constructor(e){
        super(document.querySelector("#play_video"));
        if(this.drowing == false && Tool.status == 2){
            this.setdetail();
            this.drowing = true;
            this.id = Tool.canvas_num[View.video_num];
            this.canvas = document.querySelector("#canvas"+this.id);
            this.ctx = this.canvas.getContext("2d");
            this.ctx.strokeStyle = this.color;
            this.fx = Number(e.offsetX);
            this.fy = Number(e.offsetY);
            this.name = Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['id'];
            this.Drow();
        }
    }

    Drow(){
		this.drow_area.addEventListener("mousemove",(e)=>{
            if(this.drowing && Tool.status == 2){
                this.x = Number(e.offsetX);
                this.y = Number(e.offsetY);
                this.sw = (this.x - this.fx);
                this.sh = (this.y - this.fy);
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                this.ctx.strokeRect(this.fx,this.fy,this.sw,this.sh);
            }
        });

        this.drow_area.addEventListener("mouseup",(e)=>{
            if(this.drowing && Tool.status == 2){
                this.drowing = false;
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.fx,this.fy,this.sw,this.sh);
                this.sw = this.sw < 0 ? -(this.x - this.fx) : (this.x - this.fx);
                this.sh = this.sh < 0 ? -(this.y - this.fy) : (this.y - this.fy);
                if((this.x - this.fx) < 0) this.fx += (this.x - this.fx);
                if((this.y - this.fy) < 0) this.fy += (this.y - this.fy);
                Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]={"video":View.video_num,"number":Tool.canvas_num[View.video_num],"id":this.name,"path":{"x":this.fx,"y":this.fy,"width":this.sw,"height":this.sh},"color":this.color,"type":"squre","start_t":0,"keep_t":Track.end_t,"add":[this.id]};
            }
        });
    }
}