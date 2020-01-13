class App{
    constructor(){
        this.tool = new Tool(document.querySelector("#play_video"),this);
        this.view = new View(document.querySelector("#play_video"),this,this.tool);
        this.track = new Track(this,this.view,this.tool);
        this.addEvent();
    }

    addEvent(){
        document.querySelector("#free_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.tool.free(); Tool.status = 1;} );
        document.querySelector("#squre_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.tool.squre(); Tool.status = 2;} );
        document.querySelector("#text_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.tool.Text(); Tool.status = 3;} );
        document.querySelector("#sle_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.tool.select(); Tool.status = 4;});
        document.querySelector("#play_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.view.movie_play();});
        document.querySelector("#stop_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.view.movie_stop();});
        document.querySelector("#alld_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.view.A_delete();})
        document.querySelector("#somed_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} if(Tool.select_id == null){alert("선택된것이 없습니다!"); return false;} this.view.S_selete();});
        document.querySelector("#down_b").addEventListener("click",()=>{ if(this.view.movie.src == ""){alert("동영상을 선택해주세요!"); return false;} this.download();});
    }
    
    menu_changecolor(id,color){document.querySelectorAll(".menu_button").forEach(menu_id =>{ if(id == "all" || menu_id.id == id) document.querySelector("#"+menu_id.id).style.backgroundColor = color; });}

    download(){
        let content = `<!doctype html>
                            <head>
                                <title>BIFF 부산 국제 영화제</title>
                            </head>
                            <body>
                                <div id = "view" style = "position:relative; width:900px; height:500px; background-color:#000;">
                                    <video src="`+this.view.movie.src+`" controls style = "position:absolute; left:0;top:0;width:100%;height:100%;"></video>`;
        for(let i = 1; i <=Object.keys(Tool.drow_path[View.video_num]).length; i++){
            let view_img = null;
            if(Tool.drow_path[View.video_num][i]['video'] == View.video_num){
                view_img = document.createElement("img");
                view_img.width = 900;
                view_img.height = 500;
                view_img.src = document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']).toDataURL();
                view_img.style = document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']).style.cssText;
                view_img.classList.add("clip");
                view_img.style.position = "absolute";
                view_img.style.pointerEvents = "none";
                view_img.style.top = "0px";
                view_img.style.left = "0px";
                view_img.dataset.start = Tool.drow_path[View.video_num][i]['start_t'];
                view_img.dataset.duration = Tool.drow_path[View.video_num][i]['keep_t'];
                content += (view_img.outerHTML);
            }
        }
        content += `</div>
        <script>
				const video= document.querySelector('#view > video');
				const clipList = document.querySelectorAll('#view .clip');
				function frame(){
					requestAnimationFrame(frame);
					if(clipList){
						clipList.forEach(x => {
							let start = parseInt(x.dataset.start);
							let duration = parseInt(x.dataset.duration);
							if(start <= video.currentTime && video.currentTime <= start + duration){
								x.style.display = "block";
							}else{
								x.style.display = "none";
                            }
						});
					}
				}
				
				requestAnimationFrame(frame);
				
			</script>
		</body>
        </html>`;
        let blob = new Blob([content],{type:"text/html; charset=utf6"});
        let now = new Date();
        now = (((now.getFullYear()+"").substr(2)) + ((now.getMonth()<9)? "0" + (now.getMonth()+1) : (now.getMonth()+1)) + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()));
        let downBtn = document.createElement("a");
        downBtn.href = URL.createObjectURL(blob);
        downBtn.download = "movie-["+now+"].html";
        document.body.append(downBtn);
        downBtn.click();
        downBtn.remove();
    }
}

window.onload = ()=>{
    let app = new App();
}