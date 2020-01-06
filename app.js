window.onload=function(){
	let movie = document.querySelector("#video"),video_src="",video_num = null;
	let movie_area = document.querySelector("#play_video");
	let now_t,endtime,canvas,canvas_num=Array(0,0,0,0,0),play=0;
	let menu = document.querySelector(".menu_button");
	let layer_list = document.querySelector("#layer_list");
	let layer_array=Array(Array(),Array(),Array(),Array(),Array()); //id | start_time | end_time | left_layer_mx | right_layer_mx | start_sc | end_sc;
	let select_id,select_num=Array(1,1);
	let drow_path = Array(Array(),Array(),Array(),Array(),Array()); //        id | (x,y)           | (x,y) num | color | thick(text) | type | start_sc | end_sc; 
	let path_num = 0,drow_path_id = Array(-1,-1,-1,-1,-1),st=0,et=0;
	let layer_zindex = Array(Array(),Array(),Array(),Array(),Array()),canvas_id = 0,select_layer;
	let target = null,left_layer_mx = 0,right_layer_mx = 0;
	let left_cx,right_cx,px_time = 0,center_cx,track_cx,track_mx = 0,center_cy,center_layer_my,layer_swap=0,layer_swap_one,layer_swap_two;
	for(let i=1; i<6;i++) document.querySelector("#movie"+i).addEventListener("click",movie_set);
	
	function movie_set(){
		if(document.querySelector("canvas")){
			for(let i = 0; i<drow_path[video_num].length; i++){
				console.log(drow_path[video_num][i][0],drow_path);
				document.querySelector(drow_path[video_num][i][0]).remove();
			}
		}
		video_src = "movie/"+this.getAttribute("id")+".mp4";
		video_num = Number(this.getAttribute("id").substring(5,6)) - 1;
		movie.setAttribute("src","movie/"+this.getAttribute("id")+".mp4");
		document.querySelector("#now_t").innerHTML="00 : 00 : 00 : 00";
		document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
		document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
		style_change("all",18,menu,"#7E7E7E");
		layer_list.innerHTML="";
		if(document.querySelector("#movie_layer"))document.querySelector("#layer_list").removeChild(document.querySelector("#movie_layer"));
		add_layer("movie_layer","#layer_list");
		
		//이전에 time_track이 있으면 삭제
		if(document.querySelector("#time_track")) document.querySelector("#layer_list").removeChild(document.querySelector("#time_track"));
		
		//time track add event
		let track = document.createElement("div");
		track.setAttribute("id","time_track");
		document.querySelector("#layer_list").prepend(track);
		now_t = 0;
		canvas_load();
		//time track move event
		document.querySelector("#time_track").addEventListener("mousedown",(e)=>{
			initialization();
			style_change("all",18,menu,"#7E7E7E");
			track_cx = e.clientX;
			target = "time_track";
		});
		movie.addEventListener("loadedmetadata",function(){
			endtime = movie.duration;
			px_time = (endtime / 810);
			document.querySelector("#end_t").innerHTML=time_set(endtime);
		});
	}

	document.querySelector("#play_b").addEventListener("click",()=>{if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;} movie_play();});
	document.querySelector("#stop_b").addEventListener("click",()=>{if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;} movie_stop();});
	document.querySelector("#down_b").addEventListener("click",()=>{if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;} download();});

	function movie_play(){
		if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!");return false;}
		play=1;
		style_change("all",18,menu,"#7E7E7E");
		style_change("along",9,menu,"#C8C8C8");
		movie.play();
		initialization();
		now_t = movie.currentTime;
		let time_p = setInterval(function(){
			now_t = movie.currentTime;
			document.querySelector("#now_t").innerHTML=time_set(now_t);
			if(now_t >=endtime){
				clearInterval(time_p);
				style_change("along",9,menu,"#7E7E7E");
			}
			document.querySelector("#time_track").style.left = (now_t / px_time)+"px";
			track_mx = (now_t / px_time);
			for(let i=0; i <=drow_path[video_num].length-1; i++){
				if(now_t < layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
				if(now_t >= layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "block";
				if(now_t >= (layer_array[video_num][i][5]+layer_array[video_num][i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
			}
		},10);
	}

	function movie_stop(){
		if(play && movie.getAttribute("src") == null) {alert("동영상을 선택해주세요!");}
		movie.pause();
		style_change("along",11,menu,"#C8C8C8");
		style_change("along",9,menu,"#7E7E7E");
		play = 0;
	}

	function time_set(time){
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

	document.querySelector("body").addEventListener("click",out);
	document.querySelector("#alld_b").addEventListener("click",()=>{if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;} canvas_all_del();});

	let out_i=1,id =1,drow_ok,end=0,x,y,now_b = "";
	
	function setting(now){
		if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!");return false;}
		style_change("all",18,menu,"#7E7E7E");
		end = 0,drow_ok = id = out_i = 1,now_b = now;
		terminal("first",now+"_b");
	}

	// canvas
	document.querySelector("#free_b").addEventListener("click",()=>{setting("free");style_change("along",1,menu,"#C8C8C8");});
	document.querySelector("#squre_b").addEventListener("click",()=>{setting("squre");style_change("along",3,menu,"#C8C8C8");});
	document.querySelector("#text_b").addEventListener("click",()=>{setting("text");style_change("along",5,menu,"#C8C8C8");id = 1;});

	document.querySelector("#sle_b").addEventListener("click",()=>{
		if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;}
		if(document.querySelector("#canvas"+canvas_num[video_num])){now_b = "select";select();}
	});

	document.querySelector("#somed_b").addEventListener("click",()=>{
		if(movie.getAttribute("src") == null){alert("동영상을 선택해주세요!"); return false;}
		if(select_id && canvas_id>-1){now_b = "select_del"; select_del(select_id);}
	});
	
	//선택
	function select(){
		if(movie.getAttribute("src") == null){ alert("동영상을 선택해주세요!"); return false;}
		if(canvas_num[video_num] && now_b == "select"){
			style_change("all",18,menu,"#7E7E7E");
			style_change("along",7,menu,"#C8C8C8");
			movie_area.addEventListener("mousedown",(e)=>{drow_select(e);});
		}
	}

	function drow_select(e){
		let cx,cy; // 클릭한 좌표 (all)
		let sx,sy; // 현재좌표    (line)
		let tx,ty,tw,th; //x,y,width,height (text)
		let fx,fy,sw,sh; //x,y,width,height (squre)
		let canvas,ctx; // canvas 설정
		let select_ok = 0;
		if(now_b == "select" && !select_ok){
			if(!select_ok && now_b == "select"){
				cx = e.clientX-movie_area.getBoundingClientRect().x;
				cy = e.clientY-movie_area.getBoundingClientRect().y;
				if(select_id && canvas_id> -1){
					//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
					initialization();
					if(drow_path[video_num][canvas_id][5] == "squre"){
						squre_x = cx - fx;
						squre_y = cy - fy;
					}
				}
						
				for(let i=drow_path[video_num].length-1;i>=0;i--){
					if(drow_path[video_num][i][5] == "squre"){
						fx = drow_path[video_num][i][1][0];
						fy = drow_path[video_num][i][1][1];
						sw = drow_path[video_num][i][1][2];
						sh = drow_path[video_num][i][1][3];
						squre_x = cx - fx;
						squre_y = cy - fy;
						if((cx >= fx && cx <= (fx+sw)) && (cy >= fy && cy <= (fy+sh))){

							canvas_id = i;
							select_id = drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length);
							for(let i=0; i<layer_array[video_num].length;i++) if(layer_array[video_num][i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
							canvas = document.querySelector("#"+select_id);
							ctx = canvas.getContext("2d");
											
							select_num[0]=cx;
							select_num[1]=cy;

							//선택 테두리
							ctx.fillStyle = "#33CFD1";
							fx = drow_path[video_num][canvas_id][1][0];
							fy = drow_path[video_num][canvas_id][1][1];
							sw = drow_path[video_num][canvas_id][1][2];
							sh = drow_path[video_num][canvas_id][1][3];
							ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

							//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
							ctx.fillStyle = drow_path[video_num][canvas_id][3];
							fx = drow_path[video_num][canvas_id][1][0];
							fy = drow_path[video_num][canvas_id][1][1];
							sw = drow_path[video_num][canvas_id][1][2];
							sh = drow_path[video_num][canvas_id][1][3];
							ctx.fillRect(fx,fy,sw,sh);
							//공통적용사항
							select_ok = 1;
							break;
						}
					}else if(drow_path[video_num][i][5] == "line"){
						for(let k = 1; k<=drow_path[video_num][i][2];k++){
							if(cx + drow_path[video_num][i][4] >= Math.floor(drow_path[video_num][i][1][k][0]) && cx - drow_path[video_num][i][4] <= Math.floor(drow_path[video_num][i][1][k][0])){
								if(cy + drow_path[video_num][i][4] >= Math.floor(drow_path[video_num][i][1][k][1]) && cy - drow_path[video_num][i][4] <= Math.floor(drow_path[video_num][i][1][k][1])){
									canvas_id = i;
									select_id = drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length);
									for(let i=0; i<layer_array[video_num].length;i++) if(layer_array[video_num][i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
									canvas = document.querySelector("#"+select_id);
									ctx = canvas.getContext("2d");
											
									select_num[0]=i;
									select_num[1]=k;
									//선택 테두리
									ctx.strokeStyle = "#33CFD1";
									ctx.lineWidth = drow_path[video_num][i][4]+3;
									for(let h=1;h<=drow_path[video_num][i][2];h++){
										ctx.beginPath();
										if(h == 1){
											sx = drow_path[video_num][i][1][h][0];
											sy = drow_path[video_num][i][1][h][1];
										}
										ctx.moveTo(sx,sy);
										sx = drow_path[video_num][i][1][h][0];
										sy = drow_path[video_num][i][1][h][1];
										ctx.lineTo(sx,sy);
										ctx.stroke();
									}

									//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
									ctx.strokeStyle = drow_path[video_num][i][3];
									ctx.lineWidth = drow_path[video_num][i][4];
									for(let h=1;h<=drow_path[video_num][i][2];h++){
										ctx.beginPath();
										if(h == 1){
											sx = drow_path[video_num][i][1][h][0];
											sy = drow_path[video_num][i][1][h][1];
										}
										ctx.moveTo(sx,sy);
										sx = drow_path[video_num][i][1][h][0];
										sy = drow_path[video_num][i][1][h][1];
										ctx.lineTo(sx,sy);
										ctx.stroke();
									}
									//공통적용사항
									select_ok = 1;
									break;
								}
							}
						}
					}else if(drow_path[video_num][i][5] == "text"){
						if((drow_path[video_num][i][1][0] <= cx) && ((drow_path[video_num][i][1][0] + drow_path[video_num][i][1][2]) >= cx)){
							if((drow_path[video_num][i][1][1] <= cy) && ((drow_path[video_num][i][1][1] + drow_path[video_num][i][1][3]) >= cy)){
								canvas_id = i;
								select_id = drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length);
								for(let i=0; i<layer_array[video_num].length;i++) if(layer_array[video_num][i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
								canvas = document.querySelector("#"+select_id);
								ctx = canvas.getContext("2d");
												
								select_num[0]=cx;
								select_num[1]=cy;
								tx = drow_path[video_num][i][1][0];
								ty = drow_path[video_num][i][1][1];
								tw = drow_path[video_num][i][1][2];
								th = drow_path[video_num][i][1][3];
								//텍스트 외곽
								ctx.strokeStyle = "#33CFD1";
								ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

								//텍스트
								ctx.fillStyle = drow_path[video_num][canvas_id][3]; 
								ctx.font = drow_path[video_num][canvas_id][4]+"px ''";
								ctx.fillText(drow_path[video_num][canvas_id][2],tx,ty+drow_path[video_num][canvas_id][4]);

								//공통적용사항
								select_ok = 1;
								break;
							}
						}
					}
				}
			}

			if(select_ok && now_b == "select" && canvas_id > -1 && select_id !== 0){
				movie_area.onmousemove = function(e){
					if(select_ok && now_b == "select" && canvas_id > -1 && select_id !== 0){
						if(select_ok && select_id !== 0){
							canvas = document.querySelector("#"+select_id);
							ctx = canvas.getContext("2d");
							ctx.clearRect(0,0,canvas.width,canvas.height); // <- canvas 초기화
							let mx,my,tx,ty;

							ctx.strokeStyle = "#33CFD1";
							if(drow_path[video_num][canvas_id][5] == "line"){
								//선
								mx = Math.floor(drow_path[video_num][select_num[0]][1][select_num[1]][0] - (e.clientX-movie_area.getBoundingClientRect().x));
								my = Math.floor(drow_path[video_num][select_num[0]][1][select_num[1]][1] - (e.clientY-movie_area.getBoundingClientRect().y));
								ctx.lineWidth = drow_path[video_num][canvas_id][4]+3;
								for(let h=1;h<=drow_path[video_num][canvas_id][2];h++){
									ctx.beginPath();
									if(h == 1){
										sx = drow_path[video_num][canvas_id][1][1][0] - mx;
										sy = drow_path[video_num][canvas_id][1][1][1] - my;
									}
									ctx.moveTo(sx,sy);
									sx = drow_path[video_num][canvas_id][1][h][0] - mx;
									sy = drow_path[video_num][canvas_id][1][h][1] - my;
									ctx.lineTo(sx,sy);
									ctx.stroke();
								}
								ctx.strokeStyle = drow_path[video_num][canvas_id][3];
								ctx.lineWidth = drow_path[video_num][canvas_id][4];
								for(let h=1;h<=drow_path[video_num][canvas_id][2];h++){
									ctx.beginPath();
									if(h == 1){
										sx = drow_path[video_num][canvas_id][1][h][0] - mx;
										sy = drow_path[video_num][canvas_id][1][h][1] - my;
									}
									ctx.moveTo(sx,sy);
									sx = drow_path[video_num][canvas_id][1][h][0] = drow_path[video_num][canvas_id][1][h][0] - mx;
									sy = drow_path[video_num][canvas_id][1][h][1] = drow_path[video_num][canvas_id][1][h][1] - my;
									ctx.lineTo(sx,sy);
									ctx.stroke();
								}
							}else if(drow_path[video_num][canvas_id][5] == "squre"){
								//사각형
								mx = Math.floor((e.clientX-movie_area.getBoundingClientRect().x) - select_num[0]);
								my = Math.floor((e.clientY-movie_area.getBoundingClientRect().y) - select_num[1]);
								select_num[0] = (e.clientX-movie_area.getBoundingClientRect().x);
								select_num[1] = (e.clientY-movie_area.getBoundingClientRect().y);

								fx += mx;
								fy += my;
								drow_path[video_num][canvas_id][1][0] = fx;
								drow_path[video_num][canvas_id][1][1] = fy;
								//선택 테두리
								ctx.fillStyle = "#33CFD1";
								ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

								//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
								ctx.fillStyle = drow_path[video_num][canvas_id][3];
								ctx.fillRect(fx,fy,sw,sh);
							}else if(drow_path[video_num][canvas_id][5] == "text"){
								//텍스트
								mx = Math.floor((e.clientX-movie_area.getBoundingClientRect().x) - select_num[0]);
								my = Math.floor((e.clientY-movie_area.getBoundingClientRect().y) - select_num[1]);

								tx = drow_path[video_num][canvas_id][1][0] = drow_path[video_num][canvas_id][1][0]+mx;
								ty = drow_path[video_num][canvas_id][1][1] = drow_path[video_num][canvas_id][1][1]+my;
								tw = drow_path[video_num][canvas_id][1][2];
								th = drow_path[video_num][canvas_id][1][3];
								
								select_num[0] = (e.clientX-movie_area.getBoundingClientRect().x);
								select_num[1] = (e.clientY-movie_area.getBoundingClientRect().y);
								
								//텍스트 테두리
								ctx.strokeStyle = "#33CFD1";
								ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

								//텍스트
								ctx.fillStyle = drow_path[video_num][canvas_id][3]; 
								ctx.font = drow_path[video_num][canvas_id][4]+"px ''";
								ctx.fillText(drow_path[video_num][canvas_id][2],tx,ty+drow_path[video_num][canvas_id][4]);
							}
						}
					}
				}
			}

			movie_area.onmouseup = (e)=>{
				if(select_ok && now_b == "select" && select_id !== 0 && canvas_id>-1){
					//조건 변경
					select_ok = 0;
				}
			}
		}

		document.querySelector("html").addEventListener("click",function(e){
			cw = e.x;
			ch = e.y;
			if( now_b == "select" && canvas_num[video_num]){
				canvas_size = document.querySelector("#canvas"+canvas_num[video_num]).getBoundingClientRect();
				let layer_size =  document.querySelector("#layer_list").getBoundingClientRect();
				if(((cw > (layer_size.x+layer_size.width) || cw < layer_size.x) || (ch > (layer_size.y+layer_size.height) || ch < layer_size.y))&&((cw > (canvas_size.x+canvas_size.width) || cw < canvas_size.x) || (ch > (canvas_size.y+canvas_size.height) || ch < canvas_size.y))){
					//canvas에 적용
					if(select_id){
						canvas = document.querySelector("#"+select_id);
						ctx = canvas.getContext("2d");
						ctx.clearRect(0,0,canvas.width,canvas.height);
						ctx.strokeStyle = drow_path[video_num][canvas_id][3];
						initialization();
						select_ok = select_id = 0;
						canvas_id = -1;
						style_change("all",18,menu,"#7E7E7E");
						now_b = "";
						//layer
						for(let i=0; i<layer_array[video_num].length;i++)layer_backcolor((layer_array[video_num][i][0].substring(0,(layer_array[video_num][i][0].length-5))),"#C8C8C8");
					}
				}
			}
		});
	}

	function terminal(menu,id){
		initialization();
		if(menu == "out" || end || !drow_ok || now_b== "") return;
		if((menu == "squre_again" || id == "squre_b") && now_b == "squre") now_b = "squre";
		if((menu == "text_again" || id == "text_b") && now_b == "text") now_b = "text";
		if((menu == "free_again" || id == "free_b") && now_b == "free") now_b = "free";
		id = 1;drow();
	}

	function createCanvas(){
		canvas_num[video_num]++;
		canvas = document.createElement("canvas");
		canvas.className = "canvas";
		canvas.setAttribute("id","canvas"+canvas_num[video_num]);
		movie_area.appendChild(canvas);
		add_layer("canvas"+canvas_num[video_num]+"_layer","#layer_list");
		add_layer("layer"+layer_array[video_num].length+"_time","#canvas"+canvas_num[video_num]+"_layer");
		if(canvas_num[video_num] == 1){
			document.querySelector("#canvas"+canvas_num[video_num]).style.zIndex = 5;
			layer_zindex[video_num].push(5);
		}else{
			document.querySelector("#canvas"+canvas_num[video_num]).style.zIndex = layer_zindex[video_num][layer_zindex[video_num].length-1]+1;
			layer_zindex[video_num].push(layer_zindex[video_num][layer_zindex[video_num].length-1]+1);
		}
	}
	function drow(){
		let canvas,ctx,sx,sy,drawing = false,fx,fy,x,y,color = detail("color"),text_size = detail("text"),text_height;
		movie_area.onmousedown = (e)=>{
			if(now_b == "free" || now_b == "squre"){
				createCanvas();
				canvas = document.querySelector("#canvas"+canvas_num[video_num]);
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
				ctx = canvas.getContext("2d");
				drawing = true;
				id = 1;
			}
			if(!end && now_b == "free"){
				ctx.lineCap = "round";
				e.preventDefault();
				sx = canvasXY(e.clientX,"X");
				sy = canvasXY(e.clientY,"Y");
				drow_path_id[video_num]++;
				path_num=0;
				drow_path[video_num].push(Array("#canvas"+canvas_num[video_num],Array(1),1,color,detail("line"),"line",0,endtime));
			}else if(now_b == "text"){
				if(id == 1){
					drow_ok = 0;
					x = Number(e.offsetX);
					y = Number(e.offsetY);
					//input 생성
					text = document.createElement("input");
					text.type = "text";
					text.autofocus = true;
					text.className = "text_add";
					text.setAttribute("id","text_s");
					text.setAttribute("autofocus",true);
					text.zIndex = 100;
					text.style.top = y+"px";
					text.style.left = x+"px";
					text.style.fontSize = text_size+"px";
					text.style.color = color;
					text.setAttribute("size","5px");
					movie_area.appendChild(text);
					//벗어남?
					movie_area.addEventListener("mouseup",()=>{drow_ok++;});
					id++;
					document.querySelector(".text_add").onkeydown = (e)=>{
						if(document.querySelector(".text_add") && now_b == "text"){
							let src = document.querySelector(".text_add");
							if((src.getBoundingClientRect().left + (src.scrollWidth+15)) < movie_area.getBoundingClientRect().right){
								src.style.width = "5px";
								src.style.width = (src.scrollWidth+15)+"px";
								id++;
							}
						}
					}
				}
			}
		}
	
		movie_area.onmousemove = (e)=>{
			e.preventDefault();
			if(now_b == "free" && drawing){
				ctx.beginPath();
				ctx.moveTo(sx,sy);
				sx = canvasXY(e.clientX,"X");
				sy = canvasXY(e.clientY,"Y");
				ctx.lineTo(sx,sy);
				ctx.stroke();
				ctx.strokeStyle = color;
				ctx.lineWidth = detail("line");
				path_num++;
				drow_path[video_num][drow_path_id[video_num]][2] = path_num;
				drow_path[video_num][drow_path_id[video_num]][1].push(Array(sx,sy));
			}else if(drawing && now_b == "squre"){
				ctx.strokeStyle = color;
				x = Number(e.offsetX);
				y = Number(e.offsetY);
				if(id == 1 ){
					fx = x;
					fy = y;
				}
				ctx.clearRect(0,0,canvas.width,canvas.height);
				ctx.strokeRect(fx,fy,x-fx,y-fy);
				id++;
			}
		}
	
		movie_area.onmouseup = (e)=>{
			if(drawing && now_b == "free"){
				drawing = false;
				terminal("free_again");
			}else if(drawing && now_b == "squre"){
				ctx.fillStyle = color;
				ctx.fillRect(fx,fy,x-fx,y-fy);
				sx = (x - fx) < 0 ? -(x-fx) : (x-fx);
				sy = (y - fy) < 0 ? -(y-fy) : (y-fy);
				if( 0 > (x-fx)) fx += (x - fx);
				if( 0 > (y-fy)) fy += (y - fy);
				drow_path_id[video_num]++;
				drow_path[video_num].push(Array("#canvas"+canvas_num[video_num], Array(fx,fy,sx,sy),path_num,color,"nothing","squre",0,endtime));
				terminal("squre_again");
			}
		}
	
		movie_area.addEventListener("click",(e)=>{
			if(id <=2 && document.querySelector("#text_s") && now_b == "text"){document.querySelector("#text_s").focus(); return 1;}
			if(now_b == "text" && drow_ok !== 1){
				now_b = "";
				text_d = document.querySelector("#text_s");
				if(text_d && text_d.value.length >0){
					createCanvas();
					canvas = document.querySelector("#canvas"+canvas_num[video_num]);
					ctx = canvas.getContext("2d");
					canvas.width = canvas.offsetWidth;  
					canvas.height = canvas.offsetHeight;
					text_size = detail("text");
					ctx.fillStyle = detail("color"); 
					ctx.font = text_size+"px ''";
					x = parseInt(text_d.style.left) + 2;
					y = parseInt(text_d.style.top) + text_size +2;
					ctx.fillText(text_d.value,x,y);
					text_height = text_size <= 16 ? 18 : text_size <=18 ? 21 : text_size <=24 ? 28 : 32;
					drow_path_id[video_num]++;
					drow_path[video_num].push(Array("#canvas"+canvas_num[video_num],Array(x,(y-text_size),parseInt(text_d.style.width),text_height),text_d.value,detail("color"),text_size,"text",0,endtime));
					text_d.remove();
					style_change("all",18,menu,"#7E7E7E");
				}else text_d.remove();
			}
		});
		function canvasXY(client,type){
			let bound = canvas.getBoundingClientRect();
			let bw = 5;
			if(type == "X") return ( client - bound.left - bw)*(canvas.width/(bound.width - bw* 2));
			else return (client - bound.top - bw)*(canvas.height/(bound.height - bw *2));
		}
	}

	//canvas 세부설정
	function detail(id){
		if(id == "color") return document.querySelector("#color_v").options[document.querySelector("#color_v").selectedIndex].value;
		else if(id == "line") return Number(document.querySelector("#thick_v").options[document.querySelector("#thick_v").selectedIndex].value);
		else return Number(document.querySelector("#text_size_v").options[document.querySelector("#text_size_v").selectedIndex].value);
	}

	//canvas 벗어남 판단
	function out(e){
		if(document.querySelector("#canvas"+canvas_num[video_num]) && drow_ok){
			let click_w = e.x;
			let click_h = e.y;
			end = 0;
			let canvas_size = document.querySelector("#canvas"+canvas_num[video_num]).getBoundingClientRect();
			if(!out_i && (click_w > (canvas_size.x+canvas_size.width) || click_w < canvas_size.x) || (click_h > (canvas_size.y+canvas_size.height) || click_w < canvas_size.y))  end = 1;
			out_i = 0;
			if(end) {
				style_change("all",18,menu,"#7E7E7E");
				for(let i=0; i<layer_array[video_num].length;i++)layer_backcolor((layer_array[video_num][i][0].substring(0,(layer_array[video_num][i][0].length-5))),"#C8C8C8");
				drow_ok=0;
				now_b = "";
				initialization();
			}
		}
	}

	//canvas 전체 삭제
	function canvas_all_del(){
		style_change("all",18,menu,"#7E7E7E");
		if(document.querySelector("input"))movie_area.removeChild(document.querySelector("input"));
		for(let i=1;i<=canvas_num[video_num];i++) movie_area.removeChild(document.querySelector("#canvas"+i));
		for(let i=1;i<=canvas_num[video_num];i++) document.querySelector("#layer_list").removeChild(document.querySelector("#canvas"+i+"_layer"));
		canvas_num[video_num]=canvas_id=0;
		layer_array[video_num].splice(0,layer_array[video_num].length);
		drow_path[video_num].splice(0,drow_path[video_num].length);
		layer_zindex[video_num].splice(0,layer_zindex[video_num].length);
		select_id = "";
		layer_list = (0,layer_array[video_num].length);
		path_num = 0;
		drow_path_id[video_num] = -1;
	}

	//canvas 일부삭제
	function select_del(id){
		if(now_b == "select_del"){
			if(document.querySelector("#"+id)){
				movie_area.removeChild(document.querySelector("#"+id));
				layer_array[video_num].splice(canvas_id,1);
				drow_path[video_num].splice(canvas_id,1);
				layer_zindex[video_num].splice(canvas_id,1);
				document.querySelector("#layer_list").removeChild(document.querySelector("#"+id+"_layer"));
				style_change("all",18,menu,"#7E7E7E");
				now_b = "";
				for(let i=canvas_id+1;i<layer_array[video_num].length+1;i++){
					layer_zindex[video_num][i-1] = layer_zindex[video_num][i-1]--;

					let name = "#"+(layer_array[video_num][i][0].substring(0,layer_array[video_num][i-1][0].length - 5));
					let name2 = document.querySelector("#"+layer_array[video_num][i-1][0]).parentNode.id;
					document.querySelector(name+"_left").remove();
					document.querySelector(name+"_center").remove();
					document.querySelector(name+"_right").remove();
					document.querySelector("#"+layer_array[video_num][i-1][0]).remove();
					let id_time = layer_array[video_num][i-1][0];
					let layer_add = document.createElement("div");
					layer_add.className = "layer_time";
					layer_add.setAttribute("id",id_time);
					document.querySelector("#"+name2).prepend(layer_add);
					document.querySelector("#"+layer_array[video_num][i][0]).addEventListener("click",function(){layer_detail(i-1, "change");});

					document.querySelector("#"+id_time).style.left = "0px";
					layer_append(Number(layer_array[video_num][i][0].substring(5,layer_array[video_num][i-1][0].length - 5)),id_time);
					//기타작업
					document.querySelector("#"+layer_array[video_num][i-1][0]).style.left = layer_array[video_num][i-1][3]+"px";
					document.querySelector("#"+layer_array[video_num][i-1][0]).style.right = layer_array[video_num][i-1][4]+"px";
					document.querySelector("#"+layer_array[video_num][i-1][0]).style.width = (810 -layer_array[video_num][i-1][3] - layer_array[video_num][i-1][4])+"px";
				}

				for(let i=canvas_id+2;i<=canvas_num[video_num];i++){
					document.querySelector("#canvas"+i+"_layer").setAttribute("id","canvas"+(i-1)+"_layer");
					document.querySelector("#canvas"+i).setAttribute("id","canvas"+(i-1));
					drow_path[video_num][i-2][0] = "#canvas"+(i-1);
				}
				path_num = select_ok = select_id = 0;
				canvas_id = -1;
				canvas_num[video_num]--;
				drow_path_id[video_num]--;

				document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
				document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
			}
		}
	}

	//menu css 변경(background-color)
	function style_change(item,num,parent,color){
		if(item == "all") for(let i = 1;i<=18;i+=2) parent.parentNode.childNodes[i].style.backgroundColor = color;
		else parent.parentNode.childNodes[num].style.backgroundColor = color;
	}

	//layer추가
	function add_layer(id,append){
		let layer_add = document.createElement("div");
		if(append == "#canvas"+canvas_num[video_num]+"_layer"){
			layer_add.className = "layer_time";
			layer_array[video_num].push(Array(id,"00 : 00 : 00 : 00",time_set(endtime),0,0,0,endtime,0));
		}else{
			layer_add.className = "layer";
		}
		layer_add.setAttribute("id",id);
		document.querySelector(append).prepend(layer_add);
		if(append == "#canvas"+canvas_num[video_num]+"_layer"){
			document.querySelector("#"+id).style.left = "0px";
			layer_append(layer_array[video_num].length-1,id);
			for(let i=0;i<layer_array[video_num].length;i++) if(i == layer_array[video_num].length-1) document.querySelector("#"+id).addEventListener("click",function(){layer_detail(i, "change");});
		}
	}

	//layer 선택 => 변경(시작시간/유지시간)
	function layer_detail(index,type){
		for(let i=0; i<layer_array[video_num].length;i++){
			console.log(layer_array,video_num,i);
			document.querySelector("#"+layer_array[video_num][i][0]).style.backgroundColor = "#C8C8C8";
		}
		if(type == "change"){
			document.querySelector("#"+layer_array[video_num][index][0]).style.backgroundColor = "#17AFB1";
			document.querySelector("#start_t").innerHTML = layer_array[video_num][index][1];
			document.querySelector("#keep_t").innerHTML = layer_array[video_num][index][2];
			now_b = "select";
			style_change("all",18,menu,"#7E7E7E");
			style_change("along",7,menu,"#C8C8C8");
			select_ok = 0;

			initialization();

			select_id = document.querySelector("#"+layer_array[video_num][index][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][index][0]).parentNode.id.length - 6);
			for(let i=0; i <=drow_path[video_num].length-1; i++) if(drow_path[video_num][i][0] == "#"+select_id) canvas_id = i;
			canvas = document.querySelector("#"+select_id);
			ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,canvas.width,canvas.height);
			if(drow_path[video_num][canvas_id][5] == "line"){
				ctx.lineWidth = drow_path[video_num][canvas_id][4]+3;
				for(let h=1;h<=drow_path[video_num][canvas_id][2];h++){
					ctx.strokeStyle ="#33CFD1";
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[video_num][canvas_id][1][h][0];
						sy = drow_path[video_num][canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[video_num][canvas_id][1][h][0];
					sy = drow_path[video_num][canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
				ctx.strokeStyle = drow_path[video_num][canvas_id][3];
				ctx.lineWidth = drow_path[video_num][canvas_id][4];
				for(let h=1;h<=drow_path[video_num][canvas_id][2];h++){
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[video_num][canvas_id][1][h][0];
						sy = drow_path[video_num][canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[video_num][canvas_id][1][h][0];
					sy = drow_path[video_num][canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
			}else if(drow_path[video_num][canvas_id][5] == "squre"){
				//선택 테두리
				ctx.fillStyle ="#33CFD1";
				fx = drow_path[video_num][canvas_id][1][0];
				fy = drow_path[video_num][canvas_id][1][1];
				sw = drow_path[video_num][canvas_id][1][2];
				sh = drow_path[video_num][canvas_id][1][3];
				ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

				//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
				ctx.fillStyle = drow_path[video_num][canvas_id][3];
				ctx.fillRect(fx,fy,sw,sh);
			}else{
				tx = drow_path[video_num][canvas_id][1][0];
				ty = drow_path[video_num][canvas_id][1][1];
				tw = drow_path[video_num][canvas_id][1][2];
				th = drow_path[video_num][canvas_id][1][3];
				
				//텍스트 테두리
				ctx.strokeStyle = "#33CFD1";
				ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

				//텍스트
				ctx.fillStyle = drow_path[video_num][canvas_id][3]; 
				ctx.font = drow_path[video_num][canvas_id][4]+"px ''";
				ctx.fillText(drow_path[video_num][canvas_id][2],tx,ty+drow_path[video_num][canvas_id][4]);
			}
			//out?
			document.querySelector("html").addEventListener("click",function(e){
				cx = e.clientX-movie_area.getBoundingClientRect().x;
				cy = e.clientY-movie_area.getBoundingClientRect().y;
				if(select_id && canvas_id> -1){
					//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
					console.log(canvas_id,drow_path);
					if(drow_path[video_num][canvas_id][5] == "squre"){
						squre_x = cx - fx;
						squre_y = cy - fy;
					}
				}
				cw = e.x;
				ch = e.y;
				if( now_b == "select" && canvas_num[video_num]){
					canvas_size = document.querySelector("#canvas"+canvas_num[video_num]).getBoundingClientRect();
					let layer_size =  document.querySelector("#layer_list").getBoundingClientRect();
					if(((cw > (layer_size.x+layer_size.width) || cw < layer_size.x) || (ch > (layer_size.y+layer_size.height) || ch < layer_size.y))&&((cw > (canvas_size.x+canvas_size.width) || cw < canvas_size.x) || (ch > (canvas_size.y+canvas_size.height) || ch < canvas_size.y))){
						//canvas에 적용
						if(select_id){
							initialization();
							layer_detail(1,"not_change");
							select_ok = select_id = 0;
							canvas_id = -1;
							style_change("all",18,menu,"#7E7E7E");
							now_b = "";
							for(let i=0; i<layer_array[video_num].length;i++) layer_backcolor((layer_array[video_num][i][0].substring(0,(layer_array[video_num][i][0].length-5))),"#C8C8C8");//layer
						}
					}
				}
			});
			now_b = "select";
			select();
		}
		if(index > -1 && index <layer_array[video_num].length) select_layer = document.querySelector("#"+layer_array[video_num][index][0]).id.substring(0,(document.querySelector("#"+layer_array[video_num][index][0]).id.length-5)); 
		if(select_layer && now_b == "select"){
			for(let i=0; i<layer_array[video_num].length;i++) layer_backcolor((layer_array[video_num][i][0].substring(0,(layer_array[video_num][i][0].length-5))),"#C8C8C8");
			layer_backcolor(select_layer,"#17AFB1");
			document.querySelector("#"+select_layer+"_left").addEventListener("mousedown",function(e){target = "left";left_cx = e.clientX;});
			document.querySelector("#"+select_layer+"_right").addEventListener("mousedown",function(e){target = "right";right_cx = e.clientX;});
			document.querySelector("#"+select_layer+"_center").addEventListener("mousedown",(e)=>{target = "center";center_cx = e.clientX;});
			document.querySelector("#"+select_layer+"_center").addEventListener("dblclick",(e)=>{
				document.querySelector("#"+select_layer+"_center").addEventListener("mousedown",(e)=>{
					target = "swap";
					for(let i=0;i<layer_array[video_num].length;i++) if(document.querySelector("#"+select_layer+"_time") == document.querySelector("#"+layer_array[video_num][i][0]))layer_swap_one = i;
					center_cy = e.clientY;
					for(let i = 0; i < layer_array[video_num].length; i++) document.querySelector("#"+(document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id)).style.zIndex = 5;
					document.querySelector("#"+(document.querySelector("#"+select_layer+"_time").parentNode.id)).style.zIndex = 10;
					center_layer_my = typeof(document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top) == "number" ? document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top : layer_array[layer_swap_one][7];
					layer_list_h = document.querySelector("#layer_list").getBoundingClientRect().top;
					layer_swap = 1;
				});
			});
		}
	}

	//canvas 테두리 지우기
	function initialization(){
		if(canvas_id > -1 && select_id){
			//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
			let sx,sy,ctx,canvas,sw,sh;
			canvas = document.querySelector("#"+select_id);
			ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,canvas.width,canvas.height);
			if(drow_path[video_num][canvas_id][5] == "line"){
				ctx.strokeStyle = drow_path[video_num][canvas_id][3];
				ctx.lineWidth = drow_path[video_num][canvas_id][4];
				for(let h=1;h<=drow_path[video_num][canvas_id][2];h++){
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[video_num][canvas_id][1][h][0];
						sy = drow_path[video_num][canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[video_num][canvas_id][1][h][0];
					sy = drow_path[video_num][canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
			}else if(drow_path[video_num][canvas_id][5] == "squre"){
				ctx.fillStyle = drow_path[video_num][canvas_id][3];
				fx = drow_path[video_num][canvas_id][1][0];
				fy = drow_path[video_num][canvas_id][1][1];
				sw = drow_path[video_num][canvas_id][1][2];
				sh = drow_path[video_num][canvas_id][1][3];
				ctx.fillRect(fx,fy,sw,sh);
			}else if(drow_path[video_num][canvas_id][5] == "text"){
				tx = drow_path[video_num][canvas_id][1][0];
				ty = drow_path[video_num][canvas_id][1][1];
				//텍스트
				ctx.fillStyle = drow_path[video_num][canvas_id][3]; 
				ctx.font = drow_path[video_num][canvas_id][4]+"px ''";
				ctx.fillText(drow_path[video_num][canvas_id][2],tx,ty+drow_path[video_num][canvas_id][4]);
			}
			layer_detail(1,"not_change");
		}
	}
	
	window.addEventListener("mousemove", e => {
		if(target == null ) return;
		let time_layer = document.querySelector("#"+select_layer+"_time"),play_time = 0;;
		for(let i=0; i <=drow_path[video_num].length-1; i++){
			if(layer_array[video_num][i][0] == select_layer+"_time"){
				left_layer_mx = layer_array[video_num][i][3];
				right_layer_mx = layer_array[video_num][i][4];
			}
		}
		if(target == "left") {
			st=et=0;
			left_bar = document.querySelector("#"+select_layer+"_left");
			x = e.clientX - left_cx;
			left_layer_mx += x;
			left_layer_mx = left_layer_mx < 0 ? 0 :left_layer_mx > 785 ? 785 : left_layer_mx;
			left_layer_mx = (left_layer_mx+right_layer_mx) > 785 ? left_layer_mx - x : left_layer_mx;
			time_layer.style.left = (left_layer_mx + x)+"px";
			time_layer.style.width = (810 - (left_layer_mx + x + right_layer_mx) + "px") > 810 ? "810px" : (810 - (left_layer_mx + x + right_layer_mx) + "px") < 25 ? "25px" : 810 - (left_layer_mx + x + right_layer_mx) + "px";
			left_cx = e.clientX;
			//시간조정
			for(let i = 0;i < (left_layer_mx + x); i++) st += px_time;
			for(let i = 0;i < (810 - (left_layer_mx + x + right_layer_mx)); i++) et += px_time;
			et = et > endtime ? endtime : et;
			document.querySelector("#start_t").innerHTML = time_set(st);
			document.querySelector("#keep_t").innerHTML = time_set(et);
			for(let i=0; i <=drow_path[video_num].length-1; i++){
				if(layer_array[video_num][i][0] == select_layer+"_time"){
					layer_array[video_num][i][1] = time_set(st);
					layer_array[video_num][i][2] = time_set(et);
					layer_array[video_num][i][3] = left_layer_mx;
					layer_array[video_num][i][5] = st;
					layer_array[video_num][i][6] = et;
					play_time = movie.currentTime;
					if(play_time < layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
					if(play_time >= layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "block";
					if(play_time >= (layer_array[video_num][i][5]+layer_array[video_num][i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
				}
			}
			for(let i =0;i < drow_path[video_num].length;i++){
				if("#"+time_layer.parentNode.id.substring(0,time_layer.parentNode.id.length - 6) == drow_path[video_num][i][0]){
					drow_path[video_num][i][6] = st;
					drow_path[video_num][i][7] = et;
				}
			}
		}else if(target == "right"){
			st=et=0;
			right_bar = document.querySelector("#"+select_layer+"_right");
			x = right_cx - e.clientX;
			right_layer_mx += x;
			right_layer_mx = right_layer_mx < 0 ? 0 : right_layer_mx > 785 ? 785 : right_layer_mx;
			right_layer_mx = (right_layer_mx + left_layer_mx) > 785 ? right_layer_mx - x : right_layer_mx;
			time_layer.style.right = (right_layer_mx + x)+"px";
			time_layer.style.width = (810 - (right_layer_mx + x + left_layer_mx) + "px") > 810 ? "810px" : (810 - (right_layer_mx + x + left_layer_mx) + "px") < 25 ? "25px" : 810 - (right_layer_mx + x + left_layer_mx) + "px";
			right_cx = e.clientX;
			//시간조정
			for(let i = 0;i < (810 - (right_layer_mx + x + left_layer_mx)); i++) et += px_time;
			et = et > endtime ? endtime : et;
			document.querySelector("#keep_t").innerHTML = time_set(et);
			for(let i=0; i <=drow_path[video_num].length-1; i++){
				if(layer_array[video_num][i][0] == select_layer+"_time"){
					layer_array[video_num][i][2] = time_set(et);
					layer_array[video_num][i][4] = right_layer_mx;
					layer_array[video_num][i][6] = et;
					play_time = movie.currentTime;
					if(play_time < layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
					if(play_time >= layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "block";
					if(play_time >= (layer_array[video_num][i][5]+layer_array[video_num][i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
				}
			}
			
			for(let i =0;i < drow_path[video_num].length;i++) if("#"+time_layer.parentNode.id.substring(0,time_layer.parentNode.id.length - 6) == drow_path[video_num][i][0])drow_path[video_num][i][7] = et;
		}else if(target == "center"){
			st=et=0;
			x = e.clientX - center_cx;
			let mx = left_layer_mx + x;
			mx = mx < 0 ? 0 : mx;
			mx = (mx + parseInt(time_layer.getBoundingClientRect().width)) > 809 ? mx - x : mx;
			time_layer.style.left = mx+"px";
			time_layer.style.right = right_layer_mx+"px";
			left_layer_mx = mx;
			right_layer_mx = (810 - (mx + parseInt(time_layer.getBoundingClientRect().width))) > -1 ? (810 - (mx + parseInt(time_layer.getBoundingClientRect().width))) : 0;
			center_cx = e.clientX;
			for(let i =0;i < drow_path[video_num].length;i++){
				if("#"+time_layer.parentNode.id.substring(0,time_layer.parentNode.id.length - 6) == drow_path[video_num][i][0]){
					drow_path[video_num][i][6] = st;
					play_time = movie.currentTime;
					if(play_time < layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
					if(play_time >= layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "block";
					if(play_time >= (layer_array[video_num][i][5]+layer_array[video_num][i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
				}
			}
			//시간조정
			for(let i = 0;i < (left_layer_mx); i++) st += px_time;
			document.querySelector("#start_t").innerHTML = time_set(st);
			for(let i=0; i <=drow_path[video_num].length-1; i++){
				if(layer_array[video_num][i][0] == select_layer+"_time"){
					layer_array[video_num][i][1] = time_set(st);
					layer_array[video_num][i][3] = left_layer_mx;
					layer_array[video_num][i][4] = right_layer_mx;
					layer_array[video_num][i][5] = st;
				}
			}
		}else if(target == "time_track"){
			x = e.clientX - track_cx;
			let mx = track_mx + x;
			mx = mx < 0 ? 0 : mx > (endtime / px_time) ? (endtime / px_time) : mx;
			document.querySelector("#time_track").style.left = mx + "px";
			track_cx = e.clientX;
			track_mx = mx;
			for(let i=0; i<mx;i++) play_time += px_time;
			movie.currentTime = play_time;
			document.querySelector("#now_t").innerHTML=time_set(play_time);
			document.querySelector("#time_track").style.left = mx + "px";
			for(let i=0; i <=drow_path[video_num].length-1; i++){
				if(play_time < layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
				if(play_time >= layer_array[video_num][i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "block";
				if(play_time >= (layer_array[video_num][i][5]+layer_array[video_num][i][6]))document.querySelector("#"+document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id.length - 6)).style.display = "none";
			}
		}else if(target == "swap"){
			//layer swap
			if(layer_array[video_num].length > 2 && layer_swap){
				let n=0,n1=0;
				for(let i=0;i<layer_swap_one;i++) n +=30;
				for(let i = layer_swap_one;i<layer_array[video_num].length;i++) n1 -= 30;
				y = center_cy - e.clientY;
				center_layer_my -= y;
				center_layer_my = center_layer_my < n1 ? n1 : center_layer_my > n ? n : center_layer_my;
				document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top = center_layer_my + "px";
				for(let i = 0; i < layer_array[video_num].length; i++){
					if((select_layer+"_time") !== (layer_array[video_num][i][0])){
						if(document.querySelector("#"+layer_array[video_num][i][0]).getBoundingClientRect().top + 2 > document.querySelector("#"+select_layer+"_time").getBoundingClientRect().top){
							if(document.querySelector("#"+layer_array[video_num][i][0]).getBoundingClientRect().top - 2 < document.querySelector("#"+select_layer+"_time").getBoundingClientRect().top){
								layer_swap_two = i;
								layer_swap = 2;
							}else layer_swap = 1;
						}else layer_swap = 1;
					}else layer_swap = 1;
				}
				center_cy = e.clientY;
			}
		}
	});

	window.addEventListener("mouseup", ()=>{
		target = null;
		if(layer_swap_one > -1) document.querySelector("#"+document.querySelector("#"+layer_array[video_num][layer_swap_one][0]).parentNode.id).style.top = layer_array[layer_swap_one][7]+"px";
		if(layer_swap > 1){
			let name,name2;
			if(layer_swap_one == layer_swap_two) return false;
			name = layer_zindex[video_num][layer_swap_one];
			layer_zindex[video_num][layer_swap_one] = layer_zindex[video_num][layer_swap_two];
			layer_zindex[video_num][layer_swap_two] = name;
			name = document.querySelector("#"+layer_array[video_num][layer_swap_one][0]).parentNode.id;
			name2= document.querySelector("#"+layer_array[video_num][layer_swap_two][0]).parentNode.id;
			change(name,name2);//상위id 교환
			name = layer_array[video_num][layer_swap_one][0];
			name2 = layer_array[video_num][layer_swap_two][0];
			change(name,name2);//id 교환
			name = layer_array[video_num][layer_swap_one][0].substring(0,layer_array[video_num][layer_swap_one][0].length - 5);
			name2 = layer_array[video_num][layer_swap_two][0].substring(0,layer_array[video_num][layer_swap_two][0].length - 5);
			//layer
			change(name+"_left",name2+"_left");
			change(name+"_left",name2+"_center");
			change(name+"_left",name2+"_right");
			
			for(let i = 0;i<7;i++){
				name = layer_array[video_num][layer_swap_one][i];
				layer_array[video_num][layer_swap_one][i] = layer_array[video_num][layer_swap_two][i];
				layer_array[video_num][layer_swap_two][i] = name;
			}
			layer_swap = 0;
			for(let i=0;i<layer_array[video_num].length;i++){
				name = "#"+(layer_array[video_num][i][0].substring(0,layer_array[video_num][i][0].length - 5));
				name2 = document.querySelector("#"+layer_array[video_num][i][0]).parentNode.id;
				let layer = document.querySelector("#"+layer_array[video_num][i][0]);
				document.querySelector(name+"_left").remove();
				document.querySelector(name+"_center").remove();
				document.querySelector(name+"_right").remove();
				layer.remove();
				let id_time = layer_array[video_num][i][0],layer_add = document.createElement("div");
				layer_add.className = "layer_time";
				layer_add.setAttribute("id",id_time);
				document.querySelector("#"+name2).prepend(layer_add);
				layer.addEventListener("click",function(){layer_detail(i, "change");});

				document.querySelector("#"+id_time).style.left = "0px";
				layer_append(Number(layer_array[video_num][i][0].substring(5,layer_array[video_num][i][0].length - 5)),id_time);
				//기타작업
				layer.style.left = layer_array[video_num][i][3]+"px";
				layer.style.right = layer_array[video_num][i][4]+"px";
				layer.style.width = (810 -layer_array[video_num][i][3] - layer_array[video_num][i][4])+"px";
			}
			for (let i=drow_path[video_num].length-1;i>=0;i--) document.querySelector(drow_path[video_num][i][0]).style.zIndex = layer_zindex[video_num][i];
			layer_backcolor(layer_array[video_num][layer_swap_two][0].substring(0,layer_array[video_num][layer_swap_two][0].length - 5),"#17AFB1");
		}
	});
	function change(name1,name2){
		document.querySelector("#"+name2).setAttribute("id",name1+"1");
		document.querySelector("#"+name1).setAttribute("id",name2);
		document.querySelector("#"+name1+"1").setAttribute("id",name1);
	}

	function layer_append(id,parent){
		let left = document.createElement("div");
		let center = document.createElement("div");
		let right = document.createElement("div");
		left.className = "layer_left";
		center.className = "layer_center";
		right.className = "layer_right";
		left.setAttribute("id","layer"+id+"_left");
		center.setAttribute("id","layer"+id+"_center");
		right.setAttribute("id","layer"+id+"_right");
		document.querySelector("#"+parent).prepend(right);
		document.querySelector("#"+parent).prepend(center);
		document.querySelector("#"+parent).prepend(left);
	}
	function layer_backcolor(id,color){
		console.log(id);
		document.querySelector("#"+id+"_left").style.backgroundColor = color;
		document.querySelector("#"+id+"_center").style.backgroundColor = color;
		document.querySelector("#"+id+"_right").style.backgroundColor = color;
	}
	function download(){
		let content = `<!doctype html>
						<head>
							<title>BIFF 부산 국제 영화제</title>
						</head>
						<body>
							<div id = "view" style = "position:relative; width: 900px; height: 500px; background-color:#000;">
								<video src="file:///C:/Users/School/Desktop/B과제_(구)/`+video_src+`" controls style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></video>`;
		for(let i=0; i<drow_path[video_num].length;i++){
			let view_img = null;
			let con = document.querySelector(drow_path[video_num][i][0]);
			view_img = document.createElement("img");
			view_img.width = 900;
			view_img.height = 500;
			view_img.src = con.toDataURL();
			view_img.style = con.style.cssText;
			view_img.className = "clip";
			view_img.style.position = "absolute";
			view_img.style.pointerEvents = "none";
			view_img.style.left = "0px";
			view_img.style.top = "0px";
			view_img.dataset.start = drow_path[video_num][i][6];
			view_img.dataset.duration = drow_path[video_num][i][7];
			content +=(view_img.outerHTML);
		}
		content +=`</div>
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
								x.style.visibility = "visible";
							}else{
								x.style.visibility = "hidden";
							}
						});
					}
				}
				
				requestAnimationFrame(frame);
				
			</script>
		</body>
		</html>`;
		let blob = new Blob([content],{type : "text/html; charset=utf8"});
		let now = new Date();

		let downBtn = document.createElement("a");
		downBtn.href = URL.createObjectURL(blob);
		downBtn.download = "movie-["+String(now)+"].html";
		document.body.append(downBtn);
		downBtn.click();
		downBtn.remove();
	}

	function canvas_load(){
		for(let i=0;i<drow_path[video_num].length;i++){
			//canvas add
			let canvas = document.createElement("canvas");
			canvas.setAttribute("id",drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length));
			canvas.className = "canvas";
			movie_area.append(canvas);
			canvas = document.querySelector(drow_path[video_num][i][0]);
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			ctx = canvas.getContext("2d");
			canvas.zIndex = layer_zindex[video_num][i];
			//layer add
			let layer_add = document.createElement("div");
			layer_add.className = "layer";
			layer_add.setAttribute("id",drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length)+"_layer");
			console.log(drow_path[video_num][i][0].substring(1,drow_path[video_num][i][0].length),drow_path[video_num][i][0]);
			document.querySelector("#layer_list").prepend(layer_add);
			let layer_add_ad = document.createElement("div");
			layer_add_ad.className = "layer_time";
			layer_add_ad.setAttribute("id",layer_array[video_num][i][0]);
			document.querySelector(drow_path[video_num][i][0]+"_layer").prepend(layer_add_ad);
			layer_append(layer_array[video_num][i][0].substring(5,layer_array[video_num][i][0].length -5),layer_array[video_num][i][0]);
			document.querySelector("#"+layer_array[video_num][i][0]).addEventListener("click",function(){layer_detail(i, "change");});
			console.log(layer_array[video_num][i][3],layer_array[video_num][i][4]);
			document.querySelector("#"+layer_array[video_num][i][0]).style.width = (810 - layer_array[video_num][i][3] - layer_array[video_num][i][4])+"px";
			document.querySelector("#"+layer_array[video_num][i][0]).style.left = layer_array[video_num][i][3]+"px";
			document.querySelector("#"+layer_array[video_num][i][0]).style.right = layer_array[video_num][i][4]+"px";
			if(drow_path[video_num][i][5] == "squre"){
				//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
				ctx.fillStyle = drow_path[video_num][i][3];
				fx = drow_path[video_num][i][1][0];
				fy = drow_path[video_num][i][1][1];
				sw = drow_path[video_num][i][1][2];
				sh = drow_path[video_num][i][1][3];
				ctx.fillRect(fx,fy,sw,sh);
			}else if(drow_path[video_num][i][5] == "line"){
				console.log(video_num);
				for(let k = 1; k<=drow_path[video_num][i][2];k++){
					//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
					ctx.strokeStyle = drow_path[video_num][i][3];
					ctx.lineWidth = drow_path[video_num][i][4];
					for(let h=1;h<=drow_path[video_num][i][2];h++){
						ctx.beginPath();
						if(h == 1){
							sx = drow_path[video_num][i][1][h][0];
							sy = drow_path[video_num][i][1][h][1];
						}
						ctx.moveTo(sx,sy);
						sx = drow_path[video_num][i][1][h][0];
						sy = drow_path[video_num][i][1][h][1];
						ctx.lineTo(sx,sy);
						ctx.stroke();
					}
				}
			}else if(drow_path[video_num][i][5] == "text"){
				tx = drow_path[video_num][i][1][0];
				ty = drow_path[video_num][i][1][1];
				ctx.fillStyle = drow_path[video_num][i][3]; 
				ctx.font = drow_path[video_num][i][4]+"px ''";
				ctx.fillText(drow_path[video_num][i][2],tx,ty+drow_path[video_num][i][4]);
			}
		}
	}
}