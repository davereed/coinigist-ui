<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row justify-content-md-center" v-if="!my_channel.length">
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
            <h4>Market Updates <small class="text-muted float-right"><input type="checkbox" id="checkbox" v-model="updateSounds"> play sounds</small></h4>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Coin Pairing</th>
                  <th scope="col">Percentage</th>
                  <th scope="col">Sellers</th>
                  <th scope="col">Market</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in my_channel.slice().reverse()" v-bind:key="msg.i" v-if="msg.update">
                  <td>{{ msg.update.date }}</td>
                  <td><a target="_blank" :href="msg.update.binanceUrl">{{ msg.update.coin }}</a></td>
                  <td>{{ msg.update.percentage }}</td>
                  <td class="text-capitalize">{{ msg.update.party }}</td>
                  <td class="text-capitalize">{{ msg.update.market }}</td>
                  <td><a target="_blank" :href="msg.update.tradingViewUrl"><img src="../assets/tradingview-logo.png" /></a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col">
            <h4>Alerts <small class="text-muted float-right"><input type="checkbox" id="checkbox" v-model="alertSounds"> play sounds</small></h4>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Coin Pairing</th>
                  <th scope="col">Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in my_channel.slice().reverse()" v-bind:key="msg.i" v-if="msg.alert">
                  <td>{{ msg.alert.date }}</td>
                  <td><a target="_blank" :href="msg.alert.binanceUrl">{{ msg.alert.coin }}</a></td>
                  <td>{{ msg.alert.price }}</td>
                  <td><a target="_blank" :href="msg.alert.tradingViewUrl"><img src="../assets/tradingview-logo.png" /></a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'home',
  data() {
    return {
      updateSounds: false,
      alertSounds: true,
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
      const binanceUrl = `https://www.binance.com/en/trade/${coin}_${pairing}`;
      const tradingViewUrl = `https://www.tradingview.com/symbols/${coin}${pairing}`;
      if (messageObject[2] === 'ALERT') {
        if (this.alertSounds) {
          const audio = new Audio('https://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        msg.alert = {
          date: formattedDate,
          coin: coin + '/' + pairing,
          price: messageObject[5],
          binanceUrl,
          tradingViewUrl,
        };
      } else {
        if (this.updateSounds) {
          const audio = new Audio('https://soundbible.com/mp3/Tick-DeepFrozenApps-397275646.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        const partyRegEx = /(sellers|buyers)(\:)([a-zA-Z0-9]+)(\,)/gm;
        const partyParts = partyRegEx.exec(messageObject[9]);
        const marketRegEx = /(mkt)(\:)([a-zA-Z0-9]+)(\))/gm;
        const marketParts = marketRegEx.exec(messageObject[10]);
        msg.update = {
          date: formattedDate,
          coin: coin + '/' + pairing,
          percentage: messageObject[6],
          party: partyParts[3] ? partyParts[3] : '',
          market: marketParts[3] ? marketParts[3] : '',
          binanceUrl,
          tradingViewUrl,
        };
      }
    },
  },
  mounted() {
    this.$pnSubscribe({ channels: ['my_channel'], withPresence: true });
  },
};
</script>
