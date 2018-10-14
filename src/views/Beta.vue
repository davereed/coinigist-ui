<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row justify-content-md-center" v-if="!showAlerts">
          <div class="col-6">
            <section class="jumbotron bg-dark text-white text-center py-4">
              <div class="container">
                <h3 class="jumbotron-heading">Waiting for price updates and alerts</h3>
                <p class="lead">Crypto price updates and alerts show up automatically, please be patient.</p>
              </div>
            </section>
          </div>
        </div>
        <div class="row" v-if="my_channel.length">
          <div class="col">
            <h4>Alerts <small class="text-muted float-right"><input type="checkbox" id="checkbox" v-model="alertSounds"> play sounds</small></h4>
            <Alert v-for="msg in my_channel.slice().reverse()" v-bind:key=msg.i :alert=msg v-if=msg.alert />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue';
import moment from 'moment';

export default {
  name: 'home',
  data() {
    return {
      updateSounds: false,
      alertSounds: true,
      showAlerts: false,
      my_channel: this.$pnGetMessage('my_channel', this.receptor),
    };
  },
  methods: {
    receptor(msg) {
      const messageObject = msg.message.split(' ');
      const formattedDate = moment(messageObject[0]).format('MMMM Do YYYY, h:mm:ss a');
      const coinRegex = /([a-zA-Z]{3,5})(btc|usdt|etc|bnb)/gmi;
      const coinParts = messageObject[3] ? coinRegex.exec(messageObject[3]) : {};
      const coin = coinParts[1] ? coinParts[1] : '';
      const pairing = coinParts[2] ? coinParts[2] : '';
      const tradingViewChart = `BINANCE:${coin}${pairing}`;
      const binanceUrl = `https://www.binance.com/en/trade/${coin}_${pairing}`;
      const tradingViewUrl = `https://www.tradingview.com/symbols/${coin}${pairing}`;
      if (messageObject[2] === 'ALERT') {
        this.showAlerts = true;
        if (this.alertSounds) {
          const audio = new Audio('https://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        msg.alert = {
          date: formattedDate,
          coin: coin + '/' + pairing,
          price: messageObject[5],
          chart: tradingViewChart,
          binanceUrl,
          tradingViewUrl,
          tradingViewId: 'tv-' + msg.i,
        };
      }
    },
  },
  mounted() {
    this.$pnSubscribe({ channels: ['my_channel'], withPresence: true });
  },
  components: {
    Alert,
  },
};
</script>
