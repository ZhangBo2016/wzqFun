/**
 * Created by 24960 on 2017/5/14.
 */
$(document).ready(function() {
    fiveChess.init();
});

var fiveChess = (function () {
    var NO_CHESS = 0,
        BLACK_CHESS = -1,
        WHITE_CHESS = 1,
        chessArr = [],	//记录棋子
        isPlayWithAI= false,
        chessBoardHtml = "",
        LEFT = "black",
        RIGHT = "white"
    humanPlayer = LEFT,	//玩家棋子颜色
        AIPlayer = RIGHT,	//AI棋子颜色
        isPlayerTurn = true, //轮到player下棋
        totalGames = 0,	//总局数
        winGames =  0,	//玩家赢局数
        isGameStart = false,	//游戏已经开始
        isGameOver = false, //游戏结束
        playerLastChess = [], //玩家最后下子位置
        AILastChess = []//AI最后下子位置

    //重置棋盘
    var resetChessBoard = function () {
        $("div.chessboard").html(chessBoardHtml);
        $("#result_tips").html("");
        isGameOver = false;
        isPlayerTurn = $("#first_move_btn").hasClass("selected");
        //初始化棋子状态
        var i, j;
        for (i = 0; i < 15; i++) {
            chessArr[i] = [];
            for (j = 0; j < 15; j++) {
                chessArr[i][j] = NO_CHESS;
            }
        }
        //player下棋事件
        $("div.chessboard div").click(function () {
            if (isPlayWithAI && (!isPlayerTurn || isGameOver)) {
                return;
            }else if(!isPlayWithAI && isGameOver){
                isPlayerTurn = !isPlayerTurn
            }
            if (!isGameStart) {
                gameStart();
            }
            var index = $(this).index(),
                i = index / 15 | 0,
                j = index % 15;
            if (chessArr[i][j] === NO_CHESS) {
                playChess(i, j, humanPlayer);

                if (i === 0 && j === 0) {
                    $(this).removeClass("hover-up-left");
                }
                else if (i === 0 && j === 14) {
                    $(this).removeClass("hover-up-right");
                }
                else if (i === 14 && j === 0) {
                    $(this).removeClass("hover-down-left");
                }
                else if (i === 14 && j === 14) {
                    $(this).removeClass("hover-down-right");
                }
                else if (i === 0) {
                    $(this).removeClass("hover-up");
                }
                else if (i === 14) {
                    $(this).removeClass("hover-down");
                }
                else if (j === 0) {
                    $(this).removeClass("hover-left");
                }
                else if (j === 14) {
                    $(this).removeClass("hover-right");
                }
                else {
                    $(this).removeClass("hover");
                }
                playerLastChess = [i, j];
                playerWinOrNot(i, j);
                //可通过【中介者模式】统一管理 人机或人人对战 业务代码
                if(!isPlayWithAI)  humanPlayer == LEFT? humanPlayer = RIGHT : humanPlayer = LEFT;
            }
        });
        //鼠标在棋盘上移动效果
        $("div.chessboard div").hover(
            function () {
                if (!isPlayerTurn || isGameOver) { return; }
                var index = $(this).index(),
                    i = index / 15 | 0,
                    j = index % 15;
                if (chessArr[i][j] === NO_CHESS) {
                    if (i === 0 && j === 0) {
                        $(this).addClass("hover-up-left");
                    }
                    else if (i === 0 && j === 14) {
                        $(this).addClass("hover-up-right");
                    }
                    else if (i === 14 && j === 0) {
                        $(this).addClass("hover-down-left");
                    }
                    else if (i === 14 && j === 14) {
                        $(this).addClass("hover-down-right");
                    }
                    else if (i === 0) {
                        $(this).addClass("hover-up");
                    }
                    else if (i === 14) {
                        $(this).addClass("hover-down");
                    }
                    else if (j === 0) {
                        $(this).addClass("hover-left");
                    }
                    else if (j === 14) {
                        $(this).addClass("hover-right");
                    }
                    else {
                        $(this).addClass("hover");
                    }
                }
            },
            function () {
                if (!isPlayerTurn || isGameOver) { return; }
                var index = $(this).index(),
                    i = index / 15 | 0,
                    j = index % 15;
                if (i === 0 && j === 0) {
                    $(this).removeClass("hover-up-left");
                }
                else if (i === 0 && j === 14) {
                    $(this).removeClass("hover-up-right");
                }
                else if (i === 14 && j === 0) {
                    $(this).removeClass("hover-down-left");
                }
                else if (i === 14 && j === 14) {
                    $(this).removeClass("hover-down-right");
                }
                else if (i === 0) {
                    $(this).removeClass("hover-up");
                }
                else if (i === 14) {
                    $(this).removeClass("hover-down");
                }
                else if (j === 0) {
                    $(this).removeClass("hover-left");
                }
                else if (j === 14) {
                    $(this).removeClass("hover-right");
                }
                else {
                    $(this).removeClass("hover");
                }
            }
        )
    };

    var gameStart = function () {
        totalGames++;
        //AI先手
        if (!isPlayerTurn && isPlayWithAI) {
            AImoveChess();
        }

        isGameStart = true;
        $(".operating-panel p a").addClass("disable");
        $("#replay_btn").html("重&nbsp;&nbsp;&nbsp;玩");
    };

    var gameOver = function () {
        isGameStart = false;
        $(".operating-panel a").removeClass("disable");
        $("#replay_btn").html("开&nbsp;&nbsp;&nbsp;始");
    };

    //下棋 i行，j列，color颜色
    var playChess = function (i, j, color) {
        chessArr[i][j] = color === LEFT ? BLACK_CHESS : WHITE_CHESS;
        if (color === AIPlayer && isPlayWithAI) {
            $("div.chessboard div." + color + "-last").addClass(color).removeClass(color + "-last");
            $("div.chessboard div:eq(" + (i * 15 + j) + ")").addClass(color + "-last");
        }
        else {
            $("div.chessboard div:eq(" + (i * 15 + j) + ")").addClass(color);
        }
    };

    var playerWinOrNot = function (i, j) {
        var nums = 1,	//连续棋子个数
            chessColor = humanPlayer === LEFT ? BLACK_CHESS : WHITE_CHESS,
            m, n;
        //x方向
        for (m = j - 1; m >= 0; m--) {
            if (chessArr[i][m] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        for (m = j + 1; m < 15; m++) {
            if (chessArr[i][m] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            playerWin();
            return;
        }
        else {
            nums = 1;
        }
        //y方向
        for (m = i - 1; m >= 0; m--) {
            if (chessArr[m][j] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1; m < 15; m++) {
            if (chessArr[m][j] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            playerWin();
            return;
        }
        else {
            nums = 1;
        }
        //左斜方向
        for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
            if (chessArr[m][n] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
            if (chessArr[m][n] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            playerWin();
            return;
        }
        else {
            nums = 1;
        }
        //右斜方向
        for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
            if (chessArr[m][n] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
            if (chessArr[m][n] === chessColor) {
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            playerWin();
            return;
        }
        isPlayWithAI && AImoveChess();
    };

    var playerWin = function () {
        winGames++;
        showResult(true);
        gameOver();
    };

    var showResult = function(isPlayerWin) {
        if (isPlayerWin) {
            $("#result_tips").html("恭喜"+humanPlayer+"获胜！");
        }
        else {
            $("#result_tips").html("哈哈，你输咯！");
        }
        isGameOver = true;
        showWinChesses(isPlayerWin);
    };

    //标记显示获胜棋子
    var showWinChesses = function (isPlayerWin) {
        var nums = 1,	//连续棋子个数
            lineChess = [],	//连续棋子位置
            i,
            j,
            chessColor,
            m, n;
        if (isPlayerWin) {
            chessColor = humanPlayer == LEFT? BLACK_CHESS : WHITE_CHESS;
            i = playerLastChess[0];
            j = playerLastChess[1];
        }
        else {
            chessColor = AIPlayer === LEFT? BLACK_CHESS : WHITE_CHESS;
            i = AILastChess[0];
            j = AILastChess[1];
        }
        $("div.chessboard div." + AIPlayer + "-last").addClass(AIPlayer).removeClass(AIPlayer + "-last");
        //x方向
        lineChess[0] = [i];
        lineChess[1] = [j];
        for (m = j - 1; m >= 0; m--) {
            if (chessArr[i][m] === chessColor) {
                lineChess[0][nums] = i;
                lineChess[1][nums] = m;
                nums++;
            }
            else {
                break;
            }
        }
        for (m = j + 1; m < 15; m++) {
            if (chessArr[i][m] === chessColor) {
                lineChess[0][nums] = i;
                lineChess[1][nums] = m;
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            for (k = nums - 1; k >= 0; k--) {
                markChess(lineChess[0][k] * 15 + lineChess[1][k], isPlayerWin ? humanPlayer : AIPlayer);
            }
            return;
        }
        //y方向
        nums = 1;
        lineChess[0] = [i];
        lineChess[1] = [j];
        for (m = i - 1; m >= 0; m--) {
            if (chessArr[m][j] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = j;
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1; m < 15; m++) {
            if (chessArr[m][j] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = j;
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            for (k = nums - 1; k >= 0; k--) {
                markChess(lineChess[0][k] * 15 + lineChess[1][k], isPlayerWin ? humanPlayer : AIPlayer);
            }
            return;
        }
        //左斜方向
        nums = 1;
        lineChess[0] = [i];
        lineChess[1] = [j];
        for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
            if (chessArr[m][n] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = n;
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
            if (chessArr[m][n] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = n;
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            for (k = nums - 1; k >= 0; k--) {
                markChess(lineChess[0][k] * 15 + lineChess[1][k], isPlayerWin ? humanPlayer : AIPlayer);
            }
            return;
        }
        //右斜方向
        nums = 1;
        lineChess[0] = [i];
        lineChess[1] = [j];
        for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
            if (chessArr[m][n] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = n;
                nums++;
            }
            else {
                break;
            }
        }
        for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
            if (chessArr[m][n] === chessColor) {
                lineChess[0][nums] = m;
                lineChess[1][nums] = n;
                nums++;
            }
            else {
                break;
            }
        }
        if (nums >= 5) {
            for (k = nums - 1; k >= 0; k--) {
                markChess(lineChess[0][k] * 15 + lineChess[1][k], isPlayerWin ? humanPlayer : AIPlayer);
            }
        }
    };

    var markChess = function (pos, color) {
        $("div.chessboard div:eq(" + pos + ")").removeClass(color).addClass(color + "-last");
    };

    return {
        init: function() {
            chessBoardHtml = $("div.chessboard").html();

            var menu_Command = function (receiver) {
                return function(){
                    receiver.execute()
                }
            };
            var black_btn = {
                execute: function(){
                    humanPlayer = "black";
                }
            };
            var white_btn = {
                execute: function(){
                    humanPlayer = "white";
                }
            };
            var first_move_btn = {
                execute: function(){
                    isPlayerTurn = true;
                }
            };
            var second_move_btn = {
                execute: function(){
                    isPlayerTurn = false;
                }
            };
            var replay_btn = {
                execute: function(){
                    resetChessBoard();
                    if (isGameStart) {	//点重玩
                        gameOver();
                    }
                    else {	//点开始
                        gameStart();
                    }
                }
            };
            //右侧操作按钮
            $(".operating-panel a").click(function (event) {
                event.preventDefault();
                var id = $(this).attr("id");
                if (isGameStart && id !== "replay_btn" ) { return; }	//正在游戏 不操作
                menu_Command(id)();
                if (id !== "replay_btn") {
                    $(this).addClass("selected").siblings().removeClass("selected");
                }
            });

            resetChessBoard();
        }
    }
})()