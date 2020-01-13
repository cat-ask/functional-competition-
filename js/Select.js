class Select extends Tool{
    constructor(e){
        super(document.querySelector("#play_video"));
        let id = null;
        if(Tool.status == 4 && this.drowing == false){
            this.fx = e.offsetX;
            this.fy = e.offsetY;
            this.line_num = null;
            this.line_array = Array(0,0);
            this.view.canvas_reset("all_clear");
            for(let i = Object.keys(Tool.drow_path[View.video_num]).length; i>= 1; i--){
                if(Tool.drow_path[View.video_num][i]['video'] == View.video_num){
                    if(Tool.drow_path[View.video_num][i]['type'] == 'squre'){
                        this.sx = Tool.drow_path[View.video_num][i]['path']['x'];
                        this.sy = Tool.drow_path[View.video_num][i]['path']['y'];
                        this.sw = Tool.drow_path[View.video_num][i]['path']['width'];
                        this.sh = Tool.drow_path[View.video_num][i]['path']['height'];
                        if( (this.fx >= this.sx && this.fx <= (this.sx + this.sw) ) && (this.fy >= this.sy && this.fy <= (this.sy + this.sh) ) ){
                            Tool.select = true;
                            Tool.select_id = i;
                            this.line_array[0] = this.fx;
                            this.line_array[1] = this.fy;
                        }else Tool.select = false;
                    }else if(Tool.drow_path[View.video_num][i]['type'] == 'line'){
                        for(let k = 0; k<=Tool.drow_path[View.video_num][i]['path_num']; k++){
                            if( ((this.fx + (Tool.drow_path[View.video_num][i]['thick']/2)) >= Math.floor(Tool.drow_path[View.video_num][i]['path'][k]['x'])) && ((this.fx - (Tool.drow_path[View.video_num][i]['thick']/2)) <= Math.floor(Tool.drow_path[View.video_num][i]['path'][k]['x'])) ){
                                if( ((this.fy + (Tool.drow_path[View.video_num][i]['thick']/2)) >= Math.floor(Tool.drow_path[View.video_num][i]['path'][k]['y'])) && ((this.fy -(Tool.drow_path[View.video_num][i]['thick']/2)) <= Math.floor(Tool.drow_path[View.video_num][i]['path'][k]['y'])) ){
                                    Tool.select_id = i;
                                    Tool.select = true;
                                    this.line_num = k;
                                    break;
                                }else Tool.select = false;
                            }else Tool.select = false;
                        }
                    }else if(Tool.drow_path[View.video_num][i]['type'] == 'text'){
                        if((Tool.drow_path[View.video_num][i]['path']['x'] <= this.fx) && (Tool.drow_path[View.video_num][i]['path']['x'] + Tool.drow_path[View.video_num][i]['width'] >= this.fx) ){
                            if((Tool.drow_path[View.video_num][i]['path']['y'] - Tool.drow_path[View.video_num][i]['height'] <= this.fy) && (Tool.drow_path[View.video_num][i]['path']['y'] >= this.fy) ){
                                Tool.select_id = i;
                                Tool.select = true;
                                this.line_array[0] = this.fx;
                                this.line_array[1] = this.fy;
                            }else Tool.select = false;
                        }else Tool.select = false;
                    }

                    if(Tool.select !== false){
                        this.view.canvas_reset("select","#33CFD1");
                        this.view.canvas_reset();
                        this.track.changestyle_array("all","#C8C8C8");
                        this.track.changestyle_array(Track.layer_array[View.video_num][Tool.select_id]['id'],"#17AFB1");
                        this.Event();
                        this.drowing = true;
                        this.track.timesetR(Tool.select_id);
                        break;
                    }else {
                        this.track.changestyle_array("all","#C8C8C8");
                        this.line_num = null;
                        this.view.canvas_reset();
                        Tool.select_id = null;
                        document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
                        document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
                    }
                }
            }
        }
    }

    Event(){
            this.view.movie_area.addEventListener("mousemove",(e)=>{
                if(Tool.status == 4 && Tool.select && Tool.select_id !== null && this.drowing){
                    let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][Tool.select_id]['id']);
                    let ctx = canvas.getContext("2d");
                    let mx,my;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == "line"){
                        mx = Math.floor(Tool.drow_path[View.video_num][Tool.select_id]['path'][this.line_num]['x']) - e.offsetX;
                        my = Math.floor(Tool.drow_path[View.video_num][Tool.select_id]['path'][this.line_num]['y']) - e.offsetY;
                        ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['thick'] + 3;
                        this.view.canvas_reset("move","#33CFD1",mx,my);
                    }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'squre'){
                        mx = e.offsetX - this.line_array[0];
                        my = e.offsetY - this.line_array[1];
                        this.line_array[0] = e.offsetX;
                        this.line_array[1] = e.offsetY;
                        Tool.drow_path[View.video_num][Tool.select_id]['path']['x'] += mx;
                        Tool.drow_path[View.video_num][Tool.select_id]['path']['y'] += my;
                        this.view.canvas_reset("move","#33CFD1",mx,my);
                    }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'text'){
                        mx = e.offsetX - this.line_array[0];
                        my = e.offsetY - this.line_array[1];
                        Tool.drow_path[View.video_num][Tool.select_id]['path']['x'] = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'] + mx;
                        Tool.drow_path[View.video_num][Tool.select_id]['path']['y'] = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'] + my;
                        this.line_array[0]= e.offsetX;
                        this.line_array[1]= e.offsetY;
                        this.view.canvas_reset("move","#33CFD1");
                    }
                }
            });

            this.view.movie_area.addEventListener("mouseup",(e)=>{
                if(Tool.status == 4 && Tool.select && Tool.select_id !== null && this.drowing){
                    this.drowing = false;
                }
            });
    }
}