
import Vue from 'vue';
import App from './app';
import $ from 'jquery';

window.$ = $;

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App)
});
