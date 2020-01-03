window.onload=function(){
	
	let movie = document.querySelector("#video");
	let movie_area = document.querySelector("#play_video");
	let now_t,endtime,canvas,canvas_num=0,play=0;
	let menu = document.querySelector(".menu_button");
	let layer_list = document.querySelector("#layer_list"),layer_num = 0;
	let layer_array=Array(); //id | start_time | end_time | left_layer_mx | right_layer_mx | start_sc | end_sc | center_my;
	let select_id,select_num=Array(1,1);
	let drow_path = Array(); //id | (x,y) | (x,y) num | color | thick(text) | type; if(text) id , (x,y,width,height), content , color, text_size, text
	let path_num = 0,drow_path_id = -1;
	let layer_zindex = Array();
	let layer_zindex_max = 5;
	let canvas_id = 0;
	let layer_click_e = new Event('click');
	let select_layer;
	let target = null,left_layer_mx = 0,right_layer_mx = 0;
	let left_cx,right_cx,px_time = 0,center_cx,track_cx,track_mx = 0,layer_list_h,center_cy,center_layer_my,layer_swap=1,layer_swap_one,layer_swap_two;
	let st=0,et=0;
	for(let i=1; i<6;i++) document.querySelector("#movie"+i).addEventListener("click",movie_set);
	
	function movie_set(){
		movie.setAttribute("src","movie/"+this.getAttribute("id")+".mp4");
		document.querySelector("#now_t").innerHTML="00 : 00 : 00 : 00";
		document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
		document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
		canvas_all_del();
		style_change("all",18,menu,"#6B747D");
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
		
		//time track move event
		document.querySelector("#time_track").addEventListener("mousedown",(e)=>{
			initialization();
			style_change("all",18,menu,"#6B747D");
			track_cx = e.clientX;
			target = "time_track";
		});
		movie.addEventListener("loadedmetadata",function(){
			endtime = movie.duration;
			px_time = (endtime / 810);
			document.querySelector("#end_t").innerHTML=time_set(endtime);
		});
	}

	document.querySelector("#play_b").addEventListener("click",movie_play);
	document.querySelector("#stop_b").addEventListener("click",movie_stop);

	function movie_play(){
		if(movie.getAttribute("src") !== null){
			play=1;
			style_change("all",18,menu,"#6B747D");
			style_change("along",11,menu,"#6B747D");
			style_change("along",9,menu,"#0082C2");
			movie.play();
			initialization();
			now_t = movie.currentTime;
			let time_p = setInterval(function(){
				now_t = movie.currentTime;
				document.querySelector("#now_t").innerHTML=time_set(now_t);
				if(now_t >=endtime) clearInterval(time_p);
				document.querySelector("#time_track").style.left = (now_t / px_time)+"px";
				track_mx = (now_t / px_time);
				for(let i=0; i <=drow_path.length-1; i++){
					if(now_t < layer_array[i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "none";
					if(now_t >= layer_array[i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "block";
					if(now_t >= (layer_array[i][5]+layer_array[i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "none";
				}
			},10);
		}
	}

	function movie_stop(){
		if(play){
			movie.pause();
			style_change("along",11,menu,"#0082C2");
			style_change("along",9,menu,"#6B747D");
		}
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

	document.querySelector("#alld_b").addEventListener("click",canvas_all_del);

	let out_i=1,id =1,drow_ok;
	let end=0;
	let start_x,start_y,x,y;
	let text_e = 1;
	let now_b="";

	// canvas
	document.querySelector("#squre_b").addEventListener("click",function(){
		end = 0;
		out_i=1;
		drow_ok = 1;
		now_b = "squre";
		if(movie.getAttribute("src") !== null) terminal("first","squre_b");
	});

	document.querySelector("#text_b").addEventListener("click",function(){
		end = 0;
		out_i=1;
		drow_ok = 1;
		text_e= 1;
		now_b="text";
		if(movie.getAttribute("src") !== null) terminal("first","text_b");
	});

	document.querySelector("#free_b").addEventListener("click",function(){
		end = 0;
		out_i=1;
		drow_ok = 1;
		now_b = "free";
		if(movie.getAttribute("src") !== null) terminal("first","free_b");
	});

	document.querySelector("#sle_b").addEventListener("click",function(){
		if(document.querySelector("#canvas"+canvas_num) && movie.getAttribute("src") !== null){
			now_b = "select";
			select();
		}
	});

	document.querySelector("#somed_b").addEventListener("click",function(){
		now_b = "select_del";
		if(select_id && canvas_id>-1) select_del(select_id);
	});
	
	//선택
	function select(){
		if(canvas_num && now_b == "select"){
			style_change("all",18,menu,"#6B747D");
			style_change("along",7,menu,"#0082C2");
			if(now_b == "select") movie_area.addEventListener("mousedown",function(e){drow_select(e);});
		}
	}

	function drow_select(e){
		let cx,cy;
		let sx,sy;
		let tx,ty,tw,th;
		let canvas,ctx;
		let fx,fy,sw,sh,squre_x,squre_y;
		let select_ok = 0;
		if(now_b == "select" && !select_ok){
			if(!select_ok && now_b == "select"){
				cx = e.clientX-movie_area.getBoundingClientRect().x;
				cy = e.clientY-movie_area.getBoundingClientRect().y;
				if(select_id && canvas_id> -1){
					//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
					initialization();
					if(drow_path[canvas_id][5] == "squre"){
						squre_x = cx - fx;
						squre_y = cy - fy;
					}
				}
						
				for(let i=drow_path.length-1;i>=0;i--){
					if(drow_path[i][5] == "squre"){
						fx = drow_path[i][1][0];
						fy = drow_path[i][1][1];
						sw = drow_path[i][1][2];
						sh = drow_path[i][1][3];
						squre_x = cx - fx;
						squre_y = cy - fy;
						if((cx >= fx && cx <= (fx+sw)) && (cy >= fy && cy <= (fy+sh))){

							canvas_id = i;
							select_id = drow_path[i][0].substring(1,drow_path[i][0].length);
							for(let i=0; i<layer_num-1;i++) if(layer_array[i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
							canvas = document.querySelector("#"+select_id);
							ctx = canvas.getContext("2d");
											
							select_num[0]=cx;
							select_num[1]=cy;

							//선택 테두리
							ctx.fillStyle = "#33CFD1";
							fx = drow_path[canvas_id][1][0];
							fy = drow_path[canvas_id][1][1];
							sw = drow_path[canvas_id][1][2];
							sh = drow_path[canvas_id][1][3];
							ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

							//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
							ctx.fillStyle = drow_path[canvas_id][3];
							fx = drow_path[canvas_id][1][0];
							fy = drow_path[canvas_id][1][1];
							sw = drow_path[canvas_id][1][2];
							sh = drow_path[canvas_id][1][3];
							ctx.fillRect(fx,fy,sw,sh);
							//공통적용사항
							select_ok = 1;
							break;
						}
					}else if(drow_path[i][5] == "line"){
						for(let k = 1; k<=drow_path[i][2];k++){
							if(cx + drow_path[i][4] >= Math.floor(drow_path[i][1][k][0]) && cx - drow_path[i][4] <= Math.floor(drow_path[i][1][k][0])){
								if(cy + drow_path[i][4] >= Math.floor(drow_path[i][1][k][1]) && cy - drow_path[i][4] <= Math.floor(drow_path[i][1][k][1])){
									canvas_id = i;
									select_id = drow_path[i][0].substring(1,drow_path[i][0].length);
									for(let i=0; i<layer_num-1;i++) if(layer_array[i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
									canvas = document.querySelector("#"+select_id);
									ctx = canvas.getContext("2d");
											
									select_num[0]=i;
									select_num[1]=k;
									//선택 테두리
									ctx.strokeStyle = "#33CFD1";
									ctx.lineWidth = drow_path[i][4]+3;
									for(let h=1;h<=drow_path[i][2];h++){
										ctx.beginPath();
										if(h == 1){
											sx = drow_path[i][1][h][0];
											sy = drow_path[i][1][h][1];
										}
										ctx.moveTo(sx,sy);
										sx = drow_path[i][1][h][0];
										sy = drow_path[i][1][h][1];
										ctx.lineTo(sx,sy);
										ctx.stroke();
									}

									//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
									ctx.strokeStyle = drow_path[i][3];
									ctx.lineWidth = drow_path[i][4];
									for(let h=1;h<=drow_path[i][2];h++){
										ctx.beginPath();
										if(h == 1){
											sx = drow_path[i][1][h][0];
											sy = drow_path[i][1][h][1];
										}
										ctx.moveTo(sx,sy);
										sx = drow_path[i][1][h][0];
										sy = drow_path[i][1][h][1];
										ctx.lineTo(sx,sy);
										ctx.stroke();
									}
									//공통적용사항
									select_ok = 1;
									break;
								}
							}
						}
					}else if(drow_path[i][5] == "text"){
						if((drow_path[i][1][0] <= cx) && ((drow_path[i][1][0] + drow_path[i][1][2]) >= cx)){
							if((drow_path[i][1][1] <= cy) && ((drow_path[i][1][1] + drow_path[i][1][3]) >= cy)){
								canvas_id = i;
								select_id = drow_path[i][0].substring(1,drow_path[i][0].length);
								for(let i=0; i<layer_num-1;i++) if(layer_array[i][0] == document.querySelector("#"+select_id+"_layer").firstChild.id) layer_detail(i,"change");
								canvas = document.querySelector("#"+select_id);
								ctx = canvas.getContext("2d");
												
								select_num[0]=cx;
								select_num[1]=cy;
								tx = drow_path[i][1][0];
								ty = drow_path[i][1][1];
								tw = drow_path[i][1][2];
								th = drow_path[i][1][3];
								//텍스트 외곽
								ctx.strokeStyle = "#33CFD1";
								ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

								//텍스트
								ctx.fillStyle = drow_path[canvas_id][3]; 
								ctx.font = drow_path[canvas_id][4]+"px ''";
								ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);

								//공통적용사항
								select_ok = 1;
								break;
							}
						}
					}
				}
			}

			if(select_ok && now_b == "select" && canvas_id > -1 && select_id !== 0){
				for (let i=drow_path.length-1;i>=0;i--) document.querySelector(drow_path[i][0]).style.zIndex = layer_zindex[i]- 1;
				document.querySelector("#"+select_id).style.zIndex = layer_zindex_max+10;
				document.querySelector("#"+select_id).onmousemove = function(e){
					if(select_ok && now_b == "select" && canvas_id > -1 && select_id !== 0){
						if(select_ok && select_id !== 0){
							canvas = document.querySelector("#"+select_id);
							ctx = canvas.getContext("2d");
							ctx.clearRect(0,0,canvas.width,canvas.height);
							let mx,my,tx,ty;

							ctx.strokeStyle = "#33CFD1";
							if(drow_path[canvas_id][5] == "line"){
								mx = Math.floor(drow_path[select_num[0]][1][select_num[1]][0] - (e.clientX-movie_area.getBoundingClientRect().x));
								my = Math.floor(drow_path[select_num[0]][1][select_num[1]][1] - (e.clientY-movie_area.getBoundingClientRect().y));
								ctx.lineWidth = drow_path[canvas_id][4]+3;
								for(let h=1;h<=drow_path[canvas_id][2];h++){
									ctx.beginPath();
									if(h == 1){
										sx = drow_path[canvas_id][1][h][0] - mx;
										sy = drow_path[canvas_id][1][h][1] - my;
									}
									ctx.moveTo(sx,sy);
									sx = drow_path[canvas_id][1][h][0] - mx;
									sy = drow_path[canvas_id][1][h][1] - my;
									ctx.lineTo(sx,sy);
									ctx.stroke();
								}
								ctx.strokeStyle = drow_path[canvas_id][3];
								ctx.lineWidth = drow_path[canvas_id][4];
								for(let h=1;h<=drow_path[canvas_id][2];h++){
									ctx.beginPath();
									if(h == 1){
										sx = drow_path[canvas_id][1][h][0] - mx;
										sy = drow_path[canvas_id][1][h][1] - my;
									}
									ctx.moveTo(sx,sy);
									sx = drow_path[canvas_id][1][h][0] - mx;
									sy = drow_path[canvas_id][1][h][1] - my;
									ctx.lineTo(sx,sy);
									ctx.stroke();
									drow_path[canvas_id][1][h][0] = sx;
									drow_path[canvas_id][1][h][1] = sy;
								}
							}else if(drow_path[canvas_id][5] == "squre"){
											
								mx = Math.floor((e.clientX-movie_area.getBoundingClientRect().x) - select_num[0]);
								my = Math.floor((e.clientY-movie_area.getBoundingClientRect().y) - select_num[1]);
								select_num[0] = (e.clientX-movie_area.getBoundingClientRect().x);
								select_num[1] = (e.clientY-movie_area.getBoundingClientRect().y);

								fx = (fx + mx);
								fy = (fy + my);
								drow_path[canvas_id][1][0] = fx;
								drow_path[canvas_id][1][1] = fy;
								//선택 테두리
								ctx.fillStyle = "#33CFD1";
								ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

								//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
								ctx.fillStyle = drow_path[canvas_id][3];
								ctx.fillRect(fx,fy,sw,sh);
							}else if(drow_path[canvas_id][5] == "text"){
								tx = drow_path[canvas_id][1][0];
								ty = drow_path[canvas_id][1][1];
								tw = drow_path[canvas_id][1][2];
								th = drow_path[canvas_id][1][3];
								mx = Math.floor((e.clientX-movie_area.getBoundingClientRect().x) - select_num[0]);
								my = Math.floor((e.clientY-movie_area.getBoundingClientRect().y) - select_num[1]);
								select_num[0] = (e.clientX-movie_area.getBoundingClientRect().x);
								select_num[1] = (e.clientY-movie_area.getBoundingClientRect().y);
								console.log(mx,my,tx,ty);
								tx = tx + mx;
								ty = ty + my;
								drow_path[canvas_id][1][0] = tx;
								drow_path[canvas_id][1][1] = ty;
								console.log(tx,ty);
								//텍스트 테두리
								ctx.strokeStyle = "#33CFD1";
								ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

								//텍스트
								ctx.fillStyle = drow_path[canvas_id][3]; 
								ctx.font = drow_path[canvas_id][4]+"px ''";
								ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);
							}
						}
					}
				}
			}

			if(select_ok && now_b == "select" && select_id !== 0 && canvas_id>-1){
				document.querySelector("#"+select_id).onmouseup = function (e){
					if(select_ok && now_b == "select" && select_id !== 0 && canvas_id>-1){
						//조건 변경
						document.querySelector("#"+select_id).style.zIndex = layer_zindex[canvas_id]-1;
						for (let i=drow_path.length-1;i>=0;i--){
							document.querySelector(drow_path[i][0]).style.zIndex = Number(document.querySelector(drow_path[i][0]).style.zIndex) + 1;
						}
						select_ok = 0;
					}
				}
			}
		}

		document.querySelector("html").addEventListener("click",function(e){
			cw = e.x;
			ch = e.y;
			if( now_b == "select" && canvas_num){
				canvas_size = document.querySelector("#canvas"+canvas_num).getBoundingClientRect();
				let layer_size =  document.querySelector("#layer_list").getBoundingClientRect();
				if(((cw > (layer_size.x+layer_size.width) || cw < layer_size.x) || (ch > (layer_size.y+layer_size.height) || ch < layer_size.y))&&((cw > (canvas_size.x+canvas_size.width) || cw < canvas_size.x) || (ch > (canvas_size.y+canvas_size.height) || ch < canvas_size.y))){
					//canvas에 적용
					if(select_id){
						canvas = document.querySelector("#"+select_id);
						ctx = canvas.getContext("2d");
						ctx.clearRect(0,0,canvas.width,canvas.height);
						ctx.strokeStyle = drow_path[canvas_id][3];

						if(drow_path[canvas_id][5] == "line"){
							ctx.lineWidth = drow_path[canvas_id][4];
							for(let h=1;h<=drow_path[canvas_id][2];h++){
								ctx.beginPath();
								if(h == 1){
									sx = drow_path[canvas_id][1][h][0];
									sy = drow_path[canvas_id][1][h][1];
								}
								ctx.moveTo(sx,sy);
								sx = drow_path[canvas_id][1][h][0];
								sy = drow_path[canvas_id][1][h][1];
								ctx.lineTo(sx,sy);
								ctx.stroke();
							}
						}else if(drow_path[canvas_id][5] == "squre"){
							fx = drow_path[canvas_id][1][0];
							fy = drow_path[canvas_id][1][1];
							sw = drow_path[canvas_id][1][2];
							sh = drow_path[canvas_id][1][3];
							ctx.fillRect(fx,fy,sw,sh);
							squre_x = cx - fx;
							squre_y = cy - fy;
						}else if(drow_path[canvas_id][5] == "text"){
							tx = drow_path[canvas_id][1][0];
							ty = drow_path[canvas_id][1][1];
							//텍스트
							ctx.fillStyle = drow_path[canvas_id][3]; 
							ctx.font = drow_path[canvas_id][4]+"px ''";
							ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);
						}

						layer_detail(1,"not_change");
						select_id = 0;
						select_ok = 0;
						canvas_id = -1;
						style_change("all",18,menu,"#6B747D");
						now_b = "";

						//layer
						for(let i=0; i<layer_num-1;i++){
							document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_left").style.backgroundColor  = "#C8C8C8";
							document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_center").style.backgroundColor= "#C8C8C8";
							document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_right").style.backgroundColor = "#C8C8C8";
						}
					}
				}
			}
		});
	}

	function terminal(menu,id){
		initialization();
		if(menu == "out" || end || !drow_ok || now_b== "") return;
		if((menu == "squre_again" || id == "squre_b") && now_b == "squre") squre();
		if((menu == "text_again" || id == "text_b") && now_b == "text") text_input();
		if((menu == "free_again" || id == "free_b") && now_b == "free") free_line();
	}

	function createCanvas(){
		canvas_num++;
		canvas = document.createElement("canvas");
		canvas.className = "canvas";
		canvas.setAttribute("id","canvas"+canvas_num);
		movie_area.appendChild(canvas);
		add_layer("canvas"+canvas_num+"_layer","#layer_list");
		add_layer("layer"+(layer_num-2)+"_time","#canvas"+canvas_num+"_layer");
		layer_zindex_max++;
		document.querySelector("#canvas"+canvas_num).style.zIndex = layer_zindex_max;
		layer_zindex.push(layer_zindex_max);
	}

	//자유곡선
	function free_line(){
		if(movie.getAttribute("src") !== null && !end){
			if(!end && now_b == "free"){
				let canvas,ctx,sx,sy,drawing = false;
				movie_area.onmousedown = function(e){
					// 현재위치
					if (!drawing && now_b == "free") {
						createCanvas();
						canvas = document.querySelector("#canvas"+canvas_num);
						canvas.width = canvas.offsetWidth;
						canvas.height = canvas.offsetHeight;
						ctx = canvas.getContext("2d");
						ctx.lineCap = "round";
						e.preventDefault();
						sx = canvasX(e.clientX);
						sy = canvasY(e.clientY);
						drawing = true;
						drow_path_id++;
						drow_path.push(Array("#canvas"+canvas_num,Array(1),1,"",1));
					}

					//현재위치 ->새로이동한 곳 선그리기
					if(drawing && now_b == "free"){
						path_num=0;
						canvas.onmousemove = function(e){
							if(drawing){
								e.preventDefault();
								ctx.beginPath();
								ctx.moveTo(sx,sy);
								sx = canvasX(e.clientX);
								sy = canvasY(e.clientY);
								ctx.lineTo(sx,sy);
								ctx.stroke();
								ctx.strokeStyle = detail("color");
								ctx.lineWidth = detail("line");
								path_num++;
								drow_path[drow_path_id][1].push(Array(sx,sy));
							}
						}
					}

					//그리기 종료
					if(drawing && now_b == "free"){
						canvas.onmouseup = function(e){
							drawing = false;
							drow_path[drow_path_id][2] = path_num;
							drow_path[drow_path_id][3] = detail("color");
							drow_path[drow_path_id][4] = detail("line");
							drow_path[drow_path_id][5] = "line";
							if(now_b == "free") terminal("free_again");
						}	
					}

					function canvasX(clientX){
						let bound = canvas.getBoundingClientRect();
						let bw = 5;
						return ( clientX - bound.left - bw)*(canvas.width/(bound.width - bw* 2));
					}
					function canvasY(clientY){
						let bound = canvas.getBoundingClientRect();
						let bw = 5;
						return (clientY - bound.top - bw)*(canvas.height/(bound.height - bw *2));
					}
				}
			}
			style_change("all",18,menu,"#6B747D");
			style_change("along",1,menu,"#0082C2");
			id = 1;
		}
	}

	//사각형
	function squre(){
		if(movie.getAttribute("src") !== null && !end){
			if(!end && now_b == "squre"){
				let canvas,ctx,fx,fy,drawing = false,x,y;
				let color = detail("color"),canvas_size;
				movie_area.onmousedown = function(e){
					if(now_b == "squre" && !drawing ){
						createCanvas();
						canvas = document.querySelector("#canvas"+canvas_num);
						ctx = canvas.getContext('2d');
						canvase_size = document.querySelector("#canvas"+canvas_num).getBoundingClientRect();
						canvas.width = canvas.offsetWidth;
						canvas.height = canvas.offsetHeight;
						drawing = true;
						drow_path_id++;
						drow_path.push(Array("#canvas"+canvas_num,Array(1),1,"",1));
					}
					//사각형 그리기
					if(drawing && now_b == "squre"){
						canvas.onmousemove = function(e){
							ctx.strokeStyle = color;
							if(!end && now_b == "squre" && drawing){
								x = Number(e.offsetX);
								y = Number(e.offsetY);
								// path
								if(id == 1 ){
									fx = x;
									fy = y;
								}
								ctx.clearRect(0,0,canvas.width,canvas.height);
								ctx.beginPath();
								ctx.strokeRect(fx,fy,x-fx,y-fy);
								id++;
								out;
							}
						}
					}
					//사각형 끝
					if(drawing && now_b == "squre"){
						canvas.onmouseup = function(e){
							if(!end && now_b == "squre"){
								ctx.fillStyle = color;
								ctx.fillRect(fx,fy,x-fx,y-fy);
								let sx,sy;
								/*
									sx = widht
									sy = height
									x = 현재 마우스 x 좌표
									y = 현재 마우스 y 좌표
									fx = 처음 x 좌표
									fy = 처음 y 좌표
								*/
								sx = x - fx;
								sy = y - fy;
								if( 0 > (x-fx)){
									sx = -(x-fx);
									fx = fx+(x - fx);
								}
								if( 0 > (y-fy)){
									sy = -(y-fy);
									fy = fy+(y - fy);
								}
								drow_path[drow_path_id][1] = Array(fx,fy,sx,sy);
								drow_path[drow_path_id][2] = path_num;
								drow_path[drow_path_id][3] = detail("color");
								drow_path[drow_path_id][4] = "nothing";
								drow_path[drow_path_id][5] = "squre";
								drawing = false;
								terminal("squre_again");
							}
						}
					}
				}
				style_change("all",18,menu,"#6B747D");
				style_change("along",3,menu,"#0082C2");
				id = 1;
			}
		}
	}

	//텍스트
	function text_input(){
		if(movie.getAttribute("src") !== null && !end){
			if(document.querySelector("input")) movie_area.removeChild(document.querySelector("input"));
			if(!end && now_b == "text"){
				movie_area.onmousedown = function(e){
					if(now_b == "text"){
						createCanvas();
						let canvas,ctx,color = detail("color"),text_size = detail("text"),ch,cw,canvas_size,text_d;
						let x,y;
						canvas = document.querySelector("#canvas"+canvas_num);

						//input 생성
						text = document.createElement("input");
						text.type = "text";
						text.autofocus = true;
						text.className = "text_add";
						movie_area.appendChild(text);
						let src = document.querySelector(".text_add");
						src.setAttribute("id","text_s");
						src.setAttribute("autofocus",true);
						x = Number(e.offsetX);
						y = Number(e.offsetY);
						src.style.top = y+"px";
						src.style.left = x+"px";
						src.style.fontSize = text_size+"px";
						src.style.color = color;
						src.setAttribute("size",src.value.length+"px");
					}

					if(document.querySelector(".text_add") && now_b == "text"){
						let src = document.querySelector(".text_add");
						src.onkeydown = function(e){
							if((src.getBoundingClientRect().left + (src.scrollWidth+15)) < document.querySelector("#canvas"+canvas_num).getBoundingClientRect().right){
								src.style.width = "5px";
								src.style.width = (src.scrollWidth+15)+"px";
							}
						}
					}

					//벗어남?
					if(now_b == "text"){
						document.querySelector("html").addEventListener("click",function(e){
							cw = e.x;
							ch = e.y;
							let text_height;
							if( document.querySelector("#canvas"+canvas_num) && document.querySelector(".text_add")){
								canvas_size = document.querySelector("#canvas"+canvas_num).getBoundingClientRect();
								if(document.querySelector(".text_add") && document.querySelector(".text_add").value.length == 0) document.querySelector(".text_add").focus();
								if((cw > (canvas_size.x+canvas_size.width) || cw < canvas_size.x) || (ch > (canvas_size.y+canvas_size.height) || cw < canvas_size.y)){
									//canvas에 적용
									ctx = canvas.getContext("2d");
									text_e = 1;
									canvas.width = canvas.offsetWidth;  
									canvas.height = canvas.offsetHeight;
									text_size = detail("text");
									ctx.fillStyle = detail("color"); 
									ctx.font = text_size+"px ''";
									text_d = document.querySelector(".text_add");
									x = parseInt(text_d.style.left) + 2;
									y = parseInt(text_d.style.top) + text_size +2;
									ctx.fillText(text_d.value,x,y);
									switch(text_size){
										case 16 : text_height= 18; break;
										case 18 : text_height= 21; break;
										case 24 : text_height= 28; break;
										case 32 : text_height= 37; break;
									}
									drow_path_id++;
									drow_path.push(Array("#canvas"+canvas_num,Array(x,(y-text_size),parseInt(text_d.style.width),text_height),text_d.value,detail("color"),text_size,"text"));
									movie_area.removeChild(text_d);
									now_b = "";
									if(!end) terminal("text_again");
								}
							}
						});
					}
				}
			}
			style_change("all",18,menu,"#6B747D");
			style_change("along",5,menu,"#0082C2");
			id = 1;
		}
	}

	//canvas 세부설정
	function detail(id){
		let re_v;
		if(id == "color") re_v = document.querySelector("#color_v").options[document.querySelector("#color_v").selectedIndex].value;
		else if(id == "line") re_v = Number(document.querySelector("#thick_v").options[document.querySelector("#thick_v").selectedIndex].value);
		else re_v = Number(document.querySelector("#text_size_v").options[document.querySelector("#text_size_v").selectedIndex].value);
		return re_v;
	}

	//canvas 벗어남 판단
	function out(e){
		if(document.querySelector("#canvas"+canvas_num) && drow_ok){
			let click_w = e.x;
			let click_h = e.y;
			end = 0;
			let canvas_size = document.querySelector("#canvas"+canvas_num).getBoundingClientRect();
			if(!out_i && (click_w > (canvas_size.x+canvas_size.width) || click_w < canvas_size.x) || (click_h > (canvas_size.y+canvas_size.height) || click_w < canvas_size.y))  end = 1;
			out_i = 0;
			if(end) {
				style_change("all",18,menu,"#6B747D");
				drow_ok=0;
				now_b = "";
				initialization();
			}
		}
	}

	//canvas 전체 삭제
	function canvas_all_del(){
		style_change("all",18,menu,"#6B747D");
		if(document.querySelector("input"))movie_area.removeChild(document.querySelector("input"));
		for(let i=1;i<=canvas_num;i++) movie_area.removeChild(document.querySelector("#canvas"+i));
		for(let i=1;i<=canvas_num;i++) document.querySelector("#layer_list").removeChild(document.querySelector("#canvas"+i+"_layer"));
		canvas_num=layer_num=canvas_id=0;
		layer_array.splice(0,layer_array.length);
		drow_path.splice(0,drow_path.length);
		layer_zindex.splice(0,layer_zindex.length);
		layer_zindex_max=5;
		select_id = "";
		layer_list = (0,layer_array.length);
		path_num = 0;
		drow_path_id = -1;
	}

	//canvas 일부삭제
	function select_del(id){
		if(now_b == "select_del"){
			if(document.querySelector("#"+id)){
				movie_area.removeChild(document.querySelector("#"+id));
				layer_array.splice(canvas_id,1);
				drow_path.splice(canvas_id,1);
				layer_zindex.splice(canvas_id,1);
				document.querySelector("#layer_list").removeChild(document.querySelector("#"+id+"_layer"));
				style_change("all",18,menu,"#6B747D");
				now_b = "";
				for(let i=canvas_id+1;i<layer_array.length+1;i++){
					layer_zindex[i-1] = layer_zindex[i-1]--;

					let name = "#"+(layer_array[i][0].substring(0,layer_array[i-1][0].length - 5));
					let name2 = document.querySelector("#"+layer_array[i-1][0]).parentNode.id;
					document.querySelector(name+"_left").remove();
					document.querySelector(name+"_center").remove();
					document.querySelector(name+"_right").remove();
					document.querySelector("#"+layer_array[i-1][0]).remove();
					let id_time = layer_array[i-1][0];
					let layer_add = document.createElement("div");
					layer_add.className = "layer_time";
					layer_add.setAttribute("id",id_time);
					document.querySelector("#"+name2).prepend(layer_add);
					document.querySelector("#"+layer_array[i][0]).addEventListener("click",function(){layer_detail(i-1, "change");});

					document.querySelector("#"+id_time).style.left = "0px";
					let left = document.createElement("div");
					let center = document.createElement("div");
					let right = document.createElement("div");
					left.className = "layer_left";
					center.className = "layer_center";
					right.className = "layer_right";
					left.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i-1][0].length - 5))+"_left");
					center.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i-1][0].length - 5))+"_center");
					right.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i-1][0].length - 5))+"_right");
					document.querySelector("#"+id_time).prepend(right);
					document.querySelector("#"+id_time).prepend(center);
					document.querySelector("#"+id_time).prepend(left);
					//기타작업
					document.querySelector("#"+layer_array[i-1][0]).style.left = layer_array[i-1][3]+"px";
					document.querySelector("#"+layer_array[i-1][0]).style.right = layer_array[i-1][4]+"px";
					document.querySelector("#"+layer_array[i-1][0]).style.width = (810 -layer_array[i-1][3] - layer_array[i-1][4])+"px";
				}

				for(let i=canvas_id+2;i<=canvas_num;i++){
					document.querySelector("#canvas"+i+"_layer").setAttribute("id","canvas"+(i-1)+"_layer");
					document.querySelector("#canvas"+i).setAttribute("id","canvas"+(i-1));
					drow_path[i-2][0] = "#canvas"+(i-1);
				}

				select_id = 0;
				select_ok = 0;
				canvas_id = -1;
				canvas_num--;
				drow_path_id--;
				layer_num--;
				path_num = 0;
				layer_zindex_max--;

				document.querySelector("#start_t").innerHTML = "00 : 00 : 00 : 00";
				document.querySelector("#keep_t").innerHTML = "00 : 00 : 00 : 00";
			}
		}
	}

	//css 변경(background-color)
	function style_change(item,num,parent,color){
		if(item == "all"){
			for(let i = 1;i<=18;i+=2){
				parent.parentNode.childNodes[i].style.backgroundColor = color;
			}
		}else{
			parent.parentNode.childNodes[num].style.backgroundColor = color;
		}
	}

	//layer추가
	function add_layer(id,append){
		let layer_add = document.createElement("div");
		if(append == "#canvas"+canvas_num+"_layer"){
			layer_add.className = "layer_time";
			layer_array.push(Array(id,"00 : 00 : 00 : 00",time_set(endtime),0,0,0,endtime,0));
		}else{
			layer_add.className = "layer";
			layer_num++;
		}

		layer_add.setAttribute("id",id);
		document.querySelector(append).prepend(layer_add);
		if(append == "#canvas"+canvas_num+"_layer"){
			document.querySelector("#"+id).style.left = "0px";
			let left = document.createElement("div");
			let center = document.createElement("div");
			let right = document.createElement("div");
			left.className = "layer_left";
			center.className = "layer_center";
			right.className = "layer_right";
			left.setAttribute("id","layer"+(layer_num-2)+"_left");
			center.setAttribute("id","layer"+(layer_num-2)+"_center");
			right.setAttribute("id","layer"+(layer_num-2)+"_right");
			document.querySelector("#"+id).prepend(right);
			document.querySelector("#"+id).prepend(center);
			document.querySelector("#"+id).prepend(left);
			for(let i=0;i<layer_array.length;i++) if(i == layer_array.length-1) document.querySelector("#"+id).addEventListener("click",function(){layer_detail(i, "change");});
		}
	}

	//layer 선택 => 변경(시작시간/유지시간)
	function layer_detail(index,type){
		for(let i=0; i<layer_num-1;i++) document.querySelector("#"+layer_array[i][0]).style.backgroundColor = "#C8C8C8";
		if(type == "change"){
			document.querySelector("#"+layer_array[index][0]).style.backgroundColor = "#17AFB1";
			document.querySelector("#start_t").innerHTML = layer_array[index][1];
			document.querySelector("#keep_t").innerHTML = layer_array[index][2];
			now_b = "select";
			style_change("all",18,menu,"#6B747D");
			style_change("along",7,menu,"#0082C2");
			select_ok = 0;

			initialization();

			select_id = document.querySelector("#"+layer_array[index][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[index][0]).parentNode.id.length - 6);
			for(let i=0; i <=drow_path.length-1; i++) if(drow_path[i][0] == "#"+select_id) canvas_id = i;
			canvas = document.querySelector("#"+select_id);
			ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,canvas.width,canvas.height);

			if(drow_path[canvas_id][5] == "line"){
				ctx.lineWidth = drow_path[canvas_id][4]+3;
				for(let h=1;h<=drow_path[canvas_id][2];h++){
					ctx.strokeStyle ="#33CFD1";
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[canvas_id][1][h][0];
						sy = drow_path[canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[canvas_id][1][h][0];
					sy = drow_path[canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
				ctx.strokeStyle = drow_path[canvas_id][3];
				ctx.lineWidth = drow_path[canvas_id][4];
				for(let h=1;h<=drow_path[canvas_id][2];h++){
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[canvas_id][1][h][0];
						sy = drow_path[canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[canvas_id][1][h][0];
					sy = drow_path[canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
			}else if(drow_path[canvas_id][5] == "squre"){
				//선택 테두리
				ctx.fillStyle ="#33CFD1";
				fx = drow_path[canvas_id][1][0];
				fy = drow_path[canvas_id][1][1];
				sw = drow_path[canvas_id][1][2];
				sh = drow_path[canvas_id][1][3];
				ctx.fillRect(fx-3,fy-3,sw+6,sh+6);

				//선택된 도형 다시 그리기 (테두리 그리느라 지워짐)
				ctx.fillStyle = drow_path[canvas_id][3];
				ctx.fillRect(fx,fy,sw,sh);
			}else{
				tx = drow_path[canvas_id][1][0];
				ty = drow_path[canvas_id][1][1];
				tw = drow_path[canvas_id][1][2];
				th = drow_path[canvas_id][1][3];
				
				//텍스트 테두리
				ctx.strokeStyle = "#33CFD1";
				ctx.strokeRect(tx-2,ty-2,tw+4,th+4);

				//텍스트
				ctx.fillStyle = drow_path[canvas_id][3]; 
				ctx.font = drow_path[canvas_id][4]+"px ''";
				ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);
			}
			//out?
			document.querySelector("html").addEventListener("click",function(e){
				cx = e.clientX-movie_area.getBoundingClientRect().x;
				cy = e.clientY-movie_area.getBoundingClientRect().y;
				if(select_id && canvas_id> -1){
					//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
					if(drow_path[canvas_id][5] == "squre"){
						squre_x = cx - fx;
						squre_y = cy - fy;
					}
				}
				cw = e.x;
				ch = e.y;
				if( now_b == "select" && canvas_num){
					canvas_size = document.querySelector("#canvas"+canvas_num).getBoundingClientRect();
					let layer_size =  document.querySelector("#layer_list").getBoundingClientRect();
					if(((cw > (layer_size.x+layer_size.width) || cw < layer_size.x) || (ch > (layer_size.y+layer_size.height) || ch < layer_size.y))&&((cw > (canvas_size.x+canvas_size.width) || cw < canvas_size.x) || (ch > (canvas_size.y+canvas_size.height) || ch < canvas_size.y))){
						//canvas에 적용
						if(select_id){
							canvas = document.querySelector("#"+select_id);
							ctx = canvas.getContext("2d");
							ctx.clearRect(0,0,canvas.width,canvas.height);
							ctx.strokeStyle = drow_path[canvas_id][3];
	
							if(drow_path[canvas_id][5] == "line"){
								ctx.lineWidth = drow_path[canvas_id][4];
								for(let h=1;h<=drow_path[canvas_id][2];h++){
									ctx.beginPath();
									if(h == 1){
										sx = drow_path[canvas_id][1][h][0];
										sy = drow_path[canvas_id][1][h][1];
									}
									ctx.moveTo(sx,sy);
									sx = drow_path[canvas_id][1][h][0];
									sy = drow_path[canvas_id][1][h][1];
									ctx.lineTo(sx,sy);
									ctx.stroke();
								}
							}else if(drow_path[canvas_id][5] == "squre"){
								fx = drow_path[canvas_id][1][0];
								fy = drow_path[canvas_id][1][1];
								sw = drow_path[canvas_id][1][2];
								sh = drow_path[canvas_id][1][3];
								ctx.fillRect(fx,fy,sw,sh);
								squre_x = cx - fx;
								squre_y = cy - fy;
							}else if(drow_path[canvas_id][5] == "text"){
								tx = drow_path[canvas_id][1][0];
								ty = drow_path[canvas_id][1][1];
								//텍스트
								ctx.fillStyle = drow_path[canvas_id][3]; 
								ctx.font = drow_path[canvas_id][4]+"px ''";
								ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);
							}
	
							layer_detail(1,"not_change");
							select_id = 0;
							select_ok = 0;
							canvas_id = -1;
							style_change("all",18,menu,"#6B747D");
							now_b = "";
	
							//layer
							for(let i=0; i<layer_num-1;i++){
								document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_left").style.backgroundColor  = "#C8C8C8";
								document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_center").style.backgroundColor= "#C8C8C8";
								document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_right").style.backgroundColor = "#C8C8C8";
							}
						}
					}
				}
			});
			now_b = "select";
			select();
		}

		if(index > -1 && index <layer_array.length) select_layer = document.querySelector("#"+layer_array[index][0]).id.substring(0,(document.querySelector("#"+layer_array[index][0]).id.length-5)); 
		if(select_layer && now_b == "select"){
			for(let i=0; i<layer_num-1;i++){
				console.log(layer_array[i][0].substring(0,(layer_array[i][0].length-5)));
				document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_left").style.backgroundColor  = "#C8C8C8";
				document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_center").style.backgroundColor= "#C8C8C8";
				document.querySelector("#"+(layer_array[i][0].substring(0,(layer_array[i][0].length-5)))+"_right").style.backgroundColor = "#C8C8C8";
			}
			document.querySelector("#"+select_layer+"_left").style.backgroundColor ="#17AFB1";
			document.querySelector("#"+select_layer+"_center").style.backgroundColor ="#17AFB1";
			document.querySelector("#"+select_layer+"_right").style.backgroundColor ="#17AFB1";
			document.querySelector("#"+select_layer+"_left").addEventListener("mousedown",function(e){
				target = "left";
				left_cx = e.clientX;
				layer_list_h = document.querySelector("#layer_list").getBoundingClientRect().top;
			});
			document.querySelector("#"+select_layer+"_right").addEventListener("mousedown",function(e){
				target = "right";
				right_cx = e.clientX;
				layer_list_h = document.querySelector("#layer_list").getBoundingClientRect().top;
			});
			document.querySelector("#"+select_layer+"_center").addEventListener("mousedown",(e)=>{
				for(let i=0;i<(layer_num - 1);i++){
					if(document.querySelector("#"+select_layer+"_time") == document.querySelector("#"+layer_array[i][0])){
						layer_swap_one = i;
					}
				}
				target = "center";
				center_cx = e.clientX;
				center_cy = e.clientY;
				for(let i = 0; i < (layer_num  - 1); i++) document.querySelector("#"+(document.querySelector("#"+layer_array[i][0]).parentNode.id)).style.zIndex = 5;
				document.querySelector("#"+(document.querySelector("#"+select_layer+"_time").parentNode.id)).style.zIndex = 10;
				center_layer_my = typeof(document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top) == "number" ? document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top : layer_array[layer_swap_one][7];
				layer_list_h = document.querySelector("#layer_list").getBoundingClientRect().top;
			});
		}
	}

	//canvas 테두리 지우기
	function initialization(){
		if(canvas_id > -1 && select_id){
			//이전에 선택된 도형 테두리 지우기 (테두리 그리느라 지워짐)
			let mx,my,sx,sy,ctx,canvas,sw,sh;
			canvas = document.querySelector("#"+select_id);
			ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,canvas.width,canvas.height);
			if(drow_path[canvas_id][5] == "line"){
				ctx.strokeStyle = drow_path[canvas_id][3];
				ctx.lineWidth = drow_path[canvas_id][4];
				for(let h=1;h<=drow_path[canvas_id][2];h++){
					ctx.beginPath();
					if(h == 1){
						sx = drow_path[canvas_id][1][h][0];
						sy = drow_path[canvas_id][1][h][1];
					}
					ctx.moveTo(sx,sy);
					sx = drow_path[canvas_id][1][h][0];
					sy = drow_path[canvas_id][1][h][1];
					ctx.lineTo(sx,sy);
					ctx.stroke();
				}
			}else if(drow_path[canvas_id][5] == "squre"){
				ctx.fillStyle = drow_path[canvas_id][3];
				fx = drow_path[canvas_id][1][0];
				fy = drow_path[canvas_id][1][1];
				sw = drow_path[canvas_id][1][2];
				sh = drow_path[canvas_id][1][3];
				ctx.fillRect(fx,fy,sw,sh);
			}else if(drow_path[canvas_id][5] == "text"){
				tx = drow_path[canvas_id][1][0];
				ty = drow_path[canvas_id][1][1];
				//텍스트
				ctx.fillStyle = drow_path[canvas_id][3]; 
				ctx.font = drow_path[canvas_id][4]+"px ''";
				ctx.fillText(drow_path[canvas_id][2],tx,ty+drow_path[canvas_id][4]);
			}
			layer_detail(1,"not_change");
		}
	}
	
	window.addEventListener("mousemove", e => {
		if(target == null ) return;
		let time_layer = document.querySelector("#"+select_layer+"_time");
		for(let i=0; i <=drow_path.length-1; i++){
			if(layer_array[i][0] == select_layer+"_time"){
				left_layer_mx = layer_array[i][3];
				right_layer_mx = layer_array[i][4];
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
			for(let i=0; i <=drow_path.length-1; i++){
				if(layer_array[i][0] == select_layer+"_time"){
					layer_array[i][1] = time_set(st);
					layer_array[i][2] = time_set(et);
					layer_array[i][3] = left_layer_mx;
					layer_array[i][5] = st;
					layer_array[i][6] = et;
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
			for(let i=0; i <=drow_path.length-1; i++){
				if(layer_array[i][0] == select_layer+"_time"){
					layer_array[i][2] = time_set(et);
					layer_array[i][4] = right_layer_mx;
					layer_array[i][6] = et;
				}
			}
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
			
			//layer swap
			if(layer_num > 2 && layer_swap){
				let n=0,n1=0;
				for(let i=0;i<layer_swap_one;i++) n +=30;
				for(let i = layer_swap_one;i<(layer_num - 2);i++) n1 -= 30;
				y = center_cy - e.clientY;
				center_layer_my -= y;
				center_layer_my = center_layer_my < n1 ? n1 : center_layer_my > n ? n : center_layer_my;
				document.querySelector("#"+document.querySelector("#"+select_layer+"_time").parentNode.id).style.top = center_layer_my + "px";
				for(let i = 0; i < (layer_num-1); i++){
					if((select_layer+"_time") !== (layer_array[i][0])){
						if(document.querySelector("#"+layer_array[i][0]).getBoundingClientRect().top + 2 > document.querySelector("#"+select_layer+"_time").getBoundingClientRect().top){
							if(document.querySelector("#"+layer_array[i][0]).getBoundingClientRect().top - 2 < document.querySelector("#"+select_layer+"_time").getBoundingClientRect().top){
								layer_swap_two = i;
								layer_swap = 2;
							}else layer_swap = 1;
						}else layer_swap = 1;
					}else layer_swap = 1;
				}
				center_cy = e.clientY;
			}

			//시간조정
			for(let i = 0;i < (left_layer_mx); i++) st += px_time;
			document.querySelector("#start_t").innerHTML = time_set(st);
			for(let i=0; i <=drow_path.length-1; i++){
				if(layer_array[i][0] == select_layer+"_time"){
					layer_array[i][1] = time_set(st);
					layer_array[i][3] = left_layer_mx;
					layer_array[i][4] = right_layer_mx;
					layer_array[i][5] = st;
				}
			}
		}else if(target == "time_track"){
			let play_time = 0;
			x = e.clientX - track_cx;
			let mx = track_mx + x;
			mx = mx < 0 ? 0 : mx > (endtime / px_time) ? (endtime / px_time) : mx;
			document.querySelector("#time_track").style.left = mx + "px";
			track_cx = e.clientX;
			track_mx = mx;
			for(let i=0; i<mx;i++) play_time += px_time;
			movie.currentTime = play_time;
			document.querySelector("#now_t").innerHTML=time_set(play_time);
			for(let i=0; i <=drow_path.length-1; i++){
				if(play_time < layer_array[i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "none";
				if(play_time >= layer_array[i][5]) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "block";
				if(play_time >= (layer_array[i][5]+layer_array[i][6])) document.querySelector("#"+document.querySelector("#"+layer_array[i][0]).parentNode.id.substring(0,document.querySelector("#"+layer_array[i][0]).parentNode.id.length - 6)).style.display = "none";
			}
		}
	});

	window.addEventListener("mouseup", ()=>{
		target = null;
		if(layer_swap_one > -1) document.querySelector("#"+document.querySelector("#"+layer_array[layer_swap_one][0]).parentNode.id).style.top = layer_array[layer_swap_one][7]+"px";
		if(layer_swap > 1){
			let name,name2;
			if(layer_swap_one == layer_swap_two) return false;
			name = layer_zindex[layer_swap_one];
			layer_zindex[layer_swap_one] = layer_zindex[layer_swap_two];
			layer_zindex[layer_swap_two] = name;
			//교환준비
			name = document.querySelector("#"+layer_array[layer_swap_one][0]).parentNode.id;
			name2= document.querySelector("#"+layer_array[layer_swap_two][0]).parentNode.id;

			//상위id 교환
			document.querySelector("#"+name).setAttribute("id",name2 + "1");
			document.querySelector("#"+name2).setAttribute("id",name);
			document.querySelector("#"+name2+"1").setAttribute("id",name2);

			name = layer_array[layer_swap_one][0];
			name2 = layer_array[layer_swap_two][0];
			//id 교환
			document.querySelector("#"+name2).setAttribute("id",layer_array[layer_swap_one][0]+"1");
			document.querySelector("#"+layer_array[layer_swap_one][0]).setAttribute("id",name2);
			document.querySelector("#"+name+"1").setAttribute("id",name);
			
			name = layer_array[layer_swap_one][0].substring(0,layer_array[layer_swap_one][0].length - 5);
			name2 = layer_array[layer_swap_two][0].substring(0,layer_array[layer_swap_two][0].length - 5);
			//left
			document.querySelector("#"+name2+"_left").setAttribute("id",name+"_left"+"1");
			document.querySelector("#"+name+"_left").setAttribute("id",name2+"_left");
			document.querySelector("#"+name+"_left"+"1").setAttribute("id",name+"_left");
			//center
			document.querySelector("#"+name2+"_center").setAttribute("id",name+"_center"+"1");
			document.querySelector("#"+name+"_center").setAttribute("id",name2+"_center");
			document.querySelector("#"+name+"_center"+"1").setAttribute("id",name+"_center");
			//right
			document.querySelector("#"+name2+"_right").setAttribute("id",name+"_right"+"1");
			document.querySelector("#"+name+"_right").setAttribute("id",name2+"_right");
			document.querySelector("#"+name+"_right"+"1").setAttribute("id",name+"_right");
			
			for(let i = 0;i<7;i++){
				name = layer_array[layer_swap_one][i];
				layer_array[layer_swap_one][i] = layer_array[layer_swap_two][i];
				layer_array[layer_swap_two][i] = name;
			}
			layer_swap = 1;
			for(let i=0;i<(layer_num-1);i++){
				name = "#"+(layer_array[i][0].substring(0,layer_array[i][0].length - 5));
				name2 = document.querySelector("#"+layer_array[i][0]).parentNode.id;
				document.querySelector(name+"_left").remove();
				document.querySelector(name+"_center").remove();
				document.querySelector(name+"_right").remove();
				document.querySelector("#"+layer_array[i][0]).remove();
				let id_time = layer_array[i][0];
				let layer_add = document.createElement("div");
				layer_add.className = "layer_time";
				layer_add.setAttribute("id",id_time);
				document.querySelector("#"+name2).prepend(layer_add);
				document.querySelector("#"+layer_array[i][0]).addEventListener("click",function(){layer_detail(i, "change");});

				document.querySelector("#"+id_time).style.left = "0px";
				let left = document.createElement("div");
				let center = document.createElement("div");
				let right = document.createElement("div");
				left.className = "layer_left";
				center.className = "layer_center";
				right.className = "layer_right";
				left.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i][0].length - 5))+"_left");
				center.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i][0].length - 5))+"_center");
				right.setAttribute("id","layer"+Number(layer_array[i][0].substring(5,layer_array[i][0].length - 5))+"_right");
				document.querySelector("#"+id_time).prepend(right);
				document.querySelector("#"+id_time).prepend(center);
				document.querySelector("#"+id_time).prepend(left);
				//기타작업
				document.querySelector("#"+layer_array[i][0]).style.left = layer_array[i][3]+"px";
				document.querySelector("#"+layer_array[i][0]).style.right = layer_array[i][4]+"px";
				document.querySelector("#"+layer_array[i][0]).style.width = (810 -layer_array[i][3] - layer_array[i][4])+"px";
			}
			for (let i=drow_path.length-1;i>=0;i--) document.querySelector(drow_path[i][0]).style.zIndex = layer_zindex[i];
			document.querySelector("#"+layer_array[layer_swap_two][0].substring(0,layer_array[layer_swap_two][0].length - 5)+"_left").style.backgroundColor = "#17AFB1";
			document.querySelector("#"+layer_array[layer_swap_two][0].substring(0,layer_array[layer_swap_two][0].length - 5)+"_center").style.backgroundColor = "#17AFB1";
			document.querySelector("#"+layer_array[layer_swap_two][0].substring(0,layer_array[layer_swap_two][0].length - 5)+"_right").style.backgroundColor = "#17AFB1";
		}
	});
}