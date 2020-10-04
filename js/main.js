/** chines chess
*	Author:	fdipzone
*	Date:	2012-06-24
*	Ver:	1.0
*/
/* field chess
* this code will be modifed to field chess 
*/

var gameimg = ['images/r1.gif', 'images/r2.gif', 'images/r3.gif', 'images/r4.gif', 'images/r5.gif', 'images/r6.gif', 'images/r7.gif', 'images/b1.gif', 'images/b2.gif', 'images/b3.gif', 'images/b4.gif', 'images/b5.gif', 'images/b6.gif', 'images/b7.gif', 'images/bg.gif', 'images/bg_over.gif', 'images/bg_sel.gif'];
var chess_obj = new ChessClass();

window.onload = function() {
    $('init_btn').onclick = function() {
        chess_obj.init();
    }
    var callback = function() {
        chess_obj.init();
    }
    img_preload(gameimg, callback);
}

// chess class constructure
function ChessClass() { //in javascript, function is an object
    this.chess = [];
    this.boardrows = 4;
    this.boardcols = 8;
    this.area = 82;
    this.player = 1; // 1:red 2:green
    this.selected = null; // selected chess
    this.chesstype = ['', 'r', 'b']; //use this.player to indicate current player. if this.player==1, then current chesstype[1] is 'r'
    this.isover = 0;
    this.firstMove = 1; //firstMove==1 means first player is not define yet. if firstMove==0, assign current player to this player.
}

// init
ChessClass.prototype.init = function() {
    this.reset_grade();
    this.create_board();
    this.create_chess();
    this.showAll();
    this.resetPlayer();
    this.create_event();
    this.player = 1;
    this.selected = null;
    this.isover = 0;
    disp('init_div', 'hide');
}
ChessClass.prototype.resetPlayer = function() {
        $('grade_img1').className = 'img';
        $('grade_img2').className = 'img';
}
// create board and fill chess background
ChessClass.prototype.create_board = function() {
    var board = '';
    // for (var i = 0; i < this.boardrows; i++) {
    //     for (var j = 0; j < this.boardcols; j++) {
    //         if ((i == 1 || i == 2) && (j == 3 || j == 4)) {
    //             board = board + '<div id="' + i + '_' + j + '"><img src="images/bg.gif" /></div>';
    //         } else {
    //             board = board + '<div id="' + i + '_' + j + '"><img src="images/chessbg.gif" /></div>';
    //         }
    //     }
    // }
    for (var i = 0; i < this.boardrows; i++) {
        for (var j = 0; j < this.boardcols; j++) {
            board = board + '<div id="' + i + '_' + j + '"><img src="" /></div>';
        }
    }
    $('board').innerHTML = board;
    $('board').style.width = this.boardcols * (this.area + 2) + 'px';
    $('board').style.height = this.boardrows * (this.area + 2) + 'px';
}
//flip all chess to show all 
ChessClass.prototype.showAll = function () {
    var chess = this.chess;
    for (var i = 0, max = chess.length; i < max; i++) {
        //if (i != 11 && i != 12 && i != 19 && i != 20) {
        
            var index = i;
            if(this.chess[index].status==-1){ //empty
                $(this.getid(index)).innerHTML = '<img src="images/bg.gif" />';
            }else{
                $(this.getid(index)).innerHTML = '<img src="images/' + this.chess[index]['chess'] + '.gif" />';
                this.chess[index]['status'] = 1;
            }
            
            // opened
            if (this.selected != null) {
                // 清空選中
                $(this.getid(this.selected.index)).className = '';
                this.selected = null;
            }
        //}

    }
}

// create random chess
ChessClass.prototype.create_chess = function() {
    // 32 chesses
    var chesses = ['r1', 'r2', 'r2', 'r3', 'r3', 'r4', 'r4', 'r5', 'r5', 'r6', 'r6', 'r7', 'r7', 'r7', 'b1', 'b2', 'b2', 'b3', 'b3', 'b4', 'b5', 'b5', 'b5', 'b6', 'b6', 'b7', 'b7', 'b7'];
    this.chess = [];
    while (chesses.length > 0) {
        var rnd = Math.floor(Math.random() * chesses.length);
        var tmpchess = chesses.splice(rnd, 1).toString();
        //random pick one chess
        this.chess.push({
            'chess': tmpchess,
            'type': tmpchess.substr(0, 1),
            'val': tmpchess.substr(1, 1),
            'status': 0 //status: 0:covered, 1:uncovered, -1: empty
        });
    }
    //insert empty chess
    this.chess.splice(11, 0, {
        'chess': '',
        'type': '',
        'val': '',
        'status': -1
    }, {
        'chess': '',
        'type': '',
        'val': '',
        'status': -1
    });
    this.chess.splice(19, 0, {
        'chess': '',
        'type': '',
        'val': '',
        'status': -1
    }, {
        'chess': '',
        'type': '',
        'val': '',
        'status': -1
    });
    //console.log(this.chess);
}

// create event
ChessClass.prototype.create_event = function() {
    var self = this;
    var chess_area = $_tag('div', 'board');
    for (var i = 0; i < chess_area.length; i++) {
        chess_area[i].onmouseover = function() {
            // mouseover
            if (this.className != 'onsel') {
                this.className = 'on';
            }
        }
        chess_area[i].onmouseout = function() {
            // mouseout
            if (this.className != 'onsel') {
                this.className = '';
            }
        }
        chess_area[i].onclick = function() {
            // onclick
            self.onClick(this);
        }
    }
}

// id change index
ChessClass.prototype.getindex = function(id) {
    var tid = id.split('_');
    return parseInt(tid[0]) * this.boardcols + parseInt(tid[1]);
}

// index change id
ChessClass.prototype.getid = function(index) {
    return parseInt(index / this.boardcols) + '_' + parseInt(index % this.boardcols);
}

// action 點選棋子 查看動作
ChessClass.prototype.onClick = function(o) {
    if (this.isover == 1) {
        // game over
        return false;
    }

    var index = this.getindex(o.id);

    // 未選過棋子
    if (this.selected == null) {
        if (this.chess[index]['status'] == 0) {
            // not opened
            this.show(index);
        } else if (this.chess[index]['status'] == 1) {
            // opened, check is this chess belong the current player. will modify it to field chess.
            if (this.chess[index]['type'] == this.chesstype[this.player] || this.firstMove==1) {
                this.select(index);
            }
        }
    } else {
        // 已选过棋子
        if (index != this.selected.index) {
            // 與selected不是同一位置
            if (this.chess[index]['status'] == 0) {
                // 未打开的棋子
                this.show(index);
            } else if (this.chess[index]['status'] == -1) {
                // 點空白位置
                this.move(index);
            } else {
                // 點其他棋子
                if (this.chess[index]['type'] == this.chesstype[this.player]) {
                    this.select(index);
                } else {
                    this.kill(index);
                }
            }
        }
        else if(this.firstMove==1){ //selected the same chess, if firstMove==1, can cancel this selection
            //this.className = '';
            $(this.getid(this.selected['index'])).className = '';
            this.selected=null;
        } 
    }
}

// show chess
ChessClass.prototype.show = function(index) {
    $(this.getid(index)).innerHTML = '<img src="images/' + this.chess[index]['chess'] + '.gif" />';
    this.chess[index]['status'] = 1;
    // opened
    if (this.selected != null) {
        // 清空選中
        $(this.getid(this.selected.index)).className = '';
        this.selected = null;
    }
    this.change_player();
    this.gameover();
}

// select chess
ChessClass.prototype.select = function(index) {
    if (this.selected != null) {
        $(this.getid(this.selected['index'])).className = '';
    }
    this.selected = {
        'index': index,
        'chess': this.chess[index]
    };
    $(this.getid(index)).className = 'onsel';
    this.player=this.chess[index]['type']=='r'? 1:2;
}
//code here
// move chess 只單純移動棋子，不吃子
ChessClass.prototype.move = function(index) {
    if (this.isMovementLegal(index)) {
        this.chess[index] = {
            'chess': this.selected['chess']['chess'],
            'type': this.selected['chess']['type'],
            'val': this.selected['chess']['val'],
            'status': this.selected['chess']['status']
        };
        this.remove(this.selected['index']);
        this.show(index);
        this.firstMove=0; //remove firstMove
    }
}
// code here
// kill chess 已點到敵方棋子，檢查是否可吃子
ChessClass.prototype.kill = function(toIndex) {
    //if (this.isKillLegal(index, this.selindex) == true && this.can_kill(index) == true) {
    if (this.isKillLegal(this.selindex,toIndex) == true) {
        this.chess[toIndex] = {
            'chess': this.selected['chess']['chess'],
            'type': this.selected['chess']['type'],
            'val': this.selected['chess']['val'],
            'status': this.selected['chess']['status']
        };
        this.remove(this.selected['index']);
        var killed = this.player == 1 ? 2 : 1;
        $('grade_num' + killed).innerHTML = parseInt($('grade_num' + killed).innerHTML) - 1;
        this.show(toIndex);
        this.firstMove=0;
    }
}

// remove chess
ChessClass.prototype.remove = function(index) {
    this.chess[index]['status'] = -1;
    // empty
    $(this.getid(index)).innerHTML = '';
    $(this.getid(index)).className = '';
}

/* check is beside
* @param index		目標棋子index
* @param selindex	执行的棋子index，可为空, 为空则读取选中的棋子
*/
ChessClass.prototype.isMovementLegal = function(index, selindex) {
    if (typeof (selindex) == 'undefined') {
        if (this.selected != null) {
            selindex = this.selected['index'];
        } else {
            return false;
        }
    }

    if (typeof (this.chess[index]) == 'undefined') {
        return false;
    }
    
    var from_info = this.getid(selindex).split('_');
    var to_info = this.getid(index).split('_');
    var fromRow = parseInt(from_info[0]);
    var fromColumn = parseInt(from_info[1]);
    var toRow = parseInt(to_info[0]);
    var toColumn = parseInt(to_info[1]);
    var rowVector = toRow-fromRow;
    var colVector= toColumn-fromColumn;

    switch (parseInt(this.chess[selindex]['val'])) {
        case 1: //Generals
        case 2: //Advisor
        case 3: //Elephant
        case 4: //Chariot
        case 6: //Cannon
        case 7: //Soldier
            if ((Math.abs(rowVector)+Math.abs(colVector))==1) {
                return true;
            } else {
                return false;
            }
            break;
        case 5: //Horse
            return this.checkHorseMovement(selindex, index);
            break;
    }
}
ChessClass.prototype.isKillLegal = function(fromIndex, toIndex) {
    if (typeof (fromIndex) == 'undefined') {
        if (this.selected != null) {
            fromIndex = this.selected['index'];
        } else {
            return false;
        }
    }

    if (typeof (this.chess[toIndex]) == 'undefined') {
        return false;
    }
    
    // var from_info = this.getid(fromIndex).split('_');
    // var to_info = this.getid(toIndex).split('_');
    // var fromRow = parseInt(from_info[0]);
    // var fromColumn = parseInt(from_info[1]);
    // var toRow = parseInt(to_info[0]);
    // var toColumn = parseInt(to_info[1]);
    // var rowVector = toRow-fromRow;
    // var colVector= toColumn-fromColumn;
    var fromIndexVal = parseInt(this.chess[fromIndex]['val']);
    switch(fromIndexVal){
        case 1: //Generals
        case 2: //Advisor
        case 3: //Elephant
        case 7: //Soldier
            if (this.IsHorizontalVerticalMove(fromIndex, toIndex)==true && this.InterDistance(fromIndex, toIndex)==1) {
                // row or colunm is same and interval=1
                return this.normalKill(fromIndex, toIndex);
            } else {
                return false;
            }
            break;
        case 4: //Chariot
            return this.checkChariotKillMovement(fromIndex,toIndex);
        case 5: //Horse
            return this.checkHorseMovement(fromIndex,toIndex); 
            break;
        case 6: //Cannon
            return this.checkCannonKillMovement(fromIndex, toIndex); 
            break;
    }
    return false;

}
ChessClass.prototype.checkCannonKillMovement=function(fromIndex,toIndex){
    if(this.IsHorizontalVerticalMove(fromIndex, toIndex)==false) return false;
    if(this.InterCount(fromIndex, toIndex)==1){ //there is only one chess between these two chesses
        return true; //can kill anyway
    }
    return false;
}

ChessClass.prototype.checkChariotKillMovement=function(fromIndex,toIndex){
    if(this.IsHorizontalVerticalMove(fromIndex, toIndex)==false) return false;
    //check inter distance
    if(this.InterDistance(fromIndex, toIndex)==1){
        return this.normalKill(fromIndex, toIndex);//NormalKill
    }
    if(this.InterCount(fromIndex, toIndex)==0){ //there is no other chesses between these two chess
        return true; //can kill anyway
    }
    return false;
    

}
ChessClass.prototype.InterCount=function(fromIndex,toIndex){
    var fromRowCol = this.getRowCol(fromIndex);
    var toRowCol = this.getRowCol(toIndex);
    var increment;
    var result = 0;
    var currentIndex = fromIndex;

    //search from column
    var hDiff = toRowCol[1] - fromRowCol[1];
    if (hDiff != 0) {
        increment = hDiff / Math.abs(hDiff);
        while (this.getRowCol(currentIndex)[1] != this.getRowCol(toIndex)[1]) {
            currentIndex += increment;
            if (this.chess[currentIndex].status == 1) {
                result++;
            }
        }
    }
    //then search from row
    var vDiff = toRowCol[0] - fromRowCol[0];
    if (vDiff != 0) {
        increment = vDiff / Math.abs(vDiff);
        while (this.getRowCol(currentIndex)[0] != this.getRowCol(toIndex)[0]) {
            currentIndex += increment * this.boardcols;
            if (this.chess[currentIndex].status == 1) {
                result++;
            }
        }
    }
    return result-1;
}
ChessClass.prototype.InterDistance=function(fromIndex,toIndex){
    var fromRowCol = this.getRowCol(fromIndex);
    var toRowCol = this.getRowCol(toIndex);
    return Math.abs(fromRowCol[0] - toRowCol[0]) + Math.abs(fromRowCol[1] - toRowCol[1])
}
ChessClass.prototype.IsHorizontalVerticalMove=function(fromIndex,toIndex){
    var fromRowCol = this.getRowCol(fromIndex);
    var toRowCol = this.getRowCol(toIndex);
    if ((fromRowCol[0] - toRowCol[0]) != 0 && (fromRowCol[1] - toRowCol[1]) != 0) {
        return false;
    }
    return true;
}
ChessClass.prototype.checkHorseMovement=function(fromIndex, toIndex){
    if(this.InterDistance(fromIndex,toIndex)!=2){return false;}
    if(this.IsHorizontalVerticalMove(fromIndex,toIndex)==true){return false;}
    return true;
}

/* check can kill
* @param index		被消灭的棋子index
* @param selindex	执行消灭的棋子index，可为空, 为空则读取选中的棋子
*/
ChessClass.prototype.can_kill = function(index, selindex) {
    //define 
    if (typeof (selindex) == 'undefined') {
        // 没有指定执行消灭的棋子
        if (this.selected != null) {
            // 有选中的棋子
            selindex = this.selected['index'];
        } else {
            return false;
        }
    }
    return this.normalKill(index, selindex);
}
ChessClass.prototype.normalKill = function(fromIndex,toIndex) {
    if (this.chess[toIndex]['type'] != this.chesstype[this.player]) {
        var fromChessVal = parseInt(this.chess[fromIndex]['val']);
        var toChessVal = parseInt(this.chess[toIndex]['val']);
        switch(fromChessVal){
            case 1: //Generals
                if(toChessVal==7){return false;}
                return true;
                break;
            case 2: //Advisor
            case 3: //Elephant
            case 4: //Chariot
                if(fromChessVal<=toChessVal){return true;}
                return false;
                break;
            case 5: //Horse
            case 6: //Cannon
                return false;
                break;
            case 7: //Soldier
                if(toChessVal==1 || toChessVal==7){return true;}
                return false;
                break;
        }
    }
    return false;
}

// change player
ChessClass.prototype.change_player = function() {
    if (this.player == 1) {
        this.player = 2;
        // to green
        $('grade_img2').className = 'img_on';
        $('grade_img1').className = 'img';
    } else {
        this.player = 1;
        // to red
        $('grade_img1').className = 'img_on';
        $('grade_img2').className = 'img';
    }
}

// reset grade
ChessClass.prototype.reset_grade = function() {
    $('grade_img1').className = 'img_on';
    $('grade_img2').className = 'img';
    $('grade_num1').innerHTML = $('grade_num2').innerHTML = 14;
    $('grade_res1').className = $('grade_res2').className = 'none';
    $('grade_res1').innerHTML = $('grade_res2').innerHTML = '';
}

// game over
ChessClass.prototype.gameover = function() {
    if ($('grade_num1').innerHTML == 0 || $('grade_num2').innerHTML == 0) {
        // 任一方棋子为0
        this.isover = 1;
        this.show_grade();
        disp('init_div', 'show');
    } else {
        if (this.isAnyChessCanAction() == false) {
            this.isover = 1;
            this.show_grade();
            disp('init_div', 'show');
        }
    }
}

// show grade
ChessClass.prototype.show_grade = function() {
    var num1 = parseInt($('grade_num1').innerHTML);
    var num2 = parseInt($('grade_num2').innerHTML);
    if (num1 > num2) {
        // 红方胜
        $('grade_res2').innerHTML = 'LOSS';
        $('grade_res2').className = 'loss';
        $('grade_res1').innerHTML = 'WIN';
        $('grade_res1').className = 'win';
    } else if (num1 < num2) {
        // 黑方胜
        $('grade_res1').innerHTML = 'LOSS';
        $('grade_res1').className = 'loss';
        $('grade_res2').innerHTML = 'WIN';
        $('grade_res2').className = 'win';
    } else {
        // 平局
        $('grade_res1').innerHTML = $('grade_res2').innerHTML = 'DRAW';
        $('grade_res1').className = $('grade_res2').className = 'draw';
    }
}

// check chess can action
ChessClass.prototype.isAnyChessCanAction = function() {
    var chess = this.chess;
    for (var i = 0, max = chess.length; i < max; i++) {
        if (chess[i].status == 0) {
            // 有未翻开的棋子
            return true;
        } else {
            if (chess[i].status == 1 && chess[i].type == this.chesstype[this.player]) {
                // 己方已翻开的棋子
                if (this.isMovementLegal(i - this.boardcols, i) && (chess[i - this.boardcols].status == -1 || this.can_kill(i - this.boardcols, i))) {
                    // 上
                    return true;
                }
                if (this.isMovementLegal(i + this.boardcols, i) && (chess[i + this.boardcols].status == -1 || this.can_kill(i + this.boardcols, i))) {
                    // 下
                    return true;
                }
                if (this.isMovementLegal(i - 1, i) && (chess[i - 1].status == -1 || this.can_kill(i - 1, i))) {
                    // 左
                    return true;
                }
                if (this.isMovementLegal(i + 1, i) && (chess[i + 1].status == -1 || this.can_kill(i + 1, i))) {
                    // 右
                    return true;
                }
            }
        }
    }
    return false;
}
ChessClass.prototype.getRowCol = function(index) {
    return this.getid(index).split('_');
}

/** common function */

// get document.getElementBy(id)
function $(id) {
    this.id = id;
    return document.getElementById(id);
}

// get document.getElementsByTagName
function $_tag(name, id) {
    if (typeof (id) != 'undefined') {
        return $(id).getElementsByTagName(name);
    } else {
        return document.getElementsByTagName(name);
    }
}

/* div show and hide
* @param id dom id
* @param handle show or hide
*/
function disp(id, handle) {
    if (handle == 'show') {
        $(id).style.display = 'block';
    } else {
        $(id).style.display = 'none';
    }
}

/* img preload
* @param img		要加载的图片数组
* @param callback	图片加载成功后回调方法
*/
function img_preload(img, callback) {
    var onload_img = 0;
    var tmp_img = [];
    for (var i = 0, imgnum = img.length; i < imgnum; i++) {
        tmp_img[i] = new Image();
        tmp_img[i].src = img[i];
        if (tmp_img[i].complete) {
            onload_img++;
        } else {
            tmp_img[i].onload = function() {
                onload_img++;
            }
        }
    }
    var et = setInterval(function() {
        if (onload_img == img.length) {
            // 定时器,判断图片完全加载后调用callback
            clearInterval(et);
            callback();
        }
    }, 200);
}

console.log(chess_obj);