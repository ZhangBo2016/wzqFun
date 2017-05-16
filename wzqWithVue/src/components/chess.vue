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
                chessArr: [], //¼ÇÂ¼Æå×Ó
                NO_CHESS: 0,
                BLACK_CHESS : -1,
                WHITE_CHESS : 1,
                LEFT : "black",
                currrentColor:"black",
                RIGHT : "white",
                isBlack: true,
                players: ["player", "player"],
                playDirector: null,
            }
        },
        mounted: function(){
            this.playDirector = this.playDirectorHandler();
            this.$nextTick(function(){
                this.startLoad();
            })
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
                }
                ;

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
                if (this.players[0] == "AI") {
                    // AImoveChess();
                    console.log("ai chess")
                }
                // $(".operating-panel p a").addClass("disable");
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

                if (this.chessArr[i][j] === this.NO_CHESS) {
                    this.hoverHandler(dom, "remove");
                    this.playDirector.receiverMessage("color");
                    this.playChess(i, j, this.currrentColor);
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
                    if(self.players.indexOf("AI") < 0 ){
                        self.currrentColor == self.LEFT ? self.currrentColor = self.RIGHT: self.currrentColor=self.LEFT;
                    }
                };

                const receiverMessage = function () {
                    const message = Array.prototype.shift.call(arguments);
                    operations[message].apply(this, arguments)
                };

                return {
                    receiverMessage: receiverMessage
                }
            },
            AIplay(){

            }
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
    /* Æå×Ó */
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