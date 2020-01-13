class Track_time extends Track{
    constructor(e,app){
        super(app);
        if(Track.target == "track" || (Track.target !== null && Track.target_id)){
            this.cx = e.clientX;
            if((Track.target !== null && Track.target_id)){
                console.log(Track.layer_array[View.video_num][Track.target_id]);
                this.left_m = Track.layer_array[View.video_num][Track.target_id]['left_m'];
                this.right_m = Track.layer_array[View.video_num][Track.target_id]['right_m'];
                this.target = document.querySelector("#"+Track.layer_array[View.video_num][Track.target_id]['id']);
                this.et = 0;
            }
            if(Track.target == "track") this.track_m = (Track.now_t / Track.px_time);
            this.track = 1;
            this.st = 0;
            this.Move();
        }
    }

    Move(){
        let x;
        window.onmousemove = (e)=>{
            if(Track.target == 1 && Track.target_id && this.track){//left
                this.st = 0;
                this.et = 0;
                x = e.clientX - this.cx;
                this.left_m += x;
                this.left_m = this.left_m < 0 ? 0 : this.left_m > 785 ? 785 : this.left_m;
                this.left_m = (this.left_m + this.right_m) > 785 ? this.left_m - x : this.left_m;
                this.target.style.left = this.left_m + "px";
                this.target.style.width = (810 - (this.left_m + this.right_m)) > 810 ? "810px" : (810 - (this.left_m + this.right_m)) < 25 ? "25px" : 810 - (this.left_m + this.right_m)+"px";
                this.cx = e.clientX;
                this.timepx((this.left_m),"st");
                this.timepx((810 - (this.left_m + this.right_m)),"et");
                Tool.drow_path[View.video_num][Track.target_id]['start_t'] = this.st;
                Tool.drow_path[View.video_num][Track.target_id]['keep_t'] = this.et;
                Track.layer_array[View.video_num][Track.target_id]['left_m'] = this.left_m;
                Track.layer_array[View.video_num][Track.target_id]['right_m'] = this.right_m;
                this.timesetR(Track.target_id);
                this.track_out(Track.target_id);
            }else if(Track.target == 3 && Track.target_id && this.track){//right
                this.st = 0;
                this.et = 0;
                x = this.cx - e.clientX;
                this.right_m += x;
                this.right_m = this.right_m < 0 ? 0 : this.right_m > 785 ? 785 : this.right_m;
                this.right_m = (this.right_m + this.left_m) > 785 ? this.right_m - x : this.right_m;
                this.target.style.right = this.right_m + "px";
                this.target.style.width = (810 - (this.right_m + this.left_m)) > 810 ? "810px" : (810 - (this.right_m + this.left_m)) < 25 ? "25px" : (810 - (this.right_m + this.left_m))+"px";
                this.timepx((810 - (this.left_m + this.right_m)),"et");
                Tool.drow_path[View.video_num][Track.target_id]['keep_t'] = this.et;
                this.timesetR(Track.target_id);
                this.cx = e.clientX;
                Track.layer_array[View.video_num][Track.target_id]['right_m'] = this.right_m;
                this.track_out(Track.target_id);
            }else if(Track.target == 2 && Track.target_id && this.track){ // center
                this.et = this.st = 0;
                x = e.clientX - this.cx;
                let mx = this.left_m + x;
                mx = mx < 0 ? 0 : mx;
                mx = (mx + parseInt(this.target.getBoundingClientRect().width)+this.right_m) > 810 ? (mx - x) : mx;
                this.left_m = mx;
                this.target.style.left = this.left_m + "px";
                this.right_m = (810 - (mx + parseInt(this.target.getBoundingClientRect().width))) > -1 ? (810 - (mx + parseInt(this.target.getBoundingClientRect().width))) : 0;
                Track.layer_array[View.video_num][Track.target_id]['left_m'] = this.left_m;
                Track.layer_array[View.video_num][Track.target_id]['right_m'] = this.right_m;
                this.timepx(this.left_m,"st");
                Tool.drow_path[View.video_num][Track.target_id]['start_t'] = this.st;
                this.timesetR(Track.target_id);
                this.cx = e.clientX;
                this.track_out(Track.target_id);
            }else if(Track.target = "track" && this.track){//track
                this.st = 0;
                x = e.clientX - this.cx;
                let mx = this.track_m + x;
                mx = mx < 0 ? 0 : mx > (Track.end_t / Track.px_time) ? (Track.end_t / Track.px_time) : mx;
                document.querySelector("#track").style.left = mx + "px";
                this.cx = e.clientX;
                this.track_m = mx;
                this.timepx(mx,"st");
                document.querySelector("#video").currentTime = this.st;
                Track.now_t = this.st;
                this.timesetL();
                for(let i = 1; i <=Object.keys(Tool.drow_path[View.video_num]).length; i++) this.track_out(i);
            }
        };

        window.onmouseup = (e)=>{
            if(Track.target !== "swap" && Track.target){
                Track.target = null;
                Track.target_id = null;
                this.track = 0;
            }
        };
    }

    timepx(num,plus){for(let i = 0; i < num ; i++) if(plus == "st") this.st += Track.px_time; else this.et +=Track.px_time; }
}