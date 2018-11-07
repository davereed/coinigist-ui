<template>
  <div class="home">
    <b-modal id="modal-profile-success" title="Success" :ok-only="true">
      Your profile was successfully saved.
    </b-modal>
    <b-modal id="modal-profile-error" title="Error" :ok-only="true">
      There was an error processing your request.
    </b-modal>
    <main role="main" class="container">
      <div class="row">
        <div class="col-lg-8">
          <h3 class="pt-0 mb-5">Profile</h3>
          <h5>API Settings</h5>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="commas-api-key-group"
                          label="3Commas API Key"
                          label-for="commas-api-key">
              <b-form-input id="commas-api-key"
                            type="text"
                            v-model="form.commas_api_key"
                            required
                            :disabled="!showAPI"
                            placeholder="Enter your 3Commas API Key">
              </b-form-input>
            </b-form-group>
            <b-form-group id="commas-api-secret-group"
                          label="3Commas API Secret"
                          label-for="commas-api-secret"
                          description="Your API Secret cannot be retrieved after it is submitted. We immediately encrypt it and discard the unencrypted copy.">
              <b-form-input v-if="showAPI" id="commas-api-secret-input"
                            type="text"
                            v-model="form.commas_api_secret"
                            required
                            placeholder="Enter your 3Commas API Secret">
              </b-form-input>
              <b-form-input v-if="!showAPI"
                            id="commas-api-secret-hidden-input"
                            type="password"
                            v-model="dummy_secret"
                            required
                            disabled
                            placeholder="Enter your 3Commas API Secret">
              </b-form-input>
            </b-form-group>
            <div class="mt-4">
              <b-button type="reset" variant="danger" class="mr-5">Reset API Section</b-button>
            </div>
            <hr class="my-4" />
            <h5>Trading Configuration</h5>
            <b-form-group id="trading-account-id"
                          label="Trading account id"
                          label-for="trading-account-id-input">
              <b-input-group append="%">
                <b-form-input id="trading-account-id-input"
                              type="number"
                              v-model="form.trading_account_id"
                              required
                              placeholder="12345">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group id="trading-total-amount"
                          label="Total BTC per trade"
                          label-for="trading-total-amount-input">
              <b-input-group append="%">
                <b-form-input id="trading-total-amount-input"
                              type="number"
                              v-model="form.trading_total_amount"
                              required
                              placeholder="0.05000000">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group id="trading-take-profit-percentage"
                          label="Take profit percentage"
                          label-for="trading-take-profit-percentage-input">
              <b-input-group append="%">
                <b-form-input id="trading-take-profit-percentage-input"
                              type="number"
                              v-model="form.trading_take_profit_percentage"
                              required
                              placeholder="e.g. 3.3">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group id="trading-take-profit-trailing-percentage"
                          label="Take profit trailing percentage"
                          label-for="trading-take-profit-trailing-percentage-input">
              <b-input-group append="%">
                <b-form-input id="trading-take-profit-trailing-percentage-input"
                              type="number"
                              v-model="form.trading_take_profit_trailing_percentage"
                              required
                              placeholder="e.g. 1.5">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group id="trading-stop-loss-percentage"
                          label="Stop loss percentage"
                          label-for="trading-stop-loss-percentage-input">
              <b-input-group append="%">
                <b-form-input id="trading-stop-loss-percentage-input"
                              type="number"
                              v-model="form.trading_stop_loss_percentage"
                              required
                              placeholder="e.g. 1.3">
                </b-form-input>
              </b-input-group>
            </b-form-group>
            <div class="mt-4">
              <b-button type="submit" variant="primary">Save</b-button>
            </div>
          </b-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        commas_api_key: '',
        commas_api_secret: '',
        trading_take_profit_percentage: '',
        trading_stop_loss_percentage: '',
      },
      dummy_secret: '121212121221212121212121212121212',
      show: false,
      showAPI: true,
    };
  },
  computed: {

  },
  methods: {
    onSubmit(evt) {
      this.showAPI = false;
      axios.patch('/api/users', this.form).then(() => {
        this.$root.$emit('bv::show::modal', 'modal-profile-success');
      }).catch((e) => {
        this.$root.$emit('bv::show::modal', 'modal-profile-error');
        console.log('Error: ', e.response.data);
      });

      evt.preventDefault();
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.commas_api_key = '';
      this.form.commas_api_secret = '';
      this.showAPI = true;
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
  mounted() {
    axios.get('/api/users').then((response) => {
      this.show = true;
      this.form = { ...this.form, ...response.data };
      if (this.form.commas_api_secret_configured) {
        this.showAPI = false;
      }
    }).catch((e) => {
      console.log('Error: ', e.response.data);
    });
  },
};
</script>
