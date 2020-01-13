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
                if(document.querySelector("#"+Tool.drow_path[View.video_num][i]['id'])){
                    let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']);
                    let ctx = canvas.getContext("2d");
                    let sx,sy,sw,sh;
                    if(Tool.drow_path[View.video_num][i]['video'] == View.video_num){
                        if(Tool.drow_path[View.video_num][i]['type'] == 'line'){
                            ctx.strokeStyle = Tool.drow_path[View.video_num][i]['color'];
                            ctx.lineWidth = Tool.drow_path[View.video_num][i]['thick'];
                            for(let k = 0;k<=Tool.drow_path[View.video_num][i]['path_num'];k++){
                                ctx.beginPath();
                                if(k == 0){
                                    sx = Tool.drow_path[View.video_num][i]['path'][k]['x'];
                                    sy = Tool.drow_path[View.video_num][i]['path'][k]['y'];
                                }
                                ctx.moveTo(sx,sy);
                                sx = Tool.drow_path[View.video_num][i]['path'][k]['x'];
                                sy = Tool.drow_path[View.video_num][i]['path'][k]['y'];
                                ctx.lineTo(sx,sy);
                                ctx.stroke();
                            }
                        }else if(Tool.drow_path[View.video_num][i]['type'] == 'squre'){
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['color'];
                            sx = Tool.drow_path[View.video_num][i]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['path']['y'];
                            sw = Tool.drow_path[View.video_num][i]['path']['width'];
                            sh = Tool.drow_path[View.video_num][i]['path']['height'];
                            ctx.fillRect(sx,sy,sw,sh);
                        }else if(Tool.drow_path[View.video_num][i]['type'] == 'text'){
                            sx = Tool.drow_path[View.video_num][i]['path']['x'];
                            sy = Tool.drow_path[View.video_num][i]['path']['y'];
                            ctx.fillStyle = Tool.drow_path[View.video_num][i]['color'];
                            ctx.font = Tool.drow_path[View.video_num][i]['text_size']+"px ''";
                            ctx.fillText(Tool.drow_path[View.video_num][i]['value'],sx,sy);
                        }
                    }
                }
            }
        }

        if(this.type == "select"){
            let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][Tool.select_id]['id']);
            let ctx = canvas.getContext("2d");
            let sx,sy,sw,sh;
            if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'line'){
                ctx.strokeStyle = ViewDrow.Color;
                ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['thick'] + 3;
                for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['path_num'];k++){
                    ctx.beginPath();
                    if(k == 0){
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'];
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'];
                    }
                    ctx.moveTo(sx,sy);
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'];
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'];
                    ctx.lineTo(sx,sy);
                    ctx.stroke();
                }
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'squre'){
                ctx.fillStyle = ViewDrow.Color;
                sx = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'];
                sw = Tool.drow_path[View.video_num][Tool.select_id]['path']['width'];
                sh = Tool.drow_path[View.video_num][Tool.select_id]['path']['height'];
                ctx.fillRect(sx-3,sy-3,sw+6,sh+6);
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'text'){
                sx = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'] -  Tool.drow_path[View.video_num][Tool.select_id]['height'] + 3;
                sw = Tool.drow_path[View.video_num][Tool.select_id]['width'];
                sh = Tool.drow_path[View.video_num][Tool.select_id]['height'];
                ctx.strokeStyle = ViewDrow.Color;
                ctx.strokeRect(sx,sy,sw,sh);
            }
        }

        if(this.type == "clear"){
            for(let i = 1; i<=Object.keys(Tool.drow_path[View.video_num]).length; i++){
                if(Tool.drow_path[View.video_num][i]['id'] && Tool.drow_path[View.video_num][i]['video'] == View.video_num){
                    let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][i]['id']);
                    let ctx = canvas.getContext("2d");
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    let sx,sy,sw,sh;
                    if(Tool.drow_path[View.video_num][i]['type'] == 'line'){
                        ctx.strokeStyle = Tool.drow_path[View.video_num][i]['color'];
                        ctx.lineWidth = Tool.drow_path[View.video_num][i]['thick'];
                        for(let k = 0;k<=Tool.drow_path[View.video_num][i]['path_num'];k++){
                            ctx.beginPath();
                            if(k == 0){
                                sx = Tool.drow_path[View.video_num][i]['path'][k]['x'];
                                sy = Tool.drow_path[View.video_num][i]['path'][k]['y'];
                            }
                            ctx.moveTo(sx,sy);
                            sx = Tool.drow_path[View.video_num][i]['path'][k]['x'];
                            sy = Tool.drow_path[View.video_num][i]['path'][k]['y'];
                            ctx.lineTo(sx,sy);
                            ctx.stroke();
                        }
                    }else if(Tool.drow_path[View.video_num][i]['type'] == 'squre'){
                        ctx.fillStyle = Tool.drow_path[View.video_num][i]['color'];
                        sx = Tool.drow_path[View.video_num][i]['path']['x'];
                        sy = Tool.drow_path[View.video_num][i]['path']['y'];
                        sw = Tool.drow_path[View.video_num][i]['path']['width'];
                        sh = Tool.drow_path[View.video_num][i]['path']['height'];
                        ctx.fillRect(sx,sy,sw,sh);
                    }else if(Tool.drow_path[View.video_num][i]['type'] == 'text'){
                        sx = Tool.drow_path[View.video_num][i]['path']['x'];
                        sy = Tool.drow_path[View.video_num][i]['path']['y'];
                        ctx.fillStyle = Tool.drow_path[View.video_num][i]['color'];
                        ctx.font = Tool.drow_path[View.video_num][i]['text_size']+"px ''";
                        ctx.fillText(Tool.drow_path[View.video_num][i]['value'],sx,sy);
                    }
                }
            }
        }

        if(this.type == "move"){
            let canvas = document.querySelector("#"+Tool.drow_path[View.video_num][Tool.select_id]['id']);
            let ctx = canvas.getContext("2d");
            let sx,sy,sw,sh;
            if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'line'){
                ctx.strokeStyle = ViewDrow.Color;
                ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['thick'] + 3;
                for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['path_num'];k++){
                    ctx.beginPath();
                    if(k == 0){
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'] - ViewDrow.moveX;
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'] - ViewDrow.moveY;
                    }
                    ctx.moveTo(sx,sy);
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'] - ViewDrow.moveX;
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'] - ViewDrow.moveY;
                    ctx.lineTo(sx,sy);
                    ctx.stroke();
                }
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'squre'){
                ctx.fillStyle = ViewDrow.Color;
                sx = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'];
                sw = Tool.drow_path[View.video_num][Tool.select_id]['path']['width'];
                sh = Tool.drow_path[View.video_num][Tool.select_id]['path']['height'];
                ctx.fillRect(sx-3,sy-3,sw+6,sh+6);
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'text'){
                sx = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'] + 3;
                sw = Tool.drow_path[View.video_num][Tool.select_id]['width'];
                sh = Tool.drow_path[View.video_num][Tool.select_id]['height'];
                ctx.strokeStyle = ViewDrow.Color;
                ctx.strokeRect(sx,sy - Tool.drow_path[View.video_num][Tool.select_id]['height'],sw,sh);
            }

            if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'line'){
                ctx.strokeStyle = Tool.drow_path[View.video_num][Tool.select_id]['color'];
                ctx.lineWidth = Tool.drow_path[View.video_num][Tool.select_id]['thick'];
                for(let k = 0;k<=Tool.drow_path[View.video_num][Tool.select_id]['path_num'];k++){
                    ctx.beginPath();
                    if(k == 0){
                        sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'] - ViewDrow.moveX;
                        sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'] - ViewDrow.moveY;
                    }
                    ctx.moveTo(sx,sy);
                    sx = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'] = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['x'] - ViewDrow.moveX;
                    sy = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'] = Tool.drow_path[View.video_num][Tool.select_id]['path'][k]['y'] - ViewDrow.moveY;
                    ctx.lineTo(sx,sy);
                    ctx.stroke();
                }
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'squre'){
                ctx.fillStyle = Tool.drow_path[View.video_num][Tool.select_id]['color'];
                sx =  Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy =  Tool.drow_path[View.video_num][Tool.select_id]['path']['y'];
                sw = Tool.drow_path[View.video_num][Tool.select_id]['path']['width'];
                sh = Tool.drow_path[View.video_num][Tool.select_id]['path']['height'];
                ctx.fillRect(sx,sy,sw,sh);
            }else if(Tool.drow_path[View.video_num][Tool.select_id]['type'] == 'text'){
                sx = Tool.drow_path[View.video_num][Tool.select_id]['path']['x'];
                sy = Tool.drow_path[View.video_num][Tool.select_id]['path']['y'];
                ctx.fillStyle = Tool.drow_path[View.video_num][Tool.select_id]['color'];
                ctx.font = Tool.drow_path[View.video_num][Tool.select_id]['text_size']+"px ''";
                ctx.fillText(Tool.drow_path[View.video_num][Tool.select_id]['value'],sx,sy);
            }
        }
        ViewDrow.Color = null;
        ViewDrow.moveX = null;
        ViewDrow.moveY = null;
    }
}