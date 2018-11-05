<template>
  <div class="home">
    <main role="main" class="container">
      <div class="row">
        <div class="col">
          <h3 class="pt-0">Profile Settings</h3>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="commas-api-key-group"
                          label="3Commas API Key"
                          label-for="commas-api-key">
              <b-form-input id="commas-api-key"
                            type="text"
                            v-model="form.commas_api_key"
                            required
                            :disabled="!showPassword"
                            placeholder="Enter your 3Commas API Key">
              </b-form-input>
            </b-form-group>
            <b-form-group id="commas-api-secret-group"
                          label="3Commas API Secret"
                          label-for="commas-api-secret"
                          description="Your API Secret cannot be retrieved after it is submitted. We immediately encrypt it and discard the unencrypted copy.">
              <b-form-input v-if="showPassword" id="commas-api-secret-input"
                            type="text"
                            v-model="form.commas_api_secret"
                            required
                            placeholder="Enter your 3Commas API Secret">
              </b-form-input>
              <b-form-input v-if="!showPassword"
                            id="commas-api-secret-hidden-input"
                            type="password"
                            v-model="dummy_secret"
                            required
                            disabled
                            placeholder="Enter your 3Commas API Secret">
              </b-form-input>
            </b-form-group>
            <b-button type="reset" variant="danger" class="mr-5">Reset</b-button>
            <b-button type="submit" variant="primary" :disabled="disableSave">Save</b-button>
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
      },
      dummy_secret: '121212121221212121212121212121212',
      show: false,
      showPassword: true,
    };
  },
  computed: {
    disableSave() {
      return !(this.form.commas_api_key && this.form.commas_api_key.length && this.form.commas_api_secret && this.form.commas_api_secret.length);
    },
  },
  methods: {
    onSubmit(evt) {
      this.showPassword = false;
      axios.patch('/api/users', this.form).then((response) => {
        console.log('Response', response.data);
      }).catch((e) => {
        console.log('Error: ', e.response.data);
      });

      evt.preventDefault();
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.commas_api_key = '';
      this.form.commas_api_secret = '';
      this.showPassword = true;
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
        this.showPassword = false;
      }
    }).catch((e) => {
      console.log('Error: ', e.response.data);
    });
  },
};
</script>
