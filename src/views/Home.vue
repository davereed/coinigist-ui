<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row justify-content-md-center" v-if="!alerts.length && !updates.length">
          <div class="col-6">
            <section class="jumbotron bg-dark text-white text-center py-4">
              <div class="container">
                <h3 class="jumbotron-heading">Waiting for price updates and alerts</h3>
                <p class="lead">Crypto price updates and alerts show up automatically, please be patient.</p>
              </div>
            </section>
          </div>
        </div>
        <div class="row" v-if="alerts.length || updates.length">
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
                <tr v-for="update in updates" :key="update.id">
                  <td>{{ update.date }}</td>
                  <td><a target="_blank" :href="update.binanceUrl">{{ update.coin }}/{{ update.pairing }}</a></td>
                  <td>{{ update.percentage }}</td>
                  <td class="text-capitalize">{{ update.sellers }}</td>
                  <td class="text-capitalize">{{ update.market }}</td>
                  <td><a target="_blank" :href="update.tradingViewUrl"><img src="../assets/tradingview-logo.png" /></a></td>
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
                <tr v-for="alert in alerts" :key="alert.id">
                  <td>{{ alert.date }}</td>
                  <td><a target="_blank" :href="alert.binanceUrl">{{ alert.coin }}/{{ alert.pairing }}</a></td>
                  <td>{{ alert.price }}</td>
                  <td><a target="_blank" :href="alert.tradingViewUrl"><img src="../assets/tradingview-logo.png" /></a></td>
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
      alerts: [],
      updates: [],
      my_channel: this.$pnGetMessage('my_channel', this.receptor),
    };
  },
  methods: {
    receptor(msg) {
      // Convert 17 digit timestamp to milliseconds
      const formattedDate = moment(msg.timetoken / 10000).format('MMMM Do YYYY, h:mm:ss a');
      const messageObject = msg.message;

      // Set coin info
      const coinRegex = /([a-zA-Z]{3,5})(btc|usdt|etc|bnb)/gmi;
      const exchangeSymbol = messageObject.symbol;
      const exchangeSymbolParts = coinRegex.exec(exchangeSymbol);
      const coin = exchangeSymbolParts[1];
      const pairing = exchangeSymbolParts[2];

      // Set variables
      const price = messageObject.latest_candle.price_close;
      const sellers = messageObject.sell_pressure;
      const market = messageObject.alt_mood;
      const percentage = messageObject.pct_str;

      // Create urls
      const binanceUrl = `https://www.binance.com/en/trade/${coin}_${pairing}`;
      const tradingViewUrl = `https://www.tradingview.com/symbols/${coin}${pairing}`;
      if (messageObject.msg_type === 'ALERT') {
        if (this.alertSounds) {
          const audio = new Audio('https://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        this.alerts.unshift({
          id: this.alerts.count,
          date: formattedDate,
          exchangeSymbol,
          coin,
          pairing,
          price,
          binanceUrl,
          tradingViewUrl,
        });
      } else if (messageObject.msg_type === 'UPDATE') {
        if (this.updateSounds) {
          const audio = new Audio('https://soundbible.com/mp3/Tick-DeepFrozenApps-397275646.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        this.updates.unshift({
          id: this.updates.count,
          date: formattedDate,
          exchangeSymbol,
          coin,
          pairing,
          percentage,
          sellers,
          market,
          binanceUrl,
          tradingViewUrl,
        });
      }
    },
  },
  mounted() {
    this.$pnSubscribe({ channels: ['my_channel'], withPresence: true });
  },
};
</script>
