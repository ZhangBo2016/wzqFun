<template>
  <div>
    <h2></h2>
    <chess ref="chess"></chess>
    <div class="operating-panel">
      <p id="model">
        <a id="replay_btn" class="btn selected" href="#">新 局</a>
        <a id="withAI_btn" class="btn" href="#">悔棋</a>
      </p>
      <p>
        <a id="black_btn" class="btn selected" href="#">黑 方</a>
        <a id="white_btn" class="btn" href="#">白 方</a>
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
                })
        })
      },
     methods: {
          initOperationPanel: function(){
                const self = this;
                const black_btn = {
                    execute: function(){
                       const chessEntity = self.$refs.chess;
                       chessEntity.players = ["player", "player"];
                    }
                };
                const white_btn = {
                    execute: function(){
                       const chessEntity = self.$refs.chess;
                       chessEntity.players = ["player", "player"];
                    }
                };
                const withPersons_btn = {
                    execute: function(){

                    }
                };
                const withAI_btn = {
                    execute: function(){

                    }
                };
                const replay_btn = {
                    execute: function(){
                       const chessEntity = self.$refs.chess;
                       chessEntity.players = ["player", "player"];
                       chessEntity.gameStart()
                    }
                };
                const map = {
                    black_btn: black_btn,
                    white_btn: white_btn,
                    withPersons_btn: withPersons_btn,
                    withAI_btn:withAI_btn,
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



