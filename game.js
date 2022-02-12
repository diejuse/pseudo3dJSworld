function iniciarVariables() {
        
        hay_texto=false; // variable global para indicar si hay texto sobre la información de un muro o una conversación
        leyendo=true;
        info=0;
        diapos={};
        diapos["8_7"]={name:"proyecto",num:1,numMax:67,maximize:false};
        diapos["4_4"]={name:"economia",num:1,numMax:15,maximize:false};
        // DIMENSIONES
        
        escenario={
            "proporcionAltura":1,
            "alturaMuro":1.3
        };
        
        minimapa={
            sizeCas:30,
            sizeDis:9
        };
        
	SPRITESIZE=100;

        // REFERENCIA A LOS LIENZOS
	canvas=document.getElementById("canvas").getContext("2d");
	canvas_minimapa=document.getElementById("minimapa").getContext("2d");
        
	// DATOS DEL PERSONAJE JUGADOR
	
	player={y:5,x:7,z:1,dir:"S",objeto:-99,orden:"",conversando:-99};
                // objeto:-99 significa que no llevas nada
                // conversando:-99 significa que no hablas con nadie

	// DATOS DE LOS PERSONAJES NO JUGADORES
	
	pnj=[];
	pnj[0]={nombre:"Zozhen",y:7,x:1,z:1,dir:'S',pic:"0",stop:false,activo:true,tipo:"zozhen",
            frases:[
            "Economics is the science that studies how to manage limited resources to meet the growing needs of human beings.",
            "'Take care of small expenses; a small hole sinks a ship'. Benjamin Franklin.",
            "'Inflation is the mother of unemployment, and the invisible thief of those who have saved.'. Margaret Thatcher",
            "'Being good at business is the most fascinating kind of art'. Andy Warhol.",
            "'Entrepreneurs want to be free from government when they prosper, but protected when they do badly.' William Simon.",
            "'Badly losing money is generally a real crime; but acquiring it in the wrong way is worse; although the worst of all is to waste it.'. John Ruskin.",
            "'The man who knows how to spend and save is the happiest, because he enjoys both.'. Samuel Johnson.",
            "'Saving is poetic, because it is creative; waste is not poetic, because it is destructive.'. Gilbert Keith Chesterton.",
            "'In business there are no friends: there are only customers.'. Alejandro Dumas",
            "'The passion to acquire goods with which to support a vain expense corrupts the purest souls.'. François de Salignac de la Mothe Fénelon.",
            "'Inflation is a tax imposed without legislation.'. Milton Friedman.",
            "'Too many people have become pessimistic by financing optimists.'. C.T. Jones.",
            "'The pessimist complains about the wind. The optimist expects it to change. The realist adjusts the candles.'. William George Ward.",
            "'The price is what you pay. The value is what you receive.'. Warren Buffet."
            ]
        };
	pnj[1]={nombre:"Elfric",y:8,x:1,z:1,dir:'E',pic:"0",stop:false,activo:true,tipo:"elfric",
            frases:[
            "Enjoy the virtual world.",
            "I hope you're having a good time.",
            "I'm glad to see you.",
            "The spheres in this world are not from this planet.",
            "There are some books on the floor, related to economics subjects that you can read.",
            "Click on the images and objects in front of you. you will get information.",
            "In the version of this website we are only three in this world.",
            "My partner will tell you phrases related to the Economy.",
            "The creator of Everything is Diego Jurado Seguí (diejuse).",
            "You can open doors and close them by clicking on them.",
            "Have you seen the beautiful pictures that are in the houses?",
            "Have you seen Michelangelo's statue?",
            "I like this world, but in future versions it will be better. That's what my creator told me.",
            "Trees with green leaves, trees with red leaves... Trees with blue leaves would be nice, right?"
            ]
        };
	
        // DATOS DE LOS OBJETOS DEL MAPA
		
	objeto=[];
	
	objeto[0]={x:10,y:8,z:1,image:"libro",nombre:'libro1',accion:"leer",texto:libros["libro1"]}; // libro
	objeto[1]={x:4,y:5,z:1,image:"18",nombre:'poción',accion:""    }; // pocion
	objeto[2]={x:2,y:13,z:1,image:"libro1",nombre:'libro2',accion:"leer",texto:libros["libro2"]}; // libro
	
	// EXTRAS
	FIN=0;
	tiempo={"dia":0,"hora":6,"minuto":30,"ciclos":0};
}

function fov(){
	var casillasVisibles=[],
            rango,
            lejania=7;
            
        // Mirando hacia y-1 NORTE
	if (player.dir=="N")
            for (var y=player.y-lejania;y<=player.y;y++){
                if (y<=player.y-4) rango=4; else if (y<=player.y-3) rango=3; else if (y<=player.y-1) rango=2; else rango=1;
                for (var x=rango;x>=1;x--) {
                    if (existeCasilla(y,player.x+x)) casillasVisibles.push({x:player.x+x,y:y,d:player.y-y});
                    if (existeCasilla(y,player.x-x)) casillasVisibles.push({x:player.x-x,y:y,d:player.y-y});
                }
                if (existeCasilla(y,player.x)) casillasVisibles.push({x:player.x,y:y,d:player.y-y});
            }				
	
	// Mirando hacia y+1 SUR
	if (player.dir=="S")
            for (var y=player.y+lejania;y>=player.y;y--){
                if (y>=player.y+4) rango=4; else if (y>=player.y+3) rango=3; else if (y>=player.y+1) rango=2; else rango=1;
                for (var x=rango;x>=1;x--) {
                    if (existeCasilla(y,player.x+x)) casillasVisibles.push({x:player.x+x,y:y,d:y-player.y});
                    if (existeCasilla(y,player.x-x)) casillasVisibles.push({x:player.x-x,y:y,d:y-player.y});
                }					
                if (existeCasilla(y,player.x)) casillasVisibles.push({x:player.x,y:y,d:y-player.y});
            }

        // Mirando hacia x-1 WEST
	if (player.dir=="W")
            for (var x=player.x-lejania;x<=player.x;x++){
                if (x<=player.x-4) rango=4; else if (x<=player.x-3) rango=3; else if (x<=player.x-1) rango=2; else rango=1;
                for (var y=rango;y>=1;y--){	
                    if (existeCasilla(x,player.y+y)) casillasVisibles.push({x:x,y:player.y+y,d:player.x-x});
                    if (existeCasilla(x,player.y-y)) casillasVisibles.push({x:x,y:player.y-y,d:player.x-x});
                }	
                if (existeCasilla(x,player.y)) casillasVisibles.push({x:x,y:player.y,d:player.x-x});	
            }	
            
	// Mirando hacia x+1 ESTE
	if (player.dir=="E")
            for (var x=player.x+lejania;x>=player.x;x--){
                if (x>=player.x+4) rango=4; else if (x>=player.x+3) rango=3; else if (x>=player.x+1) rango=2; else rango=1;
                for (var y=rango;y>=1;y--){					
                    if (existeCasilla(x,player.y+y)) casillasVisibles.push({x:x,y:player.y+y,d:x-player.x});
                    if (existeCasilla(x,player.y-y)) casillasVisibles.push({x:x,y:player.y-y,d:x-player.x});
                }
                if (existeCasilla(x,player.y)) casillasVisibles.push({x:x,y:player.y,d:x-player.x});
            }			
	
			
		
        return casillasVisibles;
}

function existeCasilla(y,x){
    var existe=false;
    if (x>=0 && x<mapa.length && y>=0 && y<mapa.length) existe=true;
    return existe;
}
    
function posicion3Da2D(y,x,z){
    var posX,posY;

    if (player.dir=='E') {
        posY=player.y+.5;posX=player.x+.2;
        player.dir1='W';rad=Math.PI*2;
    } else
    if (player.dir=='W') {
        posY=player.y+.5;posX=player.x+.8;
        player.dir1='E';rad=Math.PI;
    } else
    if (player.dir=='N') {
        posY=player.y+.8;posX=player.x+.5;
        player.dir1='S';rad=Math.PI*3/2;
    } else
    if (player.dir=='S')  {
        posY=player.y+.2;posX=player.x+.5;
        player.dir1='N';rad=Math.PI/2;
    }

    var dx,dy,dista,angle,fov,viewDist,top,left,h;

    dx = x - posX;
    dy = y - posY;

    // distance to sprite
    dista = Math.sqrt(dx*dx + dy*dy);
    angle = Math.atan2(dy, dx)

    if (angle-rad < -1*Math.PI) angle += 2*Math.PI;
    if (angle-rad >= Math.PI) angle -= 2*Math.PI;

    // left= (angle-rad+Math.PI/4)/( Math.PI/(2*escenario.width) );  // con 90 grados de FOV
    left= (angle-rad+Math.PI/6)/( Math.PI/(3*escenario.width) ); // con 60 grados de FOV
    //left= (angle-rad+Math.PI/5)/( Math.PI/(2.5*escenario.width) ); // con 75 grados de FOV

    h=escenario.height/(Math.cos(angle-rad) *dista);
    top=(escenario.height/2)+0.5*h+(player.z-z)*h+0;

    return {x:left,y:top};
}

function queHay(y,x,codigo){
    var hay=0;
    if (typeof(mapa[y])!="undefined") if (typeof(mapa[y][x])!="undefined") if (typeof(mapa[y][x][codigo])!="undefined") hay=mapa[y][x][codigo];   
    return hay;
}

function dibuja(ldy,ldx,ldz,rdy,rdx,rdz,lty,ltx,ltz,rty,rtx,rtz,canvas,image){
    // esquina abajo izquierda
    // esquina abajo derecha
    // esquina arriba izquierda
    // esquina arriba derecha

    var pts=[];

    pts[0]={}; // esquina top left
    pts[0].x=posicion3Da2D(lty,ltx,ltz).x;pts[0].y=posicion3Da2D(lty,ltx,ltz).y;pts[0].u=0;pts[0].v=0;

    pts[1]={}; // esquina top right
    pts[1].x=posicion3Da2D(rty,rtx,rtz).x;pts[1].y=posicion3Da2D(rty,rtx,rtz).y;pts[1].u=SPRITESIZE;pts[1].v=0;

    pts[2]={}; // esquina down right
    pts[2].x=posicion3Da2D(rdy,rdx,rdz).x;pts[2].y=posicion3Da2D(rdy,rdx,rdz).y;pts[2].u=SPRITESIZE;pts[2].v=SPRITESIZE;

    pts[3]={}; // esquina down left
    pts[3].x=posicion3Da2D(ldy,ldx,ldz).x;pts[3].y=posicion3Da2D(ldy,ldx,ldz).y;pts[3].u=0;pts[3].v=SPRITESIZE;

    textureMap(canvas, image, pts);	
}

function textureMap(ctx, texture, pts) {
    var tris = [[0, 1, 2], [2, 3, 0]]; // Split in two triangles
    for (var t=0; t<tris.length; t++) {
        var pp = tris[t];
        var x0 = pts[pp[0]].x, x1 = pts[pp[1]].x, x2 = pts[pp[2]].x;
        var y0 = pts[pp[0]].y, y1 = pts[pp[1]].y, y2 = pts[pp[2]].y;
        var u0 = pts[pp[0]].u, u1 = pts[pp[1]].u, u2 = pts[pp[2]].u;
        var v0 = pts[pp[0]].v, v1 = pts[pp[1]].v, v2 = pts[pp[2]].v;

        // Set clipping area so that only pixels inside the triangle will
        // be affected by the image drawing operation
        ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip();

        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2
                      - v0*u1*x2 - u0*x1*v2;
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2
                      - v0*u1*y2 - u0*y1*v2;

        // Draw the transformed image
        ctx.transform(delta_a/delta, delta_d/delta,
                      delta_b/delta, delta_e/delta,
                      delta_c/delta, delta_f/delta);
					  
        if (t==0) {ctx.drawImage(hojaImagenes,texture.x,texture.y,SPRITESIZE,SPRITESIZE, 0, 0, u2,v2);}
	else if (t==1) {ctx.drawImage(hojaImagenes,texture.x,texture.y,SPRITESIZE,SPRITESIZE, 0, 0, u0,v0);}
        ctx.restore();
    }
}


function dibujaPizarra (cas) {
    hay_texto=true;
    $("#elementosdiv").html("");
    var txt="<div id='exposicion' style='background-color:gray;position:absolute;top:13%;left:33%;height:42%;width:36%;z-index:19;'>";
    txt+="<canvas id='exposicion-marco' width=100 height=100 class='entero'></canvas>";
    txt+="<img style='position:absolute;top:0;left:0;width:100%;height:100%' src='diapositivas/"+diapos[cas].name+"/"+diapos[cas].num+".png'>";
    
    txt+="</div>";
    
    txt+="<div style='position:absolute;top:7%;left:30%;height:6%;width:5%;border:2px solid black;background:rgba(255,255,255,0.2);z-index:21;'><canvas id='exposicion-zoom' width=100 height=100 class='entero'></canvas></div>";
    txt+="<div style='position:absolute;top:55.5%;left:30%;height:5.1%;width:5%;border:3px solid black;background:rgba(255,255,255,0.2);z-index:23;'><canvas id='exposicion-flechaizq' width=100 height=100 class='entero'></canvas></div>";
    txt+="<div style='position:absolute;top:55.5%;left:67%;height:5.1%;width:5%;border:3px solid black;background:rgba(255,255,255,0.2);z-index:23;'><canvas id='exposicion-flechader' width=100 height=100 class='entero'></canvas></div>";
    txt+="<div id='exposicion-numDiapos' style='position:absolute;top:55%;left:30%;width:42%;height:6%;text-align:center;display:table;z-index:22;'><div style='margin: auto;font-size:28px;font-weight:bold;display:table-cell;vertical-align:middle;'><div id='exposicion-numDiapos1' style='border:3px solid black;display:inline-block;background:rgba(255,255,255,0.2);'>"+diapos[cas].num+" / "+diapos[cas].numMax+"</div></div></div>";
    $("#elementosdiv").append(txt);
    
    document.getElementById("exposicion-zoom").getContext("2d").drawImage(
        hojaImagenes,imagenes["max"].x,imagenes["max"].y,
        SPRITESIZE,SPRITESIZE,0,0,100,100);
    document.getElementById("exposicion-flechaizq").getContext("2d").drawImage(
        hojaImagenes,imagenes["arrow_left"].x,imagenes["arrow_left"].y,
        SPRITESIZE,SPRITESIZE,0,0,100,100);
    document.getElementById("exposicion-flechader").getContext("2d").drawImage(
        hojaImagenes,imagenes["arrow_right"].x,imagenes["arrow_right"].y,
        SPRITESIZE,SPRITESIZE,0,0,100,100);
    
    $("#exposicion-zoom").on("click",function(){
        if (diapos[cas].maximize==false){
            leyendo=true;
            $("#touchpad").remove();
            if (escenario.proporcionAltura<1) {escenario.proporcionAltura=1;pantalla();}
            document.getElementById("exposicion-marco").getContext("2d").drawImage(
                hojaImagenes,imagenes["piza"].x,imagenes["piza"].y,
                SPRITESIZE,SPRITESIZE,0,0,100,100);
            $("#exposicion").css({"left":"0%","top":"0%","width":"100%","height":"100%"});
            $("#elementosdiv").css("z-index","21");
            $("#elementosdiv").css("z-index","25");
            $("#exposicion > img:first").css({"left":"5%","top":"8%","width":"90%","height":"84%"});
            $("#exposicion-zoom").closest("div").css({"left":"1%","top":"1%"});
            $("#exposicion-flechaizq").closest("div").css({"left":"1%","top":"93.4%"});
            $("#exposicion-flechader").closest("div").css({"left":"94%","top":"93.4%"});
            $("#exposicion-numDiapos").css({"left":"0%","top":"93%","width":"100%"});
            diapos[cas].maximize=true;
        } else {leyendo=false;diapos[cas].maximize=false;$("#elementosdiv").css("z-index","10");$("#minimapa").css("z-index","10");dibujaPizarra(cas);}
    });
    
    $("#exposicion-flechader").on("click",function(){
        diapos[cas].num++;
        if (diapos[cas].num>diapos[cas].numMax) diapos[cas].num=1;
        $("#exposicion > img:first").attr("src","diapositivas/"+diapos[cas].name+"/"+diapos[cas].num+".png");
        $("#exposicion-numDiapos1").html(diapos[cas].num+" / "+diapos[cas].numMax);
        
    });
    
    $("#exposicion-flechaizq").on("click",function(){
        diapos[cas].num--;
        if (diapos[cas].num<1) diapos[cas].num=diapos[cas].numMax;        
        $("#exposicion > img:first").attr("src","diapositivas/"+diapos[cas].name+"/"+diapos[cas].num+".png");
        $("#exposicion-numDiapos1").html(diapos[cas].num+" / "+diapos[cas].numMax);
    });
                       
                                
}

function dibujaObjetos(yy,xx,zzz,py,px,pzz){
    var image;    
    for (var i=0; i<objeto.length; i++)
        if (Math.floor(objeto[i].x)==xx && Math.floor(objeto[i].y)==yy  && Math.floor(objeto[i].z)==zzz) {			
            image = imagenes[objeto[i].image];
            if (player.dir=="N" || player.dir=="S")
                    dibuja( py+.5,px+.4,pzz, 
                            py+.5,px+.6,pzz,
                            py+.5,px+.4,pzz+.15, 
                            py+.5,px+.6,pzz+.15,
                            canvas,image);
            else if (player.dir=="E" || player.dir=="W")
                    dibuja( py+.6,px+.5,pzz, 
                            py+.4,px+.5,pzz,
                            py+.6,px+.5,pzz+.15, 
                            py+.4,px+.5,pzz+.15,
                            canvas,image);
        }
}

function dibujaPNJ(yy,xx,zzz,py,px,pzz){
    var laimagen,hh=escenario.alturaMuro;
    for (var i=0; i<pnj.length; i++) {	
        laimagen=0;
        if (Math.floor(pnj[i].x)==xx && Math.floor(pnj[i].y)==yy && Math.floor(pnj[i].z)==zzz && pnj[i].activo==true) {
            pzz=1;
            // DIBUJAMOS A LOS PNJ SI MIRAN HACIA SUR O NORTE
            if (player.dir=="S") { // mirando hacia SUR
                if (pnj[i].dir=='N') {laimagen=imagenes[pnj[i].tipo+"_0"];}
                else if (pnj[i].dir=='S') {laimagen=imagenes[pnj[i].tipo+"_3"];}
                else if (pnj[i].dir=='E') {laimagen=imagenes[pnj[i].tipo+"_1"];}
                else if (pnj[i].dir=='W') {laimagen=imagenes[pnj[i].tipo+"_2"];}
            }  
            else if (player.dir=="N") { // mirando hacia y-1 NORTE
                if (pnj[i].dir=='N') {laimagen=imagenes[pnj[i].tipo+"_3"];}
                else if (pnj[i].dir=='S') {laimagen=imagenes[pnj[i].tipo+"_0"];}
                else if (pnj[i].dir=='E') {laimagen=imagenes[pnj[i].tipo+"_1"];}				
                else if (pnj[i].dir=='W') {laimagen=imagenes[pnj[i].tipo+"_2"];}
            }

            if (laimagen!=0) {
                dibuja(
                    py+.5,px+0.25,pzz,
                    py+.5,px+0.75,pzz,
                    py+.5,px+0.25,pzz+hh-.4,
                    py+.5,px+0.75,pzz+hh-.4,
                    canvas,laimagen);
                continue;
            }
            
            // DIBUJAMOS A LOS PNJS SI MIRAN HACIA ESTE U OESTE: EL QUE VA MAL
            if (player.dir=="E") { // mirando hacia x+1 ESTE
                    if (pnj[i].dir=='N') {laimagen=imagenes[pnj[i].tipo+"_2"];}
                    else if (pnj[i].dir=='S') {laimagen=imagenes[pnj[i].tipo+"_1"];}
                    else if (pnj[i].dir=='E') {laimagen=imagenes[pnj[i].tipo+"_3"];}
                    else if (pnj[i].dir=='W') {laimagen=imagenes[pnj[i].tipo+"_0"];}
            } 
            else if (player.dir=="W") { // mirando hacia x-1 OESTE			
                    if (pnj[i].dir=='N') {laimagen=imagenes[pnj[i].tipo+"_2"];}
                    else if (pnj[i].dir=='S') {laimagen=imagenes[pnj[i].tipo+"_1"];}
                    else if (pnj[i].dir=='E') {laimagen=imagenes[pnj[i].tipo+"_0"];}
                    else if (pnj[i].dir=='W') {laimagen=imagenes[pnj[i].tipo+"_3"];}
            }

            if (laimagen!=0) {
                dibuja(
                    py+.25,px+0.5,pzz,
                    py+.75,px+0.5,pzz,
                    py+.25,px+0.5,pzz+hh-.4,
                    py+.75,px+0.5,pzz+hh-.4,
                    canvas,laimagen);
                continue;
            }
        }
    }
}

function dibujaEscenario(){
	
	var vx,vy,vz;
	var xx,yy,zzz,dd,image;
	var px,py,pzz;
	var posX=Math.floor(player.x);
	var posY=Math.floor(player.y);
	var posZ=Math.floor(player.z);
	var lineas=SPRITESIZE;	// las lineas que se pintan de cada muro
	var hh=escenario.alturaMuro;
	
	var orden_pinta_casilla=[];
	var orden_pinta=0;

	// 1º LIMPIEZA DEL CANVAS
        canvas.clearRect(0,0,escenario.width, escenario.height);
	// 2º DIBUJO DEL CIELO

	    // Una imagen u otra según la hora
	    if (tiempo.hora>=6 && tiempo.hora<=8)	{image=imagenes['sky_amanecer'];}
	    else if (tiempo.hora>=9 && tiempo.hora<=18)	{image=imagenes['sky_dia'];}
	    else if (tiempo.hora>=19 && tiempo.hora<=21){image=imagenes['sky_atardecer'];}
	    else if (tiempo.hora>=22 || tiempo.hora<=5)	{image=imagenes['sky_amanecer'];}
	    
	    // dibujo cielo segun donde mires.
	    // xx es el inicio del recorte y px es el final del recorte
	    if (player.dir=="N") {xx=SPRITESIZE/4;px=SPRITESIZE/2;} // mirando hacia y-1
	    if (player.dir=="S") {xx=SPRITESIZE/2+SPRITESIZE/4;px=SPRITESIZE;} // mirando hacia y+1
	    if (player.dir=="W") {xx=0;px=SPRITESIZE/4;} // mirando hacia x-1 	
	    if (player.dir=="E") {xx=SPRITESIZE/2;px=SPRITESIZE/2+SPRITESIZE/4;} // mirando hacia x+1
		    
	    canvas.drawImage(hojaImagenes,image.x+xx,image.y,px-xx,SPRITESIZE, 0, 0, escenario.width, escenario.height);
	
	// 3º SE REPASA UNA A UNA LAS CASILLAS QUE EL PJ VISUALIZA
	
	var casillasVisibles=fov();

	for (var i=0; i<casillasVisibles.length; i++) {	
	
            xx=casillasVisibles[i].x;
            yy=casillasVisibles[i].y;
            zzz=1;
            dd=casillasVisibles[i].d;	// distancias
            
            px=xx;py=yy;pzz=zzz;
            
            if (player.dir=="E") { // mirando hacia x+1 ESTE
                px=xx+1;
                orden_pinta_casilla=['E','F','T','N','S','C','W'];
            } 
            if (player.dir=="W") { // mirando hacia x-1 OESTE
                px=xx-1;
                orden_pinta_casilla=['W','F','T','N','S','C','E'];
            } 
            if (player.dir=="N") { // mirando hacia y-1 NORTE
                py=yy-1;
                orden_pinta_casilla=['N','F','T','E','W','C','S'];
            }  
            if (player.dir=="S")  { // mirando hacia y+1 SUR
                py=yy+1;
                orden_pinta_casilla=['S','F','T','E','W','C','N'];
            } 
            
            orden_pinta=0;
            
            
            
            // 3.2. DIBUJAMOS CADA PARTE DE CADA CASILLA SEGUN EL ORDEN QUE CORRESPONDA DEPENDIENDO DE LA DIRECCION HACIA LA QUE ESTAMOS MIRANDO
            while (orden_pinta<orden_pinta_casilla.length) {
            
                // Guarda el código de la imagen
                if (queHay(yy,xx,orden_pinta_casilla[orden_pinta])!='0')
                            image=imagenes[queHay(yy,xx,orden_pinta_casilla[orden_pinta])];
                
                // SUELO                
                if (orden_pinta_casilla[orden_pinta]=='F' && queHay(yy,xx,'F')!='0')
                    dibuja( py,px,pzz,
                            py,px+1,pzz,
                            py+1,px,pzz,
                            py+1,px+1,pzz,
                            canvas,image);

                // TECHO
                if (orden_pinta_casilla[orden_pinta]=='T' && queHay(yy,xx,'T')!='0') 
                    dibuja( py,px,pzz+hh,
                            py,px+1,pzz+hh,
                            py+1,px,pzz+hh,
                            py+1,px+1,pzz+hh,
                            canvas,image);

                // MURO OESTE
                if (orden_pinta_casilla[orden_pinta]=='W' && queHay(yy,xx,'W')!='0')
                    if (!( (posX==xx && posY==yy) && player.dir=="E" )){
                        if (dd>=2) {
                            dibuja( py,px,pzz,
                                    py+1,px,pzz,
                                    py,px,pzz+hh,
                                    py+1,px,pzz+hh,
                                    canvas,image);
                                    
                        } else {
                            vx=0;vy=1.01;
                            var stripimageWidth=Math.floor((SPRITESIZE)/lineas);
                            for (var ii=0;ii<SPRITESIZE-1;ii=ii+stripimageWidth){
                                    stripscreenWidth=Math.abs(posicion3Da2D(py+.01+((ii+stripimageWidth)/SPRITESIZE)*vy,px+vx,pzz).x-posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz).x);
                                    canvas.drawImage(hojaImagenes,image.x+ii, image.y, stripimageWidth, SPRITESIZE, posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).x ,posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).y , stripscreenWidth,posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz).y-posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).y );					
                            }						
                        }
                }
                
                // MURO ESTE
                if (orden_pinta_casilla[orden_pinta]=='E' && queHay(yy,xx,'E')!='0' )
                    if ( !((posX==xx && posY==yy) && player.dir=="W") ) {
                        if (dd>=2) {
                            dibuja( py,px+1,pzz,
                                    py+1,px+1,pzz,
                                    py,px+1,pzz+hh,
                                    py+1,px+1,pzz+hh,
                                    canvas,image);
                        } else {
                            vx=.98;vy=1.02;
                            var stripimageWidth=Math.floor((SPRITESIZE)/lineas);
                            for (var ii=0;ii<SPRITESIZE-1;ii=ii+stripimageWidth){
                                stripscreenWidth=Math.abs(posicion3Da2D(py+0.01+((ii+stripimageWidth)/SPRITESIZE)*vy,px+vx,pzz).x-posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz).x);
                                canvas.drawImage(hojaImagenes,image.x+ii, image.y, stripimageWidth, SPRITESIZE, posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).x ,posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).y , stripscreenWidth,posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz).y-posicion3Da2D(py+(ii/SPRITESIZE)*vy,px+vx,pzz+hh).y );					
                            }	                                
                        }						
                }
                
                // MURO NORTE
                if (orden_pinta_casilla[orden_pinta]=='N' && queHay(yy,xx,'N')!='0')
                    if (!( (posX==xx && posY==yy) && (player.dir=="S") )) {
                        if (dd>=2) {
                            dibuja( py,px,pzz,
                                    py,px+1,pzz,
                                    py,px,pzz+hh,
                                    py,px+1,pzz+hh,
                                    canvas,image);
                        } else {
                            vx=1.01;vy=0;
                            image=imagenes[queHay(yy,xx,'N')];
                            var stripimageWidth=Math.floor((SPRITESIZE)/lineas);
                            for (var ii=0;ii<SPRITESIZE-1;ii=ii+stripimageWidth){
                                stripscreenWidth=Math.abs(posicion3Da2D(py+vy,px+.01+((ii+stripimageWidth)/SPRITESIZE)*vx,pzz).x-posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz).x);
                                canvas.drawImage(hojaImagenes,image.x+ii, image.y, stripimageWidth, SPRITESIZE, posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).x ,posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).y , stripscreenWidth,posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz).y-posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).y );					
                            }
                        }
                }
                
                // MURO SUR
                if (orden_pinta_casilla[orden_pinta]=='S' && queHay(yy,xx,'S')!='0')
                    if (!( (posX==xx && posY==yy) && player.dir=="N" )) {
                        if (dd>=2) {	
                            dibuja( py+1,px,pzz,
                                    py+1,px+1,pzz,
                                    py+1,px,pzz+hh,
                                    py+1,px+1,pzz+hh,
                                    canvas,image);
                        } else {
                            vx=1.01;vy=1;
                            var stripimageWidth=Math.floor((SPRITESIZE)/lineas);
                            for (var ii=0;ii<SPRITESIZE-1;ii=ii+stripimageWidth){
                                stripscreenWidth=Math.abs(posicion3Da2D(py+vy,px+.01+((ii+stripimageWidth)/SPRITESIZE)*vx,pzz).x-posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz).x);
                                canvas.drawImage(hojaImagenes,image.x+ii, image.y, stripimageWidth, SPRITESIZE, posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).x ,posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).y , stripscreenWidth,posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz).y-posicion3Da2D(py+vy,px+(ii/SPRITESIZE)*vx,pzz+hh).y );					
                            }
                        }
                }

                // ELEMENTOS CENTRALES
                if (orden_pinta_casilla[orden_pinta]=='C') {
                    
                    // DIBUJO DEL CONTENIDO
                    if (queHay(yy,xx,'C')!='0'){
                        var altura=hh,anchura=.8;
                        
                       
                        // SI HAY ARBOLES LOS PONEMOS MAS ALTOS
                        if (queHay(yy,xx,'C')=='13'|| queHay(yy,xx,'C')=='a1') {altura=2;varaltura=-.2;}
                        

                        if (player.dir=="N")
                            dibuja( py+.8,px+.5-anchura/2,pzz, 
                                    py+.8,px+.5+anchura/2,pzz,
                                    py+.8,px+.5-anchura/2,pzz+altura, 
                                    py+.8,px+.5+anchura/2,pzz+altura,
                                    canvas,image);
                        if (player.dir=="S")
                            dibuja( py+.2,px+.5+anchura/2,pzz, 
                                    py+.2,px+.5-anchura/2,pzz,
                                    py+.2,px+.5+anchura/2,pzz+altura, 
                                    py+.2,px+.5-anchura/2,pzz+altura,
                                    canvas,image);
                        else if (player.dir=="W")
                            dibuja( py+.5+anchura/2,px+.8,pzz, 
                                    py+.5-anchura/2,px+.8,pzz,
                                    py+.5+anchura/2,px+.8,pzz+altura, 
                                    py+.5-anchura/2,px+.8,pzz+altura,
                                    canvas,image);
                        else if (player.dir=="E")
                            dibuja( py+.5-anchura/2,px+.2,pzz, 
                                    py+.5+anchura/2,px+.2,pzz,
                                    py+.5-anchura/2,px+.2,pzz+altura, 
                                    py+.5+anchura/2,px+.2,pzz+altura,
                                    canvas,image);
                    }
                    // DIBUJO DE LOS PNJ
                    dibujaPNJ(yy,xx,zzz,py,px,pzz);
                    
                    // DIBUJO DE LOS OBJETOS
                    dibujaObjetos(yy,xx,zzz,py,px,pzz);
                        
                } // FIN DE CONTENIDO
                
                orden_pinta++;

            } // fin de while
            
            /*
            // 4º ANIMACIONES
            
            // ANIMACION DEL AGUA
            if (queHay(yy,xx,"F")=="39") {mapa[yy][xx]["F"]="40"} else
                            if (queHay(yy,xx,"F")=="40") {mapa[yy][xx]["F"]="39"}
            // ANIMACION DE ANTORCHA
            if (queHay(yy,xx,"C")=="41") {mapa[yy][xx]["C"]="42"} else
                            if (queHay(yy,xx,"C")=="42") {mapa[yy][xx]["C"]="41"}
            */
            
            // si miras hacia el este x+1 y hay un IFRAME en un muro oeste y estas justo delante
            
            // 5º PIZARRAS
            if ( (posX==xx && posY==yy) &&  queHay(yy,xx,player.dir)=='piz' && typeof(diapos[yy+"_"+xx])!="undefined") dibujaPizarra(yy+"_"+xx);
            
	} // FIN DE FOR	

	// 3.1. DIBUJAMOS EN EL MINIMAPA
        dibujaMiniMapa(casillasVisibles);
} // FIN DE FUNCTION

function gestionPNJ(){
    var random_opcion,random_ndir;
    var ndir,dir1;
    var ruleta=['N','E','S','W'];
    var newY,newX;
    var vy=0,vx=0;

    var procedeatacar=false;

    for (var i=0; i<pnj.length; i++) {	

        if (pnj[i].stop==true) continue;
        
        if (pnj[i].dir=='N') {ndir=0;dir1="S";vy=-1;vx=0;}
        if (pnj[i].dir=='E') {ndir=1;dir1="W";vy=0;vx=1;}
        if (pnj[i].dir=='S') {ndir=2;dir1="N";vy=1;vx=0;}
        if (pnj[i].dir=='W') {ndir=3;dir1="E";vy=0;vx=-1;}

        newX=pnj[i].x+vx;
        newY=pnj[i].y+vy;
        
        var mov=evaluaMovimiento(pnj[i].y,pnj[i].x,newY,newX);
        newX=mov.x;
        newY=mov.y;
        // SE ANDA
        random_opcion=Math.floor(Math.random()*2);
        
        if (random_opcion==0) { // girarse
                random_ndir=Math.floor(Math.random()*2);
                if (random_ndir==0) {ndir--;} else {ndir++;}
                if (ndir==-1) ndir=3;
                if (ndir==4) ndir=0;
                pnj[i].dir=ruleta[ndir];
                
        } else { // avanzar
                var mov=evaluaMovimiento(pnj[i].y,pnj[i].x,newY,newX);
                pnj[i].y=newY;
                pnj[i].x=newX;				    
        }                
    }

}



function dibujaMiniMapa(casillasVisibles){
    canvas_minimapa.fillStyle = "black";
    canvas_minimapa.clearRect(0,0,500,500);

    var size=minimapa.sizeCas,w=2,ima,py,px;
    var dis=minimapa.sizeDis,dism=Math.floor(dis/2);
    for (var y=0;y<dis;y++) {
        for (var x=0;x<dis;x++) {
            canvas_minimapa.strokeStyle="black";
            py=player.y-dism+y;px=player.x-dism+x;
            if (queHay(py,px,"F")!='0') {
                ima=queHay(py,px,"F");
                canvas_minimapa.drawImage(hojaImagenes,imagenes[ima].x,imagenes[ima].y,SPRITESIZE,SPRITESIZE, x * size,y* size, size,size);
            }
            if (queHay(py,px,"C")!='0') {
                ima=queHay(py,px,"C");
                canvas_minimapa.drawImage(hojaImagenes,imagenes[ima].x,imagenes[ima].y,SPRITESIZE,SPRITESIZE, x * size,y* size, size,size);
            }
            
            if (queHay(py,px,"N")!='0') canvas_minimapa.fillRect(x * size,y * size,size,w);
            if (queHay(py,px,"S")!='0') canvas_minimapa.fillRect(x * size,(y+1)*size-w,size,w);
            if (queHay(py,px,"W")!='0') canvas_minimapa.fillRect(x * size,y * size,w,size);
            if (queHay(py,px,"E")!='0') canvas_minimapa.fillRect((x+1) * size-w,y * size,w,size);
        }
    }
    
    if (player.dir=="N") ima="arrow_up"; else if(player.dir=="S") ima="arrow_down"; else if (player.dir=="W") ima="arrow_left"; else ima="arrow_right";
    canvas_minimapa.drawImage(hojaImagenes,imagenes[ima].x,imagenes[ima].y,SPRITESIZE,SPRITESIZE,size*(dism),size*(dism), size,size);

}

function gestionPJ(){
    if (player.orden=="") return false;
        
    var change=false;
    var ruleta=["N","E","S","W"],
        dir=ruleta.indexOf(player.dir),dir_new=dir,
        vy=0,vx=0;
        
    if (player.orden=="gira_izq") {
        dir_new=dir-1; if (dir_new<0) dir_new=3;
    } else 
    if (player.orden=="gira_der") {
        dir_new=dir+1; if (dir_new>3) dir_new=0;
    } else
    if (player.orden=="adelante") {
        if (player.dir=="N") vy=-1; else if (player.dir=="S") vy=1; else
        if (player.dir=="E") vx=1; else if (player.dir=="W") vx=-1;
    } else 
    if (player.orden=="atras") {
        if (player.dir=="N") vy=1; else if (player.dir=="S") vy=-1; else
        if (player.dir=="E") vx=-1; else if (player.dir=="W") vx=1;
    } else        
    if (player.orden=="desplaza_izq") {
        if (player.dir=="N") vx=-1; else if (player.dir=="S") vx=1; else
        if (player.dir=="E") vy=-1; else if (player.dir=="W") vy=1;
    }
    else if (player.orden=="desplaza_der") {
        if (player.dir=="N") vx=1; else if (player.dir=="S") vx=-1; else
        if (player.dir=="E") vy=1; else if (player.dir=="W") vy=-1;
    }	

    // Si hay intención de movimiento y no hay obstáculo a donde el PJ quiere ir
    if (!(vy==0 && vx==0) && hayObstaculo(player.y,player.x,player.y+vy,player.x+vx)==false) {
        player.y+=vy;player.x+=vx;
        
        change=true;
    }
    // Si hay intención de cambio de dirección
    if (dir_new!=dir) {
        player.dir=ruleta[dir_new];
        
        change=true;
    }
    player.orden="";
    
    if (change==true){
        if ((hay_texto==true || info>0)){
            if (player.conversando!=-99) {
                pnj[player.conversando].stop=false; // El PNJ ya no se detiene
                player.conversando=-99;
            }
            $("#elementosdiv").html("");
            info=0;hay_texto==false;
            
        }    
        
    }
   
    return change;
}

function ciclo(){
    // GESTIÓN DEL PJ
    
    var change;
    change=gestionPJ();
    
    // GESTIÓN DE LOS PNJs
    tiempo.ciclos++;	
    if (tiempo.ciclos==100) {
        //pasaTiempo();
        gestionPNJ();
        change=true;
        tiempo.ciclos=0;
    }
    
    if (change) {
        
        if (leyendo==false) dibujaEscenario();
    
        
    }
    
    if (info>0) {
        info--;
        if (info<=0) {
            $("#elementosdiv").html("");
            
            
            info=0
        }
    }

    if (FIN==0) setTimeout("ciclo();",20);//window.requestAnimFrame(ciclo);
    
}


function evaluaMovimiento (oldY,oldX,newY,newX){
    var mov={}
    var quehay=hayObstaculo(Math.floor(oldY),Math.floor(oldX),newY,newX);
    
    if (quehay==false) {
        mov={x:newX,y:newY};
    } else {
        mov={x:oldX,y:oldY}
    }
    
    return mov;
}
function hayObstaculo(oldY,oldX,newY,newX){
    // Se revisa que el PJ/PNJ no pueda pasar por encima de un PNJ
    for (var i=0;i<pnj.length;i++)
        if (pnj[i].x==newX && pnj[i].y==newY && pnj[i].activo==true) return true; 
    
    // Se revisa que el PNJ no pueda pasar por encima de un PJ
    if (player.x==newX && player.y==newY) return true; 
    
    // Comprobación de que el PJ/PNJ se quiere mover a una casilla que existe. Necesario para que nunca de error.
    if (newY>=mapa.length || newY<0) return true;
    if (typeof(mapa[newY])=="undefined") return true;
    if (newX>=mapa[newY].length || newX<0) return true;
    
    // Se comprueba si se quiere atravesar algún muro o algún contenido situado enfrente del personaje que se permite atravesar.
    var codigo,codigo1;
    
    if (newY>oldY) {codigo='S';codigo1='N';}
    else if (newY<oldY) {codigo='N';codigo1='S';}
    else if (newX>oldX) {codigo='E';codigo1='W';}
    else if (newX<oldX) {codigo='W';codigo1='E';}	
    
    var sePuede=[      // Sitios que se pueden atravesar
        "pta0", // puerta abierta
        "lam" //lampara
    ];
    if ( sePuede.indexOf(queHay(oldY,oldX,codigo))!=-1 || sePuede.indexOf(queHay(newY,newX,codigo1))!=-1 || sePuede.indexOf(queHay(newY,newX,"C"))!=-1) return false;
    
    // Si hay contenido en la casilla a la que se quiere ir, no se puede pasar
    if ( queHay(newY,newX,'C')!='0' ) return true;
    
    // Si no se identifica ningún obstáculo entonces se puede pasar.
    if ( queHay(oldY,oldX,codigo)=='0' && queHay(newY,newX,codigo1)=='0' ) return false;
    
    // Si existe algún caso no verificado se impide el paso.
    return true;
}

function pasaTiempo(){
    tiempo.minuto+=10;
        
    if (tiempo.minuto>=60) {tiempo.hora++;tiempo.minuto=tiempo.minuto-60;}
    if (tiempo.hora>=24) {tiempo.dia++;tiempo.hora=0;}
    
    var minuto=tiempo.minuto;
    if (minuto==0) minuto="00";
    $("#tiempo").html("Dia "+tiempo.dia+"<br/>"+tiempo.hora+" : "+minuto);

}

function tocaTecla(valor){
    if (leyendo==true) return;
    switch (valor){
        case 38:case 87: player.orden="adelante"; break;  // cursor arriba, tecla 'w'
        case 40:case 83: player.orden="atras";    break;  // cursor abajo, tecla 's'
        case 37:case 65: player.orden="gira_izq"; break;  // cursor izquierda, tecla 'q'
        case 39:case 68: player.orden="gira_der"; break;  // cursor abajo, tecla 'e'
        case 81: player.orden="desplaza_izq";     break;  // tecla 'a'
        case 69: player.orden="desplaza_der";     break;  // tecla 'd'
    }
}

function start(){
	
    // evitar el arrastre de imagenes 
    $("div").mousedown(function(){
        return false;
    });
    $("button").mousedown(function(){
        return false;
    });	
    
    // 
    
    iniciarVariables();    	
    iniciarBotones();
    pantalla();
    $(window).resize(function() {pantalla();});

    dibujaEscenario();
    
    ciclo();
}
function mostrarInfo(txt){
    if (hay_texto==true) $("#infoMsg").remove();
    $("#elementosdiv").append("<div id='infoMsg' >"+txt+"</div>");
    hay_texto=true;
    info=200;
}
function conversacionPNJ(numPnj){
    
    pnj[numPnj].stop=true; // El PNJ se detiene
    pnj[numPnj].dir=player.dir1; // El PNJ se gira hacia nosotros
    
    if (player.conversando>=0) $("#bocadillo").remove();
    player.conversando=numPnj;
    
    if (typeof(pnj[numPnj].frases)!="undefined") msj=pnj[numPnj].frases[Math.floor(Math.random()*pnj[numPnj].frases.length)];
    else msj="No tengo nada que comentar";
    
    $('#elementosdiv').append("<div id='bocadillo'><div>"+msj+"</div></div>");
    info=300;hay_texto=true;
    

}

function evaluaClicks(pointerY,pointerX){
    // SI SE PINCHA EN LA ZONA DEL MURO DE ENFRENTE
    if (pointerX>escenario.width*0.20 && pointerX<escenario.width*0.8 && pointerY>escenario.height*0.11 && pointerY<escenario.height*0.75) {

        var delante={};
        if (player.dir=="E") { delante.x=player.x+1;delante.y=player.y;	} else 
        if (player.dir=="W") { delante.x=player.x-1;delante.y=player.y;	} else
        if (player.dir=="N") { delante.x=player.x;delante.y=player.y-1;	} else
        if (player.dir=="S") { delante.x=player.x;delante.y=player.y+1;	}
        
        var cosa=queHay(player.y,player.x,player.dir),
            cosa1=queHay(delante.y,delante.x,player.dir1);
        
        // INTERACCIÓN CON PUERTAS
        var change=false;
        if (cosa=="pta1") {mapa[player.y][player.x][player.dir]="pta0";change=true;} else
            if (cosa=="pta0") {mapa[player.y][player.x][player.dir]="pta1";change=true; }        
        if (cosa1=="pta1") {mapa[delante.y][delante.x][player.dir1]="pta0";change=true;} else
            if (cosa1=="pta0") {mapa[delante.y][delante.x][player.dir1]="pta1";change=true; }
        
        if (change==true){
            dibujaEscenario();return;
        }
        // INTERACCIÓN CON MUROS O CONTENIDO PARA OBTENER INFORMACIÓN
        if (cosa!=0)
            if (typeof(imagenes[cosa].info)!="undefined") { // del muro de enfrente
                mostrarInfo(imagenes[cosa].info); return;
            } 
        if (queHay(delante.y,delante.x,"C")!=0)
            if (typeof(imagenes[queHay(delante.y,delante.x,"C")].info)!="undefined") { // del contenido de enfrente
                    mostrarInfo(imagenes[queHay(delante.y,delante.x,"C")].info); return;
            }
            
        // ALGUN PNJ DELANTE        
        for (var i=0;i<pnj.length;i++){
            if (pnj[i].y==delante.y && pnj[i].x==delante.x && pnj[i].activo==true) {
                conversacionPNJ(i);
                return;
            }
        }
            
    }
    // SI SE PINCHA EN LA ZONA DEL SUELO
    else if (pointerX>=escenario.width*0.2 && pointerX<=escenario.width*0.8 && pointerY>=escenario.height*0.75) {
        if (player.objeto!=-99) { // Si el PJ tiene algún objeto en las manos, entonces se deja
            objeto[player.objeto].x=player.x;objeto[player.objeto].y=player.y;
            player.objeto=-99;
            document.getElementById("objeto_manos").getContext("2d").clearRect(0,0,100,100);
            $("#objeto").css("display","none");
            dibujaEscenario();
        } else // Si no lo tiene, entonces se coge
            for (var i=0; i<objeto.length; i++) {
                if (objeto[i].x==player.x && objeto[i].y==player.y) {
                    objeto[i].y=objeto[i].x=-99;    // Se quitas el objeto del suelo
                    player.objeto=i;                // Se pone en las manos del PJ
                    $("#objeto").css("display","block");
                    document.getElementById("objeto_manos").getContext("2d").drawImage(
                        hojaImagenes,imagenes[objeto[i].image].x,imagenes[objeto[i].image].y,
                        SPRITESIZE,SPRITESIZE,0,0,100,100);
                    
                    $("#objeto_accion").html(objeto[i].accion);
                    dibujaEscenario();
                    break;
                }
            }
    }

}

function leerLibro(){
    hay_texto=true;
    $("#elementosdiv").html("");
    var texto=  "<div id='lecturalibro' >"+
    "<table class='entero'>"+  
        "<tr><td  style='height:100%;position:relative;'>"+
            "<div class='entero wrap-texto'>"+objeto[player.objeto].texto+"</div>"+
        "</td></tr>"+
        "<tr><td style='height:5%;text-align:center'><br><div id='lecturalibro-OK' class='wrap-textoOK'><b>OK</b></div></td></tr>"+
    "</table>"+
    "</div>";
    leyendo=true;
    $("body").append(texto);
    $("#lecturalibro-OK").on("click",function(ev){        
        $("#lecturalibro").remove();
        setTimeout(function(){leyendo=false;},1000);
    });    
    
}


function pantalla(tipo){
    
    if (tipo==true) $("#elementosdiv").css("display","none");
    
    // SE OBTIENE LAS DIMENSIONES DE LA PANTALLA: ANCHURA Y LA ALTURA
    if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth ) {
        screen.anchura = document.documentElement.offsetWidth;
        screen.altura = document.documentElement.offsetHeight;
    }
    if (document.body && document.body.offsetWidth) {
        screen.anchura = document.body.offsetWidth;
        screen.altura = document.body.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        screen.anchura = window.innerWidth;
        screen.altura = window.innerHeight;
    }
    
    // ESTABLECER ANCHURA Y ALTURA DEL ESCENARIO, EN FUNCIÓN DE QUE SE ESTÉ UTILIZANDO EL TOUCHPAD O NO
    escenario.height=screen.altura*escenario.proporcionAltura;escenario.width=screen.anchura;    
    document.getElementById('canvas').height=document.getElementById('escenario').height=escenario.height;
    document.getElementById('canvas').width=document.getElementById('escenario').width=escenario.width;

    minimapa.sizeCas=Math.min(escenario.height,escenario.width)*0.04;
    // ESTABLECER ANCHURA Y ALTURA DEL MINIMAPA
    document.getElementById('minimapa').height=minimapa.sizeCas*minimapa.sizeDis;
    document.getElementById('minimapa').width=minimapa.sizeCas*minimapa.sizeDis;
    $("#escenario").css({"width":escenario.width,"height":escenario.height});
    
    // ESTABLECER POSICIÓN, ANCHURA Y ALTURA DEL TOUCHPAD
    $("#touchpad").css({"top":escenario.height,"width":escenario.width,"height":screen.altura-escenario.height});
    dibujaEscenario();
    
    setTimeout(function(){$("#elementosdiv").css("display","");},2000);

}


function iniciarBotones(){

    document.onkeydown=function(e){//alert((e||window.event).keyCode);
            tocaTecla((e||window.event).keyCode);
    }

    $("#presentacion-OK").click(function(evento){
        leyendo=false;
        $("#presentacion").remove();
    });
    
    $("#boton_minimapa").click(function(evento){
        if (leyendo==true) return;
        if ($("#minimapa").css("display")!="none") {$("#minimapa").css("display","none");} else {$("#minimapa").css("display","");}
    });
    
    $("#boton_touchpad").click(function(evento){
        if (leyendo==true) return;
        if ($("#touchpad").length!=0) {$("#touchpad").remove();escenario.proporcionAltura=1;pantalla();} else {escenario.proporcionAltura=0.8;dibujaTouchpad();pantalla();}
    });

    $('#escenario').on("click",function(ev){
        if (leyendo==true) return;
        ev.preventDefault();
        evaluaClicks(ev.pageY,ev.pageX);
    });
    
  
    $("#objeto_accion").on("click",function(){
        if (leyendo==true) return;
        if (objeto[player.objeto].accion=="leer") leerLibro();
    });

}
function dibujaTouchpad(){ 
      var botones=[
        {"top":10,"left":40,"img":"arrow_up","key":38},
	{"top":60,"left":40,"img":"arrow_down","key":40},
	{"top":60,"left":10,"img":"arrow_turnleft","key":37},
        {"top":60,"left":70,"img":"arrow_turnright","key":39},
	{"top":10,"left":10,"img":"arrow_left","key":81},	
	{"top":10,"left":70,"img":"arrow_right","key":69}	
      ];

      $("body").append("<div id='touchpad' style='position:absolute;top:"+escenario.height+"px;left:0;width:"+escenario.width+"px;height:"+(screen.altura-escenario.height)+"px'></div>");
      
      $("#touchpad").append("<canvas id='touchpad-fondo' width=100 height=100 class='entero'></canvas>");
      document.getElementById("touchpad-fondo").getContext("2d").drawImage(hojaImagenes,imagenes['touchpad'].x,imagenes['touchpad'].y,SPRITESIZE,SPRITESIZE, 0, 0, 100,100);
      
      for (var i=0; i<botones.length; i++) {
	  $("#touchpad").append("<canvas id='touchpad_"+botones[i].key+"' width=100 height=100 style='border:5px black solid;position:absolute;top:"+botones[i].top+"%;left:"+botones[i].left+"%;width:20%;height:30%'></canvas>");
	  document.getElementById("touchpad_"+botones[i].key).getContext("2d").drawImage(hojaImagenes,imagenes[botones[i].img].x,imagenes[botones[i].img].y,SPRITESIZE,SPRITESIZE, 0, 0,100,100);

      }
    
      $("[id^='touchpad_']").click(function(evento){
            tocaTecla(parseInt(this.id.split("_")[1]), 1);
      });
}

$(window).load(function() {

    $.ajaxSetup({cache: false});  

    $.ajax({
        url: "mapa.json",
        async: false,
        dataType: "json",
        success: function(data){
            mapa = data;
        }
    });
    libros={};
    for (var i=1;i<=2;i++)
    $.ajax({
        url: "libros/libro"+i+".txt",
        async: false,
        dataType: "text",
        success: function(data){
            
            libros["libro"+i] = data.replace(/\r\n|\r|\n/g,"<br>");
            
            
        }
    });
    $.ajax({
        url: "imagenes.json",
        async: false,
        dataType: "json",
        success: function(data){
            imagenes = data;
            imagenes["econo3"].info="In front of you is the portrait of the economist John Maynard Keynes, founder of Keynesianism as an economic ideology.";
            imagenes["econo2"].info="In front of you is the portrait of Karl Marx.";
            imagenes["econo1"].info="In front of you is the portrait of the economist Adam Smith, founder of liberalism as an economic ideology.";
            imagenes["econo4"].info="In front of you is the portrait of the economist Milton Friedman, founder of monestarism as an economic ideology.";
            imagenes["29"].info="A library with very interesting books to read.";
            imagenes["miguelangel"].info="The statue 'David' by Michelangelo.";
            imagenes["22"].info="The painting 'The Scream' by Edvard Munch.";
            imagenes["23"].info="Van Gogh's painting 'The Starry Night'.";
            
            imagenes["sphe1"].info="A strange green sphere, opaque and motionless, made of strange materials.";
            imagenes["sphere"].info="A strange transparent and motionless sphere, made of strange materials.";
            imagenes["pozo"].info="Here is a well...";
        }
    });
    
    // Carga de la hoja de imágenes
    hojaImagenes=new Image(); 
    hojaImagenes.addEventListener("load", start);
    hojaImagenes.src="spritesheet.png?s="+new Date().getTime();	
    
});
