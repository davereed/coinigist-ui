<template>
  <div class="home pt-5">
    <main role="main" class="container-fluid">
      <div>
        <div class="row">
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in my_channel.slice().reverse()" v-bind:key="msg.i" v-if="msg.update">
                  <td>{{ msg.update.date }}</td>
                  <td>{{ msg.update.coin }}</td>
                  <td>{{ msg.update.percentage }}</td>
                  <td class="text-capitalize">{{ msg.update.party }}</td>
                  <td class="text-capitalize">{{ msg.update.market }}</td>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in my_channel.slice().reverse()" v-bind:key="msg.i" v-if="msg.alert">
                  <td>{{ msg.alert.date }}</td>
                  <td>{{ msg.alert.coin }}</td>
                  <td>{{ msg.alert.price }}</td>
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
      if (messageObject[2] === 'ALERT') {
        if (this.alertSounds) {
          const audio = new Audio('http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        msg.alert = {
          date: formattedDate,
          coin: messageObject[3].substring(0, 3) + '/' + messageObject[3].substring(3, 6),
          price: messageObject[5],
        };
      } else {
        if (this.updateSounds) {
          const audio = new Audio('http://soundbible.com/mp3/Tick-DeepFrozenApps-397275646.mp3');
          audio.volume = 0.2;
          audio.play();
        }
        const partyRegEx = /(sellers|buyers)(\:)([a-zA-Z0-9]+)(\,)/gm;
        const partyParts = partyRegEx.exec(messageObject[9]);
        const marketRegEx = /(mkt)(\:)([a-zA-Z0-9]+)(\))/gm;
        const marketParts = marketRegEx.exec(messageObject[10]);
        msg.update = {
          date: formattedDate,
          coin: messageObject[3].substring(0, 3) + '/' + messageObject[3].substring(3, 6),
          percentage: messageObject[6],
          party: partyParts[3] ? partyParts[3] : '',
          market: marketParts[3] ? marketParts[3] : '',
        };
      }
    },
  },
  mounted() {
    this.$pnSubscribe({ channels: ['my_channel'], withPresence: true });
  },
};
</script>
