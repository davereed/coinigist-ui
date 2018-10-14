<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row justify-content-center">
          <div class="col-8">
            <h3>Market Alerts <small class="text-muted float-right"><b-button :pressed.sync="alertSounds" variant="outline-primary" size="sm"><span v-show="alertSounds"><i class="fas fa-fw fa-volume"></i></span><span v-show="!alertSounds"><i class="fas fa-fw fa-volume-off"></i></span></b-button></small></h3>
            <Alert v-for="alert in alerts" v-bind:key=alert.id :alert=alert />
            <div class="row justify-content-md-center mt-4" v-if="!alerts.length">
              <div class="col-12">
                <section class="jumbotron bg-dark text-white text-center py-4">
                  <div class="container">
                    <h3 class="jumbotron-heading">Waiting for alerts</h3>
                    <p class="lead">Crypto price alerts show up automatically, please be patient.</p>
                  </div>
                </section>
              </div>
            </div>
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
      alerts: [],
      updates: [],
      my_channel: this.$pnGetMessage('my_channel', this.receptor),
    };
  },
  methods: {
    receptor(msg) {
      try {
        // Get date and message
        const formattedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
        const messageObject = msg.message;

        // Set coin info
        const coinRegex = /([a-zA-Z]{2,5})(btc|usdt|etc|bnb)/gmi;
        const exchangeSymbol = messageObject.symbol;
        const exchangeSymbolParts = coinRegex.exec(exchangeSymbol);
        const coin = exchangeSymbolParts[1];
        const pairing = exchangeSymbolParts[2];
        const tradingViewChart = `BINANCE:${coin}${pairing}`;

        // Set variables
        const price = messageObject.latest_candle.price_close;
        const sellers = messageObject.sell_pressure === 'med' ? 'medium' : messageObject.sell_pressure;
        const market = messageObject.alt_mood;
        const percentage = messageObject.pct_str;
        const support = messageObject.support_to_resist;

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
            id: this.alerts.length,
            date: formattedDate,
            exchangeSymbol,
            coin,
            pairing,
            price,
            market,
            sellers,
            support,
            binanceUrl,
            tradingViewUrl,
            tradingViewChart,
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
      } catch (err) {
        console.log(err);
        console.log(msg);
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

<style scoped lang="scss">

</style>
