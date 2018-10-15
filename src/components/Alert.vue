<template>
  <div class="alert-component mb-5">
    <div class="card bg-chart-body">
      <div class="card-body m-0 p-0">
        <div class="chart-content bg-black">
          <h4 class="chart-title">
            <a target="_blank" :href="currentAlert.binanceUrl">Binance {{currentAlert.coin}}/{{currentAlert.pairing}}</a>
            <small>{{ currentAlert.date }}</small>
          </h4>
          <div>
            <div v-bind:id="'tradingview-' + currentAlert.id" class="tradingview-chart-container"></div>
          </div>
        </div>
        <div class="chart-sidebar bg-alert-sidebar">
          <h4 class="chart-title mb-0 pb-0">
            Overall Score
          </h4>
          <h4 class="chart-title text-capitalize mt-0 pt-0">
            <small>
            <b-progress :value="currentAlert.baseScore"
                        :max="10"
                        :variant="scoreProgressVariant"
                        :key="scoreProgressVariant"
                        show-value
            ></b-progress>
            <small><timeago :datetime="createDate" :auto-update="5" :converterOptions="{ includeSeconds: true }"></timeago></small>
            </small>
          </h4>
          <h4 class="chart-title mt-4">
            <i class="fab fa-btc text-bitcoin"></i> {{ currentAlert.price }}
            <small>Bitcoin Alert Price</small>
          </h4>
          <h4 class="chart-title mt-3 text-capitalize">
            <i v-bind:class="marketClassObject"></i> {{ currentAlert.market }}
            <small>Market Sentiment</small>
          </h4>
          <h4 class="chart-title mt-3 text-capitalize">
            <i v-bind:class="supportClassObject"></i> {{ currentAlert.support }}
            <small>Support/Resistance</small>
          </h4>
          <h4 class="chart-title mt-3 text-capitalize">
            <i v-bind:class="sellersClassObject"></i> {{ currentAlert.sellers }}
            <small>Sellers</small>
          </h4>
          <div class="chart-sidebar-buttons p-3">
            <a target="_blank" :href="alert.binanceUrl" class="btn btn-primary btn-sm btn-block">Binance</a>
            <a target="_blank" :href="alert.tradingViewUrl" class="btn btn-secondary btn-sm btn-block">TradingView</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import momentTimezone from 'moment-timezone';
import { format } from 'date-fns';

export default {
  name: 'Alert',
  props: {
    alert: Object,
    interval: String,
  },
  data() {
    return {
      currentAlert: this.alert,
      createDate: format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    };
  },
  computed: {
    scoreProgressVariant() {
      const scoreSwitch = score => ({
        0: 'danger',
        1: 'danger',
        2: 'danger',
        3: 'warning',
        4: 'warning',
        5: 'info',
        6: 'primary',
        7: 'primary',
        8: 'success',
        9: 'success',
        10: 'success',
      })[score];
      return scoreSwitch(this.currentAlert.baseScore);
    },
    marketClassObject() {
      return {
        'far fa-frown text-danger very': this.currentAlert && this.currentAlert.market === 'very negative',
        'far fa-frown text-danger': this.currentAlert && this.currentAlert.market === 'negative',
        'far fa-meh text-secondary': this.currentAlert && this.currentAlert.market === 'neutral',
        'far fa-smile text-success': this.currentAlert && this.currentAlert.market === 'positive',
        'far fa-smile text-success very': this.currentAlert && this.currentAlert.market === 'very positive',
      };
    },
    supportClassObject() {
      return {
        'far fa-minus-hexagon text-danger': this.currentAlert && this.currentAlert.support === 'negative',
        'far fa-hexagon text-secondary': this.currentAlert && this.currentAlert.support === 'neutral',
        'far fa-plus-hexagon text-success': this.currentAlert && this.currentAlert.support === 'positive',
      };
    },
    sellersClassObject() {
      return {
        'far fa-badge-check text-success': this.currentAlert && this.currentAlert.sellers === 'low',
        'far fa-badge text-info': this.currentAlert && this.currentAlert.sellers === 'medium',
        'far fa-badge text-danger': this.currentAlert && this.currentAlert.sellers === 'high',
      };
    },
  },
  mounted() {
    setTimeout(() => {
      const timeZone = momentTimezone.tz.guess();
      new TradingView.widget({
        autosize: true,
        symbol: this.currentAlert.tradingViewChart,
        interval: this.interval,
        timezone: !timeZone ? 'Etc/UTC' : timeZone,
        theme: 'Dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        save_image: false,
        container_id: 'tradingview-' + this.currentAlert.id,
      });
    }, 100);
  },
};
</script>


<style scoped lang="scss">
    .tradingview-chart-container {
        height:400px;
    }

    .bg-chart-body {
      background: #2d353c;
    }

    .chart-title {
      font-size: 16px!important;
      line-height: 20px;
      color: #fff;
      font-weight: 600!important;
      margin: 2px 5px 5px;
    }

    .chart-title a {
      color:#fff;
    }

    .chart-title small {
      display: block;
      margin-top: 3px;
      font-size: 12px;
      line-height: 16px;
      color: #616D72;
      font-weight: 400;
      color: rgba(255,255,255,.5);
    }

    .chart-content {
        padding: 15px;
        margin-right: 230px;
    }

    .chart-sidebar {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 230px;
      padding: 15px 20px;
      border-radius: 0 4px 4px 0;
      font-size:.8rem;
    }

    .bg-alert-sidebar {
      background-color: #242a30!important;
      color: #eee;
    }

    .chart-sidebar-buttons {
      position:absolute;
      width:100%;
      left:0;
      bottom:0;
    }

    .chart-sidebar-titles small {
      font-size:.7rem;
    }

    .text-bitcoin {
      color:#FF9500;
    }

</style>

