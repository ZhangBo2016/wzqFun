<template>
    <div>
        <table>
            <tr v-for="n in 15">
                <td v-for="n in 15"></td>
            </tr>
        </table>
        <table class="transparent" @click="play">
            <tr v-for="n in 15">
                <td v-for="n in 15"></td>
            </tr>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data:function(){
            return {
                posX: -1,
                posY: -1,
                chessArr: [], //棋盘15*15
                NO_CHESS: 0,
                BLACK_CHESS : -1,
                WHITE_CHESS : 1,
                currentColor:"black",
                RIGHT : "white",
                LEFT : "black",
                isBlack: true,
                isPlayerTurn: true,
                players: ["player", "player"],
                playDirector: null,
                isGameStart: false,
            }
        },
        mounted: function(){
            //中介者：职责 1.玩家轮换 2.
            this.playDirector = this.playDirectorHandler();
            this.$nextTick(function(){
                this.startLoad();
            })
        },
        computed: {
            recentColor: function(){
                return (this.currentColor == this.LEFT ? this.RIGHT: this.LEFT)
            },
        },
        methods: {
            setCurrentPos(td){
                this.posX = $(td).index();
                this.posY = $(td).parent().index();
            },
            startLoad(){
                const self = this;
                let i, j;
                for (i = 0; i < 15; i++) {
                    self.chessArr[i] = [];
                    for (j = 0; j < 15; j++) {
                        self.chessArr[i][j] = self.NO_CHESS;
                    }
                };

                $("td").hover(
                        function () {
                            self.hoverHandler(this, "add");
                        },
                        function () {
                            self.hoverHandler(this, "remove");
                        }
                );
            },
            gameStart () {
                this.isGameStart = true;
                if (this.players[0] == "AI") {
                    this.AImoveChess();
                }
            },
            hoverHandler(dom, behaveior){
                const i = $(dom).index(), j = $(dom).parent().index(),
                        flag = behaveior == "add";

                if (this.chessArr[i][j] === this.NO_CHESS) {
                    if (i === 0 && j === 0) {
                        flag ? $(dom).addClass("hover-up-left") : $(dom).removeClass("hover-up-left");
                    }
                    else if (i === 0 && j === 14) {
                        flag ? $(dom).addClass("hover-up-right") : $(dom).removeClass("hover-up-right");
                    }
                    else if (i === 14 && j === 0) {
                        flag ? $(dom).addClass("hover-down-left") : $(dom).removeClass("hover-down-left")
                    }
                    else if (i === 14 && j === 14) {
                        flag ? $(dom).addClass("hover-down-right") : $(dom).removeClass("hover-down-right");
                    }
                    else if (i === 0) {
                        flag ? $(dom).toggleClass("hover-up") : $(dom).removeClass("hover-up");
                    }
                    else if (i === 14) {
                        flag ? $(dom).toggleClass("hover-down") : $(dom).removeClass("hover-down");
                    }
                    else if (j === 0) {
                        flag ? $(dom).toggleClass("hover-left") : $(dom).removeClass("hover-left");
                    }
                    else if (j === 14) {
                        flag ? $(dom).toggleClass("hover-right") : $(dom).removeClass("hover-right");
                    }
                    else {
                        flag ? $(dom).toggleClass("hover") : $(dom).removeClass("hover");
                    }
                }
            },
            play(e) {
                const dom = e.target;
                const i = $(dom).index(), j = $(dom).parent().index();

                this.playDirector.receiverMessage("playerTurn") == "player" ? this.playerTurn = true : this.playerTurn = false;

                if (this.playerTurn && this.isGameStart && this.chessArr[i][j] === this.NO_CHESS) {
                    this.hoverHandler(dom, "remove");
                    const color = this.playDirector.receiverMessage("color");
                    this.playChess(i, j, color);
                    this.playerWinOrNot(i, j);
                    if(this.playDirector.receiverMessage("playerTurn") == "AI") this.AImoveChess()
                }
            },
            playChess(i, j, color){
                this.chessArr[i][j] = color === this.LEFT ? this.BLACK_CHESS : this.WHITE_CHESS;
                $("table.transparent tr:eq(" + j + ") td:eq(" + i + ")").addClass(color);
            },
            playDirectorHandler(){
                let operations = {};
                const self = this;
                operations.color = function () {
                    let rep = self.currentColor;
                    self.currentColor == self.LEFT ? self.currentColor = self.RIGHT: self.currentColor=self.LEFT;
                    return rep
                };

                operations.playerTurn = (function () {
                    let index = 0;
                    return (function () {
                        let rep = self.players[index];
                        index = (index+1)%2;
                        return rep
                    })
                })();

                const receiverMessage = function () {
                    const message = Array.prototype.shift.call(arguments);
                    return operations[message].apply(this, arguments)
                };

                return {
                    receiverMessage: receiverMessage
                }
            },
            AIplay(){

            },
            playerWinOrNot(i,j){
                let nums = 1, /*连续棋子个数*/
                    chessColor = this.recentColor == this.LEFT ? this.BLACK_CHESS: this.WHITE_CHESS, m, n; //currrentColor指下一次下棋的颜色
                //y方向
                debugger
                for (m = j - 1; m >= 0; m--) {
                    if (this.chessArr[i][m] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                for (m = j + 1; m < 15; m++) {
                    if (this.chessArr[i][m] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                if (nums >= 5) {
                    this.playerWin();
                    return;
                }
                else {
                    nums = 1;
                }
                //x方向
                for (m = i - 1; m >= 0; m--) {
                    if (this.chessArr[m][j] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                for (m = i + 1; m < 15; m++) {
                    if (this.chessArr[m][j] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                if (nums >= 5) {
                    this.playerWin();
                    return;
                }
                else {
                    nums = 1;
                }
                //左斜方向
                for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                if (nums >= 5) {
                    this.playerWin();
                    return;
                }
                else {
                    nums = 1;
                }
                //右斜方向
                for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        break;
                    }
                }
                if (nums >= 5) {
                    this.playerWin();
                    return;
                }
            },
            playerWin(){
                this.showResult();
            },
            showResult(){
                const p = this.recentColor = this.LEFT ? this.players[0] : this.player[1];
                $("#result_tips").html("恭喜"+ p +"获胜！");
            },
            gameOver () {
                this.isGameStart = false;
                $(".operating-panel a").removeClass("disable");
                $("#replay_btn").html("开&nbsp;&nbsp;&nbsp;始");
            },
            AImoveChess() {
                var maxX = 0,
                    maxY = 0,
                    maxWeight = 0,
                    i, j, tem;
                for (i = 14; i >= 0; i--) {
                    for (j = 14; j >= 0; j--) {
                        if (this.chessArr[i][j] !== this.NO_CHESS) {
                            continue;
                        }
                        tem = this.computeWeight(i, j);
                        if (tem > maxWeight) {
                            maxWeight = tem;
                            maxX = i;
                            maxY = j;
                        }
                    }
                };
                const color = this.playDirector.receiverMessage("color");
                this.playChess(maxX, maxY, color);
                if ((maxWeight >= 100000 && maxWeight < 250000) || (maxWeight >= 500000)) {
                    this.showResult();
                    this.gameOver();
                }
            },
            computeWeight(i, j) {
                var weight = 14 - (Math.abs(i - 7) + Math.abs(j - 7)), //基于棋盘位置权重
                    pointInfo = {},	//某点下子后连子信息
                    chessColor = this.currentColor == this.RIGHT ? this.BLACK_CHESS: this.WHITE_CHESS; //currrentColor指下一次下棋的颜色
                //x方向
                pointInfo = this.putDirectX(i, j, chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
                pointInfo = this.putDirectX(i, j, -chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
                //y方向
                pointInfo = this.putDirectY(i, j, chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
                pointInfo = this.putDirectY(i, j, -chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
                //左斜方向
                pointInfo = this.putDirectXY(i, j, chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
                pointInfo = this.putDirectXY(i, j, -chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
                //右斜方向
                pointInfo = this.putDirectYX(i, j, chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, true);//AI下子权重
                pointInfo = this.putDirectYX(i, j, -chessColor);
                weight += this.weightStatus(pointInfo.nums, pointInfo.side1, pointInfo.side2, false);//player下子权重
                return weight;
            },
            //权重方案   独：两边为空可下子，单：一边为空
            weightStatus(nums, side1, side2, isAI) {
                var weight = 0;
                switch (nums) {
                    case 1:
                        if (side1 && side2) {
                            weight = isAI ? 15 : 10;	//独一
                        }
                        break;
                    case 2:
                        if (side1 && side2) {
                            weight = isAI ? 100 : 50;	//独二
                        }
                        else if (side1 || side2) {
                            weight = isAI ? 10 : 5;	//单二
                        }
                        break;
                    case 3:
                        if (side1 && side2) {
                            weight = isAI ? 500 : 200;	//独三
                        }
                        else if (side1 || side2) {
                            weight = isAI ? 30 : 20;	//单三
                        }
                        break;
                    case 4:
                        if (side1 && side2) {
                            weight = isAI ? 5000 : 2000;	//独四
                        }
                        else if (side1 || side2) {
                            weight = isAI ? 400 : 100;	//单四
                        }
                        break;
                    case 5:
                        weight = isAI ? 100000 : 10000;	//五
                        break;
                    default:
                        weight = isAI ? 500000 : 250000;
                        break;
                }
                return weight;
            },
            //下子到i，j X方向 结果: 多少连子 两边是否截断
            putDirectX(i, j, chessColor) {
                var m, n,
                    nums = 1,
                    side1 = false,
                    side2 = false;
                for (m = j - 1; m >= 0; m--) {
                    if (this.chessArr[i][m] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[i][m] === this.NO_CHESS) {
                            side1 = true;
                        }
                        break;
                    }
                }
                for (m = j + 1; m < 15; m++) {
                    if (this.chessArr[i][m] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[i][m] === this.NO_CHESS) {
                            side2 = true;
                        }
                        break;
                    }
                }
                return {"nums": nums, "side1": side1, "side2": side2};
            },
            //下子到i，j Y方向 结果
            putDirectY(i, j, chessColor) {
                var m, n,
                        nums = 1,
                        side1 = false,
                        side2 = false;
                for (m = i - 1; m >= 0; m--) {
                    if (this.chessArr[m][j] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][j] === this.NO_CHESS) {
                            side1 = true;
                        }
                        break;
                    }
                }
                for (m = i + 1; m < 15; m++) {
                    if (this.chessArr[m][j] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][j] === this.NO_CHESS) {
                            side2 = true;
                        }
                        break;
                    }
                }
                return {"nums": nums, "side1": side1, "side2": side2};
            },
            //下子到i，j XY方向 结果
            putDirectXY(i, j, chessColor) {
                var m, n,
                        nums = 1,
                        side1 = false,
                        side2 = false;
                for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][n] === this.NO_CHESS) {
                            side1 = true;
                        }
                        break;
                    }
                }
                for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][n] === this.NO_CHESS) {
                            side2 = true;
                        }
                        break;
                    }
                }
                return {"nums": nums, "side1": side1, "side2": side2};
            },
            putDirectYX(i, j, chessColor) {
                var m, n,
                        nums = 1,
                        side1 = false,
                        side2 = false;
                for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][n] === this.NO_CHESS) {
                            side1 = true;
                        }
                        break;
                    }
                }
                for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
                    if (this.chessArr[m][n] === chessColor) {
                        nums++;
                    }
                    else {
                        if (this.chessArr[m][n] === this.NO_CHESS) {
                            side2 = true;
                        }
                        break;
                    }
                }
                return {"nums": nums, "side1": side1, "side2": side2};
            },
        }
    }
</script>

<style lang="scss">
    table:not(.transparent){
        border-right: 1px solid #804040;
        border-bottom: 1px solid #804040;
        border-collapse:collapse;
        position:absolute;
        top:100px;
        left:100px;
    td{
        width:40px;
        height:40px;
        border-left: 1px solid #804040;
        border-top: 1px solid #804040;
        background-color: #fafafa;
    }
    }
    table.transparent{
        position:absolute;
        top:80px;
        left:80px;
        z-index:1000;
        border-right: 1px solid transparent;
        border-bottom: 1px solid transparent;
        border-collapse:collapse;
    td{
        width:40px;
        height:40px;
        border-left: 1px solid transparent;
        border-top: 1px solid transparent;
    }
    }
    /* ���� */
    td.black {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/black.png) no-repeat 4px 4px;
    }

    td.white {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/white.png) no-repeat 4px 4px;
    }

    td.hover {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover.png) no-repeat 1px 1px ;
    }

    td.hover-up {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_up.png) no-repeat 1px 1px;
    }

    td.hover-down {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_down.png) no-repeat 1px 1px;
    }

    td.hover-up-left {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_up_left.png) no-repeat 1px 1px;
    }

    td.hover-up-right {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_up_right.png) no-repeat 1px 1px;
    }

    td.hover-left {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_left.png) no-repeat 1px 1px;
    }

    td.hover-right {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_right.png) no-repeat 1px 1px;
    }

    td.hover-down-left {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_down_left.png) no-repeat 1px 1px;
    }

    td.hover-down-right {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover_down_right.png) no-repeat 1px 1px;
    }

    td.white-last {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/white_last.png) no-repeat 4px 4px;
    }

    td.black-last {
        background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/black_last.png) no-repeat 4px 4px;
    }

</style>