class Track{
    static now_t = null;
    static end_t = null;
    static target = null;
    static layer_array = {"1":{},"2":{},"3":{},"4":{},"5":{}};
    static px_time = null;
    static target_id = null;
    constructor(app,view,tool){
        this.app = app;
        this.view = view;
        this.tool = tool;
        this.timesetL();
        this.timesetR();
        this.track = 0;
        this.layer_list = document.querySelector("#layer_list");
        this.track_out();
    }

    timesetL(){
        if(Track.now_t == null || Track.end_t == null) return false;
        document.querySelector("#now_t").innerHTML = this.changetime(Track.now_t);
        document.querySelector("#end_t").innerHTML = this.changetime(Track.end_t);
    }

    timesetR(id){
        if(id){
            document.querySelector("#start_t").innerHTML = this.changetime(Tool.drow_path[View.video_num][id]['start_t']);
            document.querySelector("#keep_t").innerHTML = this.changetime(Tool.drow_path[View.video_num][id]['keep_t']);
        }
    }

    changetime(time){
        let h = "0"+Math.floor(time / 3600);
		h = h.substring(h.length - 2,h.length);
		let m = "0"+Math.floor(time % 3600 / 60);
		m = m.substring(m.length - 2,m.length);
		let s = "0"+Math.floor(time % 60);
		s = s.substring(s.length - 2,s.length);
		let ms = time.toFixed(2);
		ms=String(ms);
		ms = ms.split(".");
		ms = ms[1];
		return h+" : "+m+" : "+s+" : "+ms;
    }

    addarray(clname,id,parent,num,mode){
        let layer = document.createElement("div");
        layer.classList.add(clname);
        layer.setAttribute("id",id);
        layer.style.left = "0px";
        document.querySelector(parent).prepend(layer);
        if(id !== "movie_layer" &&clname == "layer"){
            let check = document.createElement("input");
            check.classList.add("checkbox");
            check.setAttribute("id","check"+Tool.canvas_num[View.video_num]);
            check.type = "checkbox";
            check.value = Tool.canvas_num[View.video_num];
            document.querySelector("#"+id).append(check);
        }
        if(id !== "movie_layer" && clname == "layer_time" && num !== null){
            document.querySelector("#"+id).onclick = ()=>{ this.layer_click(num)}
            if(mode == null) Track.layer_array[View.video_num][num]={"id":id,"left_m":0,"right_m":0,"num":Tool.canvas_num[View.video_num]}
        }
        if(clname == "layer_left") document.querySelector("#"+id).addEventListener("mousedown",(e)=>{Track.target = 1; new Track_time(e,this.app); });
        if(clname == "layer_right") document.querySelector("#"+id).addEventListener("mousedown",(e)=>{Track.target = 3; new Track_time(e,this.app); });
        if(clname == "layer_center"){
            document.querySelector("#"+id).addEventListener("mousedown",(e)=>{Track.target = 2; new Track_time(e,this.app); });
            document.querySelector("#"+id).addEventListener("dragstart",(e)=>{
                Track.target_id = Number(id.substring(12,13));
                Track.target = "swap";
                new Track_swap(e,this.app);
            });
        }
    }

    changestyle_array(id,color){
        document.querySelectorAll(".layer_time ").forEach( layer =>{
            if(layer.id !== id && id !== "all") return false;
            document.querySelector("#"+layer.childNodes[0].id).style.backgroundColor = color;
            document.querySelector("#"+layer.childNodes[1].id).style.backgroundColor = color;
            document.querySelector("#"+layer.childNodes[2].id).style.backgroundColor = color;
        });
    }

    layer_click(id){
        Track.target_id = id;
        Tool.select_id = id;
        Tool.status = 4;
        this.changestyle_array("all","#C8C8C8");
        this.changestyle_array(Track.layer_array[View.video_num][id]['id'],"#17AFB1");
        this.view.canvas_reset("all_clear");
        this.view.canvas_reset("select","#33CFD1");
        this.view.canvas_reset();
        this.tool.select();
        this.timesetR(Tool.select_id);
    }

    track_out(id){
        if(!id) return false;
        if(document.querySelector("#"+Tool.drow_path[View.video_num][id]['id'])){
            if(Track.now_t < Tool.drow_path[View.video_num][id]['start_t']) document.querySelector("#"+Tool.drow_path[View.video_num][id]['id']).style.display = "none";
            if(Track.now_t >= Tool.drow_path[View.video_num][id]['start_t']) document.querySelector("#"+Tool.drow_path[View.video_num][id]['id']).style.display = "block";
            if(Track.now_t >= (Tool.drow_path[View.video_num][id]['start_t'] + Tool.drow_path[View.video_num][id]['keep_t'])) document.querySelector("#"+Tool.drow_path[View.video_num][id]['id']).style.display = "none";
        }
    }

    addTrack(){
        if(document.querySelector("#track")) document.querySelector("#track").remove();
        let track = document.createElement("div");
        track.setAttribute("id","track");
        document.querySelector("#layer_list").prepend(track);
        document.querySelector("#track").addEventListener("mousedown",(e)=>{Track.target = "track"; new Track_time(e);});
    }
}