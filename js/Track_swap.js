class Track_swap extends Track{
    constructor(e,app){
        super(app);
        if(Track.target == "swap" && Track.target_id){
            this.cy = e.clientY;
            this.layer_mh = 0;
            this.target = document.querySelector("#layer"+Track.target_id);
            this.track = 1;
            this.swap1 = Track.target_id;
            this.swap2 = null;
            this.Swap();
            this.target.style.zIndex = 100;
        }
    }

    Swap(){
        window.ondrag = (e)=>{
            if(Track.target == "swap" && this.track){
                let n=0,n1=0,y;
                for(let i = 1; i<=Track.target_id; i++)n += 30;
                for(let i = Track.target_id; i<=Object.keys(Tool.drow_path[View.video_num]).length;i++) n1 -=30;
                y = this.cy - e.clientY;
                this.layer_mh -= y;
                this.layer_mh = this.layer_mh < n1 ? n1 : this.layer_mh > n ? n : this.layer_mh;
                this.target.style.top = this.layer_mh + "px";
                for(let i = 1; i <=Object.keys(Tool.drow_path[View.video_num]).length;i++){
                    if("layer_time"+Track.target_id !== "layer_time"+i){
                        if(document.querySelector("#layer_time"+i).getBoundingClientRect().top + 2 > document.querySelector("#layer_time"+Track.target_id).getBoundingClientRect().top){
                            if(document.querySelector("#layer_time"+i).getBoundingClientRect().top - 2 < document.querySelector("#layer_time"+Track.target_id).getBoundingClientRect().top){
                                this.swap2 = i;
                                this.track = 2;
                            }else this.track =1;
                        }else this.track = 1;
                    }else this.track = 1;
                }
                this.cy = e.clientY;
            }
        }

        window.ondragend = ()=>{
            if(Track.target == "swap"){
                if(this.track == 2){
                    let name = Track.target_id;
                    let name2 = this.swap2;
                    if(name == null || name2 == null) return false;
                    this.id_change("canvas"+name,"canvas"+name2);
                    this.id_change("layer"+name,"layer"+name2);
                    this.id_change("layer_time"+name,"layer_time"+name2);
                    this.id_change("layer_left"+name,"layer_left"+name2);
                    this.id_change("layer_center"+name,"layer_center"+name2);
                    this.id_change("layer_right"+name,"layer_right"+name2);
                    Tool.drow_path[View.video_num][name]['id'] = "canvas"+name2;
                    Tool.drow_path[View.video_num][name2]['id'] = "canvas"+name;
                    Track.target_id = this.swap2;
                    Tool.select_id = this.swap2;
                    document.querySelector("#layer_time"+name).onclick = ()=>{this.layer_click(Number(name))}
                    document.querySelector("#layer_time"+name2).onclick = ()=>{this.layer_click(Number(name2))}
                }
                this.track = false;
                this.target.style.zIndex = 5;
                this.target.style.top = "0px";
            }
        }
    }

    id_change(name1,name2){
        if(name1 == null || name2 == null) return false;
        document.querySelector("#"+name1).setAttribute("id",name1+"a");
        document.querySelector("#"+name2).setAttribute("id",name1);
        document.querySelector("#"+name1+"a").setAttribute("id",name2);
    }
}