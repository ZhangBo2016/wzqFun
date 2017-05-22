<template>
  <div>
    <h2></h2>
    <chess ref="chess"></chess>
    <div class="operating-panel">
      <p id="model">
        <a id="replay_btn" class="btn" href="#">新 局</a>
        <a id="prev_btn" class="btn" href="#">悔棋</a>
      </p>
      <!--<p>-->
        <!--<a id="black_btn" class="btn" href="#">黑 方</a>-->
        <!--<a id="white_btn" class="btn" href="#">白 方</a>-->
      <!--</p>-->
      <p>
        <a id="persons" class="btn" href="#">人 人</a>
        <a id="playWithAI" class="btn selected" href="#">人 机</a>
      </p>
        <p id="result_tips"></p>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import chess from './components/chess.vue';

  export default {
     components: {
          chess
      },
     mounted: function(){
        this.$nextTick(function(){
                const self = this;
                $(".operating-panel a").click(function (event) {
                    event.preventDefault();
                    const id = $(this).attr("id");
                    const menu_Command = self.initOperationPanel();
                    menu_Command(id);
                    $(this).addClass("selected").siblings().removeClass("selected");
                })
        })
      },
     methods: {
          initOperationPanel: function(){
                const self = this;
                const chessEntity = self.$refs.chess;

                const black_btn = {
                    execute: function(){
                       // chessEntity.players = ["player", "player"];
                    }
                };
                const white_btn = {
                    execute: function(){
                       // chessEntity.players = ["player", "player"];
                    }
                };
                const persons = {
                    execute: function(){
                        chessEntity.players = ["player", "player"];
                    }
                };
                const playWithAI = {
                    execute: function(){
                      chessEntity.players = ["AI", "player"];
                    }
                };

                const replay_btn = {
                    ready: function(){ //策略模式
                        const strategy = {
                            players: function (dom) {
                               debugger
                            }
                        }
                        const menuHandler = function(){
                            this.cache = []
                        };
                        const menu = new menuHandler();
                        menuHandler.add(dom, "players")
                        menuHandler.prototype.add = function(dom, behave){

                        }
                        menuHandler.prototype.start = function(){

                        }
                    },
                    execute: function(){

                       chessEntity.gameStart()
                    }
                };
                const map = {
                    black_btn: black_btn,
                    white_btn: white_btn,
                    persons: persons,
                    playWithAI:playWithAI,
                    replay_btn:replay_btn
                };

               return (function (id) {
                      const receiver = map[id];
                      receiver.execute()
                })
          }
     }
  };
</script>

<style lang="scss">
  .operating-panel {
    left: 800px;
    position: absolute;
    top: 100px;
    a {
      display: inline-block;
      padding: 10px 15px;
      margin-bottom: 39px;
      margin-right: 8px;
      margin-left: 8px;
      background: rgb(100, 167, 233);
      text-decoration: none;
      color: #333;
      font-weight: bold;
      font-size: 16px;
      font-family: "微软雅黑", "宋体";
    }

    .a:hover {
      background: rgb(48, 148, 247);
      text-decoration: none;
    }

    a.disable, a.disable:hover {
      cursor: default;
      background: rgb(197, 203, 209);
      color: rgb(130, 139, 148);
    }

    a.selected {
      border: 5px solid #F3C242;
      padding: 5px 10px;
    }
  }
</style>



