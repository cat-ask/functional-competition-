class Tool{
    static drow_path = {"1":{},"2":{},"3":{},"4":{},"5":{}};
    static canvas_num = {"1":0,"2":0,"3":0,"4":0,"5":0};
    static status = null;
    static drow = 0;
    static zIndex = {"1":0,"2":0,"3":0,"4":0,"5":0};
    static select_id = null;
    static select = false;
    static canvas_list = {"1":{},"2":{},"3":{},"4":{},"5":{}}
    constructor(drow_area,app){
        this.drowing = false;
        this.app = app;
        this.drow_area = drow_area;
        this.view = new View(drow_area,this.app,this);
        this.track = new Track(this.app,this.view,this);
        this.setdetail();
        this.out();
    }

    free(){
        this.select_reset();
        this.menu_changecolor("free_b","#C8C8C8");
        this.drow_area.onmousedown = (e)=>{
            e.preventDefault();
            if(Tool.status == 1 && this.drowing == false){
                this.createCanvas();
                new Free_line(e);
            }
        }
    }

    squre(){
        this.select_reset();
        this.menu_changecolor("all","#7F7F7F");
        this.menu_changecolor("squre_b","#C8C8C8");
        this.drow_area.onmousedown = (e)=>{
            e.preventDefault();
            if(Tool.status == 2 && this.drowing == false){
                this.createCanvas();
                new Squre(e);
            }
        }
    }

    Text(){
        this.select_reset();
        this.menu_changecolor("all","#7F7F7F");
        this.menu_changecolor("text_b","#C8C8C8");
        this.drow_area.onclick = (e)=>{
            if(Tool.status == 3 && Tool.drow == 0){
                this.createInput(e);
                new Text(e);
            }
        }
    }

    select(){
        this.menu_changecolor("all","#7F7F7F");
        this.menu_changecolor("sle_b","#C8C8C8");
        this.drow_area.onmousedown = (e)=>{
            e.preventDefault();
            if(Tool.status == 4 && this.drowing == false) new Select(e);
        }
    }

    createCanvas(){
        if(!document.querySelector("#merge_b") && !document.querySelector("#reset_b")){
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
            document.querySelector("#reset_b").addEventListener("click",()=>{this.view.All_reset();});
        }
        let canvas = document.createElement("canvas");
        Tool.canvas_num[View.video_num]++;
        Tool.zIndex[View.video_num]++;
        canvas.classList.add("canvas");
        canvas.id = "canvas"+Tool.canvas_num[View.video_num];
        this.drow_area.appendChild(canvas);
        canvas = document.querySelector("#canvas"+Tool.canvas_num[View.video_num]);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.zIndex = Tool.zIndex[View.video_num];
        Tool.drow_path[View.video_num][Object.keys(Tool.drow_path[View.video_num]).length + 1] = {'id':"canvas"+Tool.canvas_num[View.video_num],'zIndex':Tool.zIndex[View.video_num]}
        this.track.addarray("layer","layer"+Tool.canvas_num[View.video_num],"#layer_list");
        this.track.addarray("layer_time","layer_time"+Tool.canvas_num[View.video_num],"#layer"+Tool.canvas_num[View.video_num],Object.keys(Tool.drow_path[View.video_num]).length);
        this.track.addarray("layer_right","layer_right"+Tool.canvas_num[View.video_num],"#layer_time"+Tool.canvas_num[View.video_num]);
        this.track.addarray("layer_center","layer_center"+Tool.canvas_num[View.video_num],"#layer_time"+Tool.canvas_num[View.video_num]);
        this.track.addarray("layer_left","layer_left"+Tool.canvas_num[View.video_num],"#layer_time"+Tool.canvas_num[View.video_num]);
    }

    createInput(e){
        if(Tool.status == 3 && Tool.drow == 0){
            this.setdetail();
            let input = document.createElement("input");
            input.type = "text";
            input.autofocus = true;
            input.classList.add("text_add");
            input.setAttribute("id","text_s");
            input.zIndex = 100;
            input.style.top = Number(e.offsetY)+"px";
            input.style.left = Number(e.offsetX)+"px";
            input.style.fontSize = this.text + "px";
            input.style.color = this.color;
            input.setAttribute("size","5px");
            this.drow_area.appendChild(input);
            Tool.drow = 1;
            document.querySelector("#text_s").focus();
            document.querySelector("#text_s").addEventListener("keydown",()=>{
                if(document.querySelector("#text_s") && Tool.status == 3){
                    Tool.drow = 2;
                    if(document.querySelector("#text_s") && Tool.status == 3){
                        if((document.querySelector("#text_s").getBoundingClientRect().left + (document.querySelector("#text_s").scrollWidth+15)) < this.drow_area.getBoundingClientRect().right){
                            document.querySelector("#text_s").style.width = "5px";
                            document.querySelector("#text_s").style.width = (document.querySelector("#text_s").scrollWidth + 15)+"px";
                        }
                    }
                }
            });
        }
    }

    setdetail(){
        this.color = document.querySelector("#color_v").options[document.querySelector("#color_v").selectedIndex].value;
        this.thick = Number(document.querySelector("#thick_v").options[document.querySelector("#thick_v").selectedIndex].value);
        this.text = Number(document.querySelector("#text_size_v").options[document.querySelector("#text_size_v").selectedIndex].value);
    }

    out(){
        document.querySelector("html").onclick = (e)=>{
            let x = Number(e.clientX);
            let y = Number(e.clientY);
            if(Tool.status !== null){
                if((x < this.drow_area.getBoundingClientRect().left) || (x > (this.drow_area.getBoundingClientRect().right)) || (y < this.drow_area.getBoundingClientRect().top) || (y > (this.drow_area.getBoundingClientRect().top + this.drow_area.getBoundingClientRect().height))){
                    if((x < document.querySelector("#menu").getBoundingClientRect().left + 10) || (x > (document.querySelector("#menu").getBoundingClientRect().right - 40)) || (y < document.querySelector("#menu").getBoundingClientRect().top) || (y > (document.querySelector("#menu").getBoundingClientRect().top + document.querySelector("#menu").getBoundingClientRect().height))){
                        if((x < document.querySelector("#layer_list").getBoundingClientRect().left + 45) || (x > (document.querySelector("#layer_list").getBoundingClientRect().right - 45)) || (y < document.querySelector("#layer_list").getBoundingClientRect().top) || (y > (document.querySelector("#layer_list").getBoundingClientRect().top + document.querySelector("#layer_list").getBoundingClientRect().height))){
                            this.select_reset();
                        }
                    }
                }
            }
        }
    }

    select_reset(){
        this.view.canvas_reset("all_clear");
        Tool.status = null;
        Tool.select_id = null;
        Tool.select = false;
        Tool.drow = 0;
        document.querySelectorAll(".menu_button").forEach(menu_id =>{ document.querySelector("#"+menu_id.id).style.backgroundColor = "#7F7F7F"; });
        this.track.changestyle_array("all","#C8C8C8");
    }

    menu_changecolor(id,color){document.querySelectorAll(".menu_button").forEach(menu_id =>{ if(id == "all" || menu_id.id == id) document.querySelector("#"+menu_id.id).style.backgroundColor = color; });}
}