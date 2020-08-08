//象棋設定頭
var itemHead = [
    ['0', '車'],
    ['1', '馬'],
    ['2', '象'],
    ['3', '士'],
    ['4', '包'],
    ['5', '卒'],
    ['6', '將'],
    ['7', '俥'],
    ['8', '傌'],
    ['9', '相'],
    ['10', '仕'],
    ['11', '炮'],
    ['12', '兵'],
    ['13', '帥']
];
//象棋設定每種象棋數量
var itemQuant = ['2', '2', '2', '2', '2', '5', '1', '2', '2', '2', '2', '2', '5', '1'];

//象棋物件設定身
var itemBody = [ //字,顏色,移動類型,能力,狀態
['0', 'black', '1', '1', 'close'],
    ['1', 'black', '2', '2', 'close'],
    ['2', 'black', '3', '3', 'close'],
    ['3', 'black', '4', '4', 'close'],
    ['4', 'black', '5', '5', 'close'],
    ['5', 'black', '6', '6', 'close'],
    ['6', 'black', '7', '7', 'close'],
    ['7', 'red', '1', '1', 'close'],
    ['8', 'red', '2', '2', 'close'],
    ['9', 'red', '3', '3', 'close'],
    ['10', 'red', '4', '4', 'close'],
    ['11', 'red', '5', '5', 'close'],
    ['12', 'red', '6', '6', 'close'],
    ['13', 'red', '7', '7', 'close'], ];
//物件狀態類別 close,open,dead
var statusType = [
    'close', 'open', 'select', 'dead'];

var status_close = statusType[0];
var status_open = statusType[1];
var status_select = statusType[2];
var status_dead = statusType[3];
var CAR = 1;
var HORSE = 2;
var ELEPHANT = 3;
var KNIGHT = 4;
var FIRE = 5;
var SOILDER = 6;
var GENERAL = 7;
var REDFIRST = 0;
var BLACKLAST = 1;

var playfirst = REDFIRST;

//物件排列(用於洗牌)
var AllItem = new Array();

//全部象棋物件
var Item = new Array();

//選擇物件
var selectItem = new Array();
Init();
//初始化
function Init() {
    createTable();
    InitItem();
    addAllItem();
    divClick();
}

//建立棋盤
function createTable() {
    var str = '';
    for (i = 0; i < 4; i++) {
        str += '<tr class="tableB">';
        for (j = 0; j < 8; j++) {
            str += '<td class="borderShow">'
            str += '<div class="play_space" id="space' + i + j + '">';
        }
    }
    var table = $("<table>").html(
    str);
    $("center").append(table);
}

//棋子物件初始化
function InitItem() {
    for (i = 0, k = 0; i < 14; i++) {
        var x = itemQuant[i];
        for (j = 0; j < x; j++) {
            AllItem[k] = itemBody[i];
            k++;
        }
    }
    randomAllItem();
    createItem();
}

//洗牌
function randomAllItem() {
    for (i = 0; i < 32; i++) {
        var index = random();
        var tmp = AllItem[index];
        AllItem[index] = AllItem[i];
        AllItem[i] = tmp;
    }
}
//建立象棋
function createItem() {
    for (i = 0, k = 0; i < 4; i++) {
        for (j = 0; j < 8; j++) {
            var color = 'color:' + AllItem[k][1];
            var item = $("<div>").attr({
                'class': 'circle'
            })
            item.attr('style', color);
            var input = $("<input>").attr({
                'type': 'hidden',
                    'value': 'itemIn_' + i + '_' + j + ',' + AllItem[k],
                    'id': 'itemIn_' + i + '_' + j
            })
            var font = $("<center>");
            var textSize = $("<h1>");
            var span = $('<span style="display:none">');
            var text = itemHead[AllItem[k][0]][1];
            span.append(text);
            span.append(input);
            font.append(span);
            textSize.append(font);
            item.append(textSize);
            Item[k] = $(item);
            k++;
        }
    }
}

//隨機數字1-32
function random() {
    var value = Math.floor(Math.random() * (32));
    return value;
}

//放入棋子
function addAllItem() {
    for (i = 0, k = 0; i < 4; i++) {
        for (j = 0; j < 8; j++) {
            var space = '#space' + i + j;
            $(space).append(Item[k]);
            k++;
        }
    }
}

//click listener
function divClick() {
    $(".play_space").unbind('click').click(function () {
        //單顆象棋內容
        var soloItem;
        //單顆象棋物件外殼;
        var soloItemParent;
        //單顆象棋物件
        var soloItemAll = new Array();
        soloItem = $(this).children().children().children().children().children();
        soloItemParent = $(this).children();
        $(this).css('background', 'BLUE');
        var itemDetail = soloItem.val().split(",");
        soloItemAll[0] = itemDetail[0];
        soloItemAll[1] = itemDetail[1];
        soloItemAll[2] = itemDetail[2];
        soloItemAll[3] = itemDetail[3];
        soloItemAll[4] = itemDetail[4];
        soloItemAll[5] = itemDetail[5];
        soloItemAll[6] = soloItemParent;
        soloItemAll[7] = soloItem;
        checkItemStatus(soloItemAll);
    });
}

//確認狀態
function checkItemStatus(item) {
    var itemStatus = item[5];
    if (status_close == itemStatus) {
        openItem(item);
        item[6].parent().css('background', '');
        resetSelectItem();
    } else if (status_open == itemStatus) {
        if (selectItem.length == 0) {
            selectOne(item);
        } else if (selectItem.length == 1) {
            selectTwo(item);
            if (checkItemLevel() && checkItemMoveRole()) {
                setItemDead(item);
                move();
            } else {
                item[6].parent().css('background', '');
                resetSelectItem();
            }
        } else {
            item[6].parent().css('background', '');
            resetSelectItem();
            selectOne(item);
        }
    } else if (status_select == itemStatus) {
        item[6].parent().css('background', '');
        resetSelectItem();
    } else if (status_dead == itemStatus) {
        if (selectItem.length == 1) {
            selectTwo(item);
            if (checkItemMoveRole()) {
                move();
            } else {
                item[6].parent().css('background', '');
                resetSelectItem();
            }
        } else {
            item[6].parent().css('background', '');
            resetSelectItem();
        }
    }
}

//改變棋子狀態
function changeItemStatus(item, status) {
    var str = '';
    for (i = 0; i < item.length - 3; i++) {
        str += item[i] + ",";
    }
    str += status;
    item[5] = status;
    item[7].val(str);
}

//翻牌
function openItem(item) {
    if (!isItemDead(item)) {
        changeItemStatus(item, status_open);
    }
    item[6].attr('class', 'circleBlack');
    item[7].parent().attr('style', '');
}
//選取
function selectOne(item) {
    if (!isItemDead(item)) {
        changeItemStatus(item, status_select);
    }
    selectItem[0] = item;
}
//選取第二個
function selectTwo(item) {
    if (!isItemDead(item)) {
        changeItemStatus(item, status_select);
    }
    selectItem[1] = item;
}
//重設選取物件
function resetSelectItem() {
    var item1 = selectItem[0];
    var item2 = selectItem[1];
    if (item1 != null) {
        if (!isItemDead(item1)) {
            changeItemStatus(item1, status_open);
        }
        item1[6].parent().css('background', '');
    }
    if (item2 != null) {
        if (!isItemDead(item2)) {
            changeItemStatus(item2, status_open);
        }
        item2[6].parent().css('background', '');
    }
    selectItem = new Array();
}
//確認物件是否死亡狀態
function isItemDead(item) {
    if (item[5] == status_dead) {
        return true;
    }
    return false;
}
//更改物件為死亡狀態				
function setItemDead(item) {
    changeItemStatus(item, status_dead);
    item[6].attr('class', 'circleHidden');
    item[7].parent().attr('style', 'display:none');
}

//移動
function move() {
    var item1 = selectItem[0];
    var item2 = selectItem[1];
    var id1 = item1[0].split(',')[0];
    var id2 = item2[0].split(',')[0];
    var firstDiv = item1[6].parent().parent();
    var secondDiv = item2[6].parent().parent();
    item1[6].parent().css('background', '');
    item2[6].parent().css('background', '');
    resetSelectItem();
    changeItemId(item1, id2);
    changeItemId(item2, id1);
    var temp;
    temp = firstDiv.html();
    firstDiv.html(secondDiv.html());
    secondDiv.html(temp);
    divClick();
}
//變更物件ID
function changeItemId(item, id) {
    var str = '';
    str += id;
    for (i = 1; i < item.length - 2; i++) {
        str += "," + item[i];
    }

    item[0] = id;
    item[7].val(str);
    item[7].attr('id', id);
}

//物件等級規則
function checkItemLevel() {
    var item1 = selectItem[0];
    var item2 = selectItem[1];
    var item1Level = item1[4];
    var item2Level = item2[4];
    if (item1[2] == item2[2]) {
        return false;
    }
    if (item1Level == CAR) {
        if (item2Level == CAR || item2Level == HORSE || item2Level == FIRE || item2Level == SOILDER) {
            return true;
        }
    } else if (item1Level == HORSE) {
        if (item2Level == HORSE || item2Level == FIRE || item2Level == SOILDER) {
            return true
        }
    } else if (item1Level == ELEPHANT) {
        if (item2Level != KNIGHT && item2Level != GENERAL) {
            return true;
        }
    } else if (item1Level == KNIGHT) {
        if (item2Level != GENERAL) {
            return true;
        }
    } else if (item1Level == FIRE) {
        return true;
    } else if (item1Level == SOILDER) {
        if (item2Level == GENERAL || item2Level == SOILDER) {
            return true;
        }
    } else if (item1Level == GENERAL) {
        if (item2Level != SOILDER) {
            return true;
        }
    }
    return false;
}

//物件移動規則
function checkItemMoveRole() {
    var item1Level = selectItem[0][3];
    var item2Level = selectItem[1][3];
    if (item1Level == CAR) {
        return checkItemLocation(1);
    } else if (item1Level == HORSE) {
        return checkItemLocation(1);
    } else if (item1Level == ELEPHANT) {
        return checkItemLocation(1);
    } else if (item1Level == KNIGHT) {
        return checkItemLocation(1);
    } else if (item1Level == FIRE) {
        return checkItemFire(1);
    } else if (item1Level == SOILDER) {
        return checkItemLocation(1);
    } else if (item1Level == GENERAL) {
        return checkItemLocation(1);
    }
    return false;
}
//確認物件位置是否可以移動
function checkItemLocation(move) {
    var item1 = selectItem[0];
    var item2 = selectItem[1];
    var y1 = item1[0].split('_')[1];
    var x1 = item1[0].split('_')[2];
    var y2 = item2[0].split('_')[1];
    var x2 = item2[0].split('_')[2];
    var xMove = Math.abs(x2 - x1);
    var yMove = Math.abs(y2 - y1);
    if (y2 < 0 || y2 > 3 || x2 < 0 || x2 > 7) {
        return false;
    }
    if (xMove == move && yMove == move) {
        return false;
    }
    if (xMove > move || yMove > move) {
        return false;
    }
    return true;
}

//確認物件包位置是否可以移動
function checkItemFire(move) {
    var item1 = selectItem[0];
    var item2 = selectItem[1];
    var y1 = item1[0].split('_')[1];
    var x1 = item1[0].split('_')[2];
    var y2 = item2[0].split('_')[1];
    var x2 = item2[0].split('_')[2];
    var xMove = Math.abs(x2 - x1);
    var yMove = Math.abs(y2 - y1);
    if (y2 < 0 || y2 > 3 || x2 < 0 || x2 > 7) {
        return false;
    }
    if (xMove == move && yMove == move) {
        return false;
    }
    if (item2[5] != status_dead) {
        if (xMove == 0) {
            if ((y2 - y1) < 0) {
                var count = 0;
                for (i = 0, j = (parseInt(y1) - 1); i < yMove - 1; i++) {
                    var space = '#itemIn' + '_' + j + '_' + x1;
                    var status = $(space).val().split(',')[5]
                    if (status != status_dead) {
                        count++;
                    }
                    j--;
                }
                if (count == 1) {
                    return true;
                }
            } else {
                var count = 0;
                for (i = 0, j = (parseInt(y1) + 1); i < yMove - 1; i++) {
                    var space = '#itemIn' + '_' + j + '_' + x1;
                    var status = $(space).val().split(',')[5]
                    if (status != status_dead) {
                        count++;
                    }
                    j++;
                }
                if (count == 1) {
                    return true;
                }
            }
        } else if (yMove == 0) {
            if ((x2 - x1) < 0) {
                var count = 0;
                for (i = 0, j = (parseInt(x1) - 1); i < xMove - 1; i++) {
                    var space = '#itemIn' + '_' + y1 + '_' + j;
                    var status = $(space).val().split(',')[5]
                    if (status != status_dead) {
                        count++;
                    }
                    j--;
                }
                if (count == 1) {
                    return true;
                }
            } else {
                var count = 0;
                for (i = 0, j = (parseInt(x1) + 1); i < xMove - 1; i++) {
                    var space = '#itemIn' + '_' + y1 + '_' + j;
                    var status = $(space).val().split(',')[5]
                    if (status != status_dead) {
                        count++;
                    }
                    j++;
                }
                if (count == 1) {
                    return true;
                }
            }
        }
        return false;
    }
    if (xMove > move || yMove > move) {
        return false;
    }
    return true;
}
