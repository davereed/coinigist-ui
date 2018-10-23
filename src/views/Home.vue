<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row justify-content-center">
          <div class="col-8">
            <h3>
              Market Alerts
              <small class="text-muted float-right">
              <b-form-group class="d-inline mr-3 mb-0 pb-0" >
                <b-form-radio-group id="candleInterval"
                                    buttons
                                    v-model="candleInterval"
                                    :options="candleIntervalOptions"
                                    size="sm"
                                    name="candleInterval" />
              </b-form-group>
              <b-button :pressed.sync="alertSounds" variant="outline-primary" size="sm"><span v-show="alertSounds"><i class="fas fa-fw fa-volume"></i></span><span v-show="!alertSounds"><i class="fas fa-fw fa-volume-off"></i></span></b-button>
              </small>
            </h3>
            <Alert v-for="alert in alerts" v-bind:key=alert.id :alert=alert :interval=candleInterval />
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
      candleInterval: '5',
      candleIntervalOptions: [
        { text: '1 minute', value: '1' },
        { text: '3 minute', value: '3' },
        { text: '5 minute', value: '5' },
        { text: '15 minute', value: '15' },
      ],
      updateSounds: false,
      alertSounds: true,
      alerts: [],
      updates: [],
      my_channel: this.$pnGetMessage('my_channel', this.receptor),
    };
  },
  persist: ['updateSounds', 'alertSounds', 'candleInterval'],
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
        const baseScore = messageObject.score;

        // Create urls
        const binanceUrl = `https://www.binance.com/en/trade/${coin}_${pairing}`;
        const tradingViewUrl = `https://www.tradingview.com/symbols/${coin}${pairing}`;
        if (messageObject.msg_type === 'ALERT' && messageObject.is_show === true) {
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
            baseScore,
            binanceUrl,
            tradingViewUrl,
            tradingViewChart,
            originalMessage: messageObject,
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

