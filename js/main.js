this.board=function(name,width,height,rowBak,colBak){ /* 畫棋盤 */ 
 nameBak=name; 
 if("turnover"==name){row=8;col=8;}else if("gogame"==name){row=18;col=18;} 
 var aW=Math.floor(width/(col+2)),aH=Math.floor(height/(row+2)); 
 minL=(aW>aH?aH:aW)-4;// 這個減法很重要，否則填空時會把表格撐大
 var array=new Array("<div style=\"margin:"+minL+"px;\"> "+
 "<table border=1 cellspacing=0 width=\""+(aW*col)+"\" 
 height=\""+(aH*row)+"\">");
 for(var i=0;i<row;i++){ 
       array.push("<tr>"); 
       for(var j=0;j<col;j++){array.push("<td align=center>"+ 
 evt(i,j,minL,minL,aW*j+minL/2+8,aH*i+minL/2)+"</td>");} 
       if(nameBak!="four"&&nameBak!="turnover")/* 將事件添加到表格中 */ 
             array.push(evt(i,col,minL,minL,aW*col+minL/2+8,aH*i+minL/2)); 
             array.push("</tr>"); 
		 } 
	   if(nameBak!="four"&&nameBak!="turnover"){ 
           for(var j=0;j<=col;j++){ 
               array.push(evt(row,j,minL,minL,aW*j+minL/2+8,aH*row+minL/2)); 
               } 
           } 
 document.write(array.join("")+"</table></div>"); 
 setClick(row,col,minL,minL);/* 初始化事件 */ 
 start();/* 初始化棋子 */ 
}
