<template>
  <div>
    <h2>五子棋</h2>
    <div>
      <table>
        <tr v-for="n in 15" >
          <td v-for="n in 15"></td>
        </tr>
      </table>
      <table class="transparent" @click="play">
        <tr v-for="n in 16">
          <td v-for="n in 16"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
  export default {
    mounted: function(){
      this.$nextTick(function(){
        $("td").hover(
            function () {
               $(this).addClass("hover");
                },
            function () {
              $(this).removeClass("hover");
            }
        );
      })
    },
    methods: {
      play(e) {
          console.log($(e.target).index())
          console.log($(e.target).parent().index())
      }
    }
  };
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
/* 棋子 */
td.black {
  background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/black.png) no-repeat 4px 4px;
}

td.white {
  background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/white.png) no-repeat 4px 4px;
}

td.hover {
  background: url(http://sandbox.runjs.cn/uploads/rs/102/r2dy3tyw/hover.png) no-repeat 1px 1px;
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

