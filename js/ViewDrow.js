class ViewDrow extends View{
    static Color = null;
    static moveX = null;
    static moveY = null;
    constructor(type){
        super();
        this.type = type;
        this.Drowing();
    }

    Drowing(){
        if(this.type == "nomal"){
            for(let i = 1; i<=Object.keys(Tool.drow_path[View.video_num]).length; i++){
                if(Tool.drow_path[View.video_num][i]['add']){
                    for(let j = 0;j<Tool.drow_path[View.video_num][i]['add'].length;j++){
                        let canvas = document.querySelector("#canvas"+Tool.drow_path[View.video_num][i]['add'][j]['number']);
                        let ctx = canvas.getContext("2d");
                        let sx,sy,sw,sh;
                        if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'line'){
                            ctx.strokeStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            ctx.lineWidth = Tool.drow_path[View.video_num][i]['add'][j]['thick'];
                            for(let k = 0;k<=Tool.drow_path[View.video_num][i]['add'][j]['path_num'];k++){
                                ctx.beginPath();
                                if(k == 0){
                                    sx = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['x'];
                                    sy = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['y'];
                                }
                                ctx.moveTo(sx,sy);
                                sx = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['x'];
                                sy = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['y'];
                                ctx.lineTo(sx,sy);
                                ctx.stroke();
                            }
                        }else if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'squre'){
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            sx = Tool.drow_path[View.video_num][i]['add'][j]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['add'][j]['path']['y'];
                            sw = Tool.drow_path[View.video_num][i]['add'][j]['path']['width'];
                            sh = Tool.drow_path[View.video_num][i]['add'][j]['path']['height'];
                            ctx.fillRect(sx,sy,sw,sh);
                        }else if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'text'){
                            sx = Tool.drow_path[View.video_num][i]['add'][j]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['add'][j]['path']['y'];
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            ctx.font = Tool.drow_path[View.video_num][i]['add'][j]['text_size']+"px ''";
                            ctx.fillText(Tool.drow_path[View.video_num][i]['add'][j]['value'],sx,sy);
                        }
                    }
                }
            }
        }

        if(this.type == "select"){
            for(let i = 0; i <Tool.drow_path[View.video_num][Tool.select_id]['add'].length; i++){
                let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['id']);
                let ctx = canvas.getContext("2d");
                let sx,sy,sw,sh;
                if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'line'){
                    ctx.strokeStyle = ViewDrow.Color;
                    ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['thick'] + 3;
                    for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path_num'];k++){
                        ctx.beginPath();
                        if(k == 0){
                            sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'];
                            sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'];
                        }
                        ctx.moveTo(sx,sy);
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'];
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'];
                        ctx.lineTo(sx,sy);
                        ctx.stroke();
                    }
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'squre'){
                    ctx.fillStyle = ViewDrow.Color;
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'];
                    sw = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['width'];
                    sh = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['height'];
                    ctx.fillRect(sx-3,sy-3,sw+6,sh+6);
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'text'){
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'] -  Tool.drow_path[View.video_num][Tool.select_id]['height'] + 3;
                    sw = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['width'];
                    sh = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['height'];
                    ctx.strokeStyle = ViewDrow.Color;
                    ctx.strokeRect(sx,sy,sw,sh);
                }
            }
        }

        if(this.type == "clear"){
            for(let i = 1; i<=Object.keys(Tool.drow_path[View.video_num]).length; i++){
                for(let j = 0; j<Tool.drow_path[View.video_num][i]['add'].length;j++){
                    if(Tool.drow_path[View.video_num][i]['add'][j]['id'] && Tool.drow_path[View.video_num][i]['add'][j]['video'] == View.video_num){
                        let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][i]['add'][j]['id']);
                        let ctx = canvas.getContext("2d");
                        ctx.clearRect(0,0,canvas.width,canvas.height);
                        let sx,sy,sw,sh;
                        if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'line'){
                            ctx.strokeStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            ctx.lineWidth = Tool.drow_path[View.video_num][i]['add'][j]['thick'];
                            for(let k = 0;k<=Tool.drow_path[View.video_num][i]['add'][j]['path_num'];k++){
                                ctx.beginPath();
                                if(k == 0){
                                    sx = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['x'];
                                    sy = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['y'];
                                }
                                ctx.moveTo(sx,sy);
                                sx = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['x'];
                                sy = Tool.drow_path[View.video_num][i]['add'][j]['path'][k]['y'];
                                ctx.lineTo(sx,sy);
                                ctx.stroke();
                            }
                        }else if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'squre'){
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            sx = Tool.drow_path[View.video_num][i]['add'][j]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['add'][j]['path']['y'];
                            sw = Tool.drow_path[View.video_num][i]['add'][j]['path']['width'];
                            sh = Tool.drow_path[View.video_num][i]['add'][j]['path']['height'];
                            ctx.fillRect(sx,sy,sw,sh);
                        }else if(Tool.drow_path[View.video_num][i]['add'][j]['type'] == 'text'){
                            sx = Tool.drow_path[View.video_num][i]['add'][j]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['add'][j]['path']['y'];
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['add'][j]['color'];
                            ctx.font = Tool.drow_path[View.video_num][i]['add'][j]['text_size']+"px ''";
                            ctx.fillText(Tool.drow_path[View.video_num][i]['add'][j]['value'],sx,sy);
                        }
                    }
                }
            }
        }

        if(this.type == "move"){
            for(let i = 0; i< Tool.drow_path[View.video_num][Tool.select_id]['add'].length;i++){
                let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['id']);
                let ctx = canvas.getContext("2d");
                let sx,sy,sw,sh;
                console.log(ViewDrow.moveX,ViewDrow.moveY);
                if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'line'){
                    ctx.strokeStyle = ViewDrow.Color;
                    ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['thick'] + 3;
                    for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path_num'];k++){
                        ctx.beginPath();
                        if(k == 0){
                            sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'] - ViewDrow.moveX;
                            sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'] - ViewDrow.moveY;
                        }
                        ctx.moveTo(sx,sy);
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'] - ViewDrow.moveX;
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'] - ViewDrow.moveY;
                        ctx.lineTo(sx,sy);
                        ctx.stroke();
                    }
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'squre'){
                    ctx.fillStyle = ViewDrow.Color;
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'];
                    sw = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['width'];
                    sh = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['height'];
                    ctx.fillRect(sx-3,sy-3,sw+6,sh+6);
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'text'){
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'] + 3;
                    sw = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['width'];
                    sh = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['height'];
                    ctx.strokeStyle = ViewDrow.Color;
                    ctx.strokeRect(sx,sy - Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['height'],sw,sh);
                }

                if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'line'){
                    ctx.strokeStyle = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['color'];
                    ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['thick'];
                    for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path_num'];k++){
                        ctx.beginPath();
                        if(k == 0){
                            sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'] - ViewDrow.moveX;
                            sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'] - ViewDrow.moveY;
                        }
                        ctx.moveTo(sx,sy);
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'] = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['x'] - ViewDrow.moveX;
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'] = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path'][k]['y'] - ViewDrow.moveY;
                        ctx.lineTo(sx,sy);
                        ctx.stroke();
                    }
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'squre'){
                    ctx.fillStyle = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['color'];
                    sx =  Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy =  Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'];
                    sw = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['width'];
                    sh = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['height'];
                    ctx.fillRect(sx,sy,sw,sh);
                }else if(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['type'] == 'text'){
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['path']['y'];
                    ctx.fillStyle = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['color'];
                    ctx.font = Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['text_size']+"px ''";
                    ctx.fillText(Tool.drow_path[View.video_num][Tool.select_id]['add'][i]['value'],sx,sy);
                }
            }
        }
        ViewDrow.Color = null;
        ViewDrow.moveX = null;
        ViewDrow.moveY = null;
    }
}