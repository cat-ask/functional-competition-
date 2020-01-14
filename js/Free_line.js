class Free_line extends Tool{
    constructor(e){
        super(document.querySelector("#play_video"));
        if(this.drowing == false && Tool.status == 1){
            this.setdetail();
            this.drowing = true;
            this.id = Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['add'];
            this.canvas = document.querySelector("#canvas"+this.id);
            this.ctx = this.canvas.getContext("2d");
            this.ctx.lineCap = "round";
            this.canvasXY(e.clientX,e.clientY,this.canvas);
            this.ctx.beginPath();
            this.ctx.moveTo(this.fx,this.fy);
            this.canvasXY(e.clientX,e.clientY,this.canvas);
            this.ctx.lineTo(this.fx,this.fy);
            this.ctx.stroke();
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.thick;
            this.path_num=0;
            this.name = Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['id'];
            Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length] = {"add":[{"video":View.video_num,"id":this.name,"path":{},"path_num":this.path_num,"color":this.color,"thick":this.thick,"type":"line","start_t":0,"keep_t":Track.end_t,"number":this.id}]}
            Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['add'][0]["path"][this.path_num] = {"x":this.fx,"y":this.fy};
            this.Drow();
        }
    }

    Drow(){
        this.drow_area.addEventListener("mousemove",(e)=>{
            if(Tool.status == 1 && this.drowing){
                e.preventDefault();
                this.ctx.beginPath();
                this.ctx.moveTo(this.fx,this.fy);
                this.canvasXY(e.clientX,e.clientY,this.canvas);
                this.ctx.lineTo(this.fx,this.fy);
                this.ctx.stroke();
                this.ctx.strokeStyle = this.color;
                this.ctx.lineWidth = this.thick;
                this.path_num++;
                Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['add'][0]['path_num'] = this.path_num;
                Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length]['add'][0]['path'][this.path_num]={"x":this.fx,"y":this.fy};
            }
        });

        this.drow_area.addEventListener("mouseup",(e)=>{
            e.preventDefault();
            if(Tool.status == 1 && this.drowing){
                this.drowing = false;
            }
        });
    }
    
    

    canvasXY(clientx,clienty,canvas){
        let bound = canvas.getBoundingClientRect();
        let bw = 5;
        this.fx = ( clientx - bound.left - bw)*(canvas.width/(bound.width - bw* 2));
        this.fy = (clienty - bound.top - bw)*(canvas.height/(bound.height - bw *2));
    }
}