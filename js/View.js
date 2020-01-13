class View{
    static video_num = null;
    constructor(movie_area,app,tool){
        this.app = app;
        this.track = new Track(this.app,this,tool);
        this.movie_area = document.querySelector("#play_video");
        this.movie = document.querySelector("#video");
        this.addEvent();
    }

    addEvent(){
        document.querySelector("#movie_list").onclick = (e)=>{
            let id = e.target.id;
            document.querySelectorAll(".movie_img").forEach(movie =>{
                if(id !== movie.id || this.re == false) return false;
                this.menu_changecolor("all","#7F7F7F");
                document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
                document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
                if(document.querySelector("#reset_b")) document.querySelector("#reset_b").remove();
                if(document.querySelector("#merge_b")) document.querySelector("#merge_b").remove();
                if(View.video_num && Object.keys(Tool.drow_path[View.video_num]).length !== null){
                    for(let i = 1; i <=Object.keys(Tool.drow_path[View.video_num]).length; i++){
                        if(document.querySelector("#"+Tool.drow_path[View.video_num][i]['id'])) document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']).remove();
                    }
                    for(let i = 1; i<= Object.keys(Tool.drow_path[View.video_num]).length;i++){
                        if(Track.layer_array[View.video_num][i]){
                            let tool = Track.layer_array[View.video_num][i]['id'];
                            document.querySelector("#"+tool).remove();
                            document.querySelector("#layer"+Track.layer_array[View.video_num][i]['num']).remove();
                        }
                    }
                }
                if(document.querySelector("#movie_layer")) document.querySelector("#movie_layer").remove();
                this.track.addarray("layer","movie_layer","#layer_list");
                View.video_num = id.substring(5,6);
                this.movie.src = "movie/"+id+".mp4";
                if(View.video_num && Object.keys(Tool.drow_path[View.video_num]).length !== null){
                    for(let i = 1; i<= Object.keys(Tool.drow_path[View.video_num]).length; i++) {
                        console.log(i);
                        let canvas = document.createElement("canvas");
                        canvas.classList.add("canvas");
                        canvas.setAttribute("id",Tool.drow_path[View.video_num][i]['id']);
                        this.movie_area.appendChild(canvas);
                        canvas = document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']);
                        canvas.width = canvas.offsetWidth;
                        canvas.height = canvas.offsetHeight;
                        let id = Track.layer_array[View.video_num][i]['num'];
                        this.track.addarray('layer','layer'+id,'#layer_list',i,"reset");
                        this.track.addarray('layer_time','layer_time'+id,'#layer'+id,i,"reset");
                        this.track.addarray('layer_right','layer_right'+id,'#layer_time'+id,i,"reset");
                        this.track.addarray('layer_center','layer_center'+id,'#layer_time'+id,i,"reset");
                        this.track.addarray('layer_left','layer_left'+id,'#layer_time'+id,i,"reset");
                        document.querySelector("#layer_time"+id).style.width = (810 - (Track.layer_array[View.video_num][i]['left_m'] + Track.layer_array[View.video_num][id]['right_m'])) + "px";
                        document.querySelector("#layer_time"+id).style.left = Track.layer_array[View.video_num][i]['left_m']+"px";
                        document.querySelector("#layer_time"+id).style.right = Track.layer_array[View.video_num][i]['right_m']+"px";
                        this.track.track_out(i);
                    }
                    if(!document.querySelector("#merge_b") && !document.querySelector("#reset_b") && Object.keys(Tool.drow_path[View.video_num]).length > 0){
                        let merge = document.createElement("button");
                        merge.classList.add("menu_button");
                        merge.setAttribute("id","merge_b");
                        document.querySelector("#menu").append(merge);
                        document.querySelector("#merge_b").innerHTML = "병합하기";
                        let reset = document.createElement("button");
                        reset.classList.add("menu_button");
                        reset.setAttribute("id","reset_b");
                        document.querySelector("#menu").append(reset);
                        document.querySelector("#reset_b").innerHTML = "초기화";
                        document.querySelector("#reset_b").addEventListener("click",()=>{this.All_reset();})
                    }
                }
                this.movie.addEventListener("loadedmetadata",()=>{
                    this.canvas_reset();
                    View.video = document.querySelector("#movie");
                    Track.now_t = 0;
                    Track.end_t = this.movie.duration;
                    Track.px_time = (Track.end_t / 810);
                    this.track.timesetL();
                    this.track.addTrack();
                });
            });
        }
    }

    movie_play(){
        this.menu_changecolor("all","#7F7F7F");
        this.menu_changecolor("play_b","#C8C8C8");
        this.canvas_reset("all_clear");
        this.track.changestyle_array("all","#C8C8C8");
        this.movie.play();
        requestAnimationFrame(()=>{this.frame();});
    }

    movie_stop(){
        this.menu_changecolor("all","#7F7F7F");
        this.menu_changecolor("stop_b","#C8C8C8");
        this.movie.pause();
    }

    frame(){
        Track.now_t = this.movie.currentTime;
        this.track.timesetL();
        if(View.video_num && Tool.drow_path[View.video_num].length) for(let i = 1;i <= Object.keys(Tool.drow_path[View.video_num]).length; i++) this.track.track_out(i);
        document.querySelector("#track").style.left = (Track.now_t / Track.px_time)+"px";
        requestAnimationFrame(()=>{
            this.frame();
        });
    }

    A_delete(){
        this.menu_changecolor("all","#7F7F7F");
        for(let i = 1; i <=Object.keys(Tool.drow_path[View.video_num]).length; i++){
            if(Tool.drow_path[View.video_num][i]['video'] == View.video_num){
                document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']).remove();
            }
        }

        for(let i = 1; i<= Object.keys(Tool.drow_path[View.video_num]).length;i++){
            let tool = Track.layer_array[View.video_num][i]['id'];
            document.querySelector("#"+tool).remove();
            document.querySelector("#layer"+Track.layer_array[View.video_num][i]['num']).remove();
        }
        this.menu_changecolor("all","#7F7F7F");
        Track.target_id = null;
        Tool.select_id = null;
        Tool.status = null;
        Tool.select = false;
        Tool.canvas_num[View.video_num] = 0;
        Tool.drow = 0;
        Track.target = null;
        Track.layer_array[View.video_num] = {};
        Tool.drow_path[View.video_num]={};
        if(document.querySelector("#reset_b")) document.querySelector("#reset_b").remove();
        if(document.querySelector("#merge_b")) document.querySelector("#merge_b").remove();
    }

    S_selete(){
        this.menu_changecolor("all","#7F7F7F");
        let for_n = Tool.drow_path[View.video_num][Tool.select_id]['add'].length;
        for(let i = 0; i<for_n;i++){
            let id = Tool.drow_path[View.video_num][Tool.select_id]['add'][i];
            document.querySelector("#"+Tool.drow_path[View.video_num][id]['id']).remove();
            document.querySelector("#"+Track.layer_array[View.video_num][id]['id']).remove();
            document.querySelector("#layer"+Track.layer_array[View.video_num][id]['num']).remove();
            for(let i = id; i<=Object.keys(Tool.drow_path[View.video_num]).length; i++){
                if(i !== Object.keys(Tool.drow_path[View.video_num]).length){
                    Tool.drow_path[View.video_num][i] = Tool.drow_path[View.video_num][i+1];
                    Track.layer_array[View.video_num][i] = Track.layer_array[View.video_num][i+1];
                    document.querySelector("#"+Track.layer_array[View.video_num][i]['id']).onclick = ()=>{this.track.layer_click(i)}
                }
                else{
                    delete Tool.drow_path[View.video_num][i];
                    delete Track.layer_array[View.video_num][i];
                }
            }
        }
        Track.target_id = null;
        Tool.select_id = null;
        Tool.status = null;
        Tool.select = false;
        Tool.drow = 0;
        Track.target = null;
    }

    All_reset(){
        this.menu_changecolor("all","#7F7F7F");
        for(let i = 1; i <= Object.keys(Tool.drow_path[View.video_num]).length; i++) if(Tool.drow_path[View.video_num][i]['video'] == View.video_num) document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']).remove();
        for(let i = 1; i <= Object.keys(Tool.drow_path[View.video_num]).length; i++){
            let tool = Track.layer_array[View.video_num][i]['id'];
            document.querySelector("#"+tool).remove();
            document.querySelector("#layer"+Track.layer_array[View.video_num][i]['num']).remove();
        }
        for(let i = 1; i <=5; i++){
            Tool.canvas_num[i] = 0;
            Track.layer_array[i] = {};
            Tool.drow_path[i]= {};
        }
        this.menu_changecolor("all","#7F7F7F");
        Track.target_id = null;
        Tool.select_id = null;
        Tool.status = null;
        Tool.select = false;
        Tool.drow = 0;
        Track.target = null;
        this.movie.setAttribute("src","");
        this.movie.removeAttribute("src");
        View.video_num = null;
        if(document.querySelector("#reset_b")) document.querySelector("#reset_b").remove();
        if(document.querySelector("#merge_b")) document.querySelector("#merge_b").remove();
        if(document.querySelector("#movie_layer")) document.querySelector("#movie_layer").remove();
        if(document.querySelector("#track")) document.querySelector("#track").remove();
        document.querySelector("#now_t").innerHTML = "00 : 00 : 00 : 00";
        document.querySelector("#end_t").innerHTML = "00 : 00 : 00 : 00";
        document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
        document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
    }
    //canvas
    canvas_reset(type,color,x,y){
        if(View.video_num && Object.keys(Tool.drow_path[View.video_num]).length){
            if(type == null && color == null) new ViewDrow("nomal");
            else if(type == "select" && color !== null){
                ViewDrow.Color = color;
                new ViewDrow("select");
            }
            else if(type == "all_clear") new ViewDrow("clear");
            else if(type == "move"){
                ViewDrow.Color = color;
                ViewDrow.moveX = x;
                ViewDrow.moveY = y;
                new ViewDrow("move");
            }
        }
    }

    menu_changecolor(id,color){document.querySelectorAll(".menu_button").forEach(menu_id =>{ if(id == "all" || menu_id.id == id) document.querySelector("#"+menu_id.id).style.backgroundColor = color; });}
}