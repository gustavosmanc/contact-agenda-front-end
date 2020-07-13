<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <span class="fas fa-plus-square icon-header"></span>Adicionar Contato
      </div>
      <form
        id="add-contact-form"
        name="add-contact-form"
        class="form-signin"
        v-on:submit.prevent="addContact()"
      >
        <div class="card-body">
          <div class="form-group row">
            <div class="col-sm-12">
              <label for="name">Nome</label>
              <input
                type="text"
                class="form-control"
                vid="name"
                name="name"
                v-model="name"
                required
                autofocus
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12 mob-row">
              <label for="surname">Sobrenome</label>
              <input
                type="text"
                class="form-control"
                id="surname"
                name="surname"
                v-model="surname"
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12">
              <label for="email">E-mail</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                v-model="email"
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12">
              <label for="zip-code">CEP</label>
              <input
                type="number"
                class="form-control"
                id="zip-code"
                name="zip-code"
                v-model="zipCode"
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-3">
              <label for="state-initials">UF</label>
              <select
                class="form-control"
                id="state-initials"
                name="state-initials"
                v-model="state"
                v-on:change="loadCities()"
              >
                <option
                  :value="{ id: state.id, name: state.initial }"
                  :disabled="true"
                ></option>
                <option
                  v-bind:key="stateInitial.id"
                  v-for="stateInitial in stateInitials"
                  v-bind:value="{
                    id: stateInitial.id,
                    initial: stateInitial.initial,
                  }"
                  >{{ stateInitial.initial }}</option
                >
              </select>
            </div>
            <div class="col-sm-9 mob-row">
              <label for="city">Município</label>
              <select class="form-control" id="city" name="city" v-model="city">
                <option
                  :value="{ id: city.id, name: city.name }"
                  :disabled="true"
                  >Escolha o UF</option
                >
                <option
                  v-bind:key="city.id"
                  v-for="city in cities"
                  v-bind:value="{ id: city.id, name: city.name }"
                  >{{ city.name }}</option
                >
              </select>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12">
              <label for="neighborhood">Bairro</label>
              <input
                type="text"
                class="form-control"
                id="neighborhood"
                name="neighborhood"
                v-model="neighborhood"
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-9">
              <label for="public-area">Logradouro</label>
              <input
                type="text"
                class="form-control"
                id="public-area"
                name="public-area"
                v-model="publicArea"
              />
            </div>
            <div class="col-sm-3 mob-row">
              <label for="number">Número</label>
              <input
                type="number"
                class="form-control"
                id="number"
                name="number"
                v-model="number"
              />
            </div>
          </div>
          <div class="phone-block">
            <div class="form-group row">
              <div class="col-sm-12">
                <label for="main-phone">Telefone</label>
                <div class="align-input">
                  <input
                    type="number"
                    class="form-control phones"
                    id="main-phone"
                    name="main-phone"
                  />
                  <span
                    class="fas fa-plus-circle phone-control phone-plus"
                    v-on:click="addPhone()"
                  ></span>
                  <span
                    class="fas fa-minus-circle phone-control phone-minus"
                    v-on:click="removePhone()"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button type="submit" class="btn btn-save btn-sm form-btn">
            <span class="fas fa-check"></span>
          </button>
          <router-link to="/" class="btn btn-secondary btn-sm form-btn">
            <span class="fas fa-arrow-left"></span>
          </router-link>
        </div>
      </form>
      <Footer />
    </div>
  </div>
</template>

<script>
import '../../global.css';
import './styles.css';

import axios from 'axios';

import Footer from '../../components/Footer.vue';

import cuteAlert from '../../../libs/cutealert/cutealert';

export default {
  components: {
    Footer,
  },
  data() {
    return {
      stateInitials: [],
      cities: [],
      name: '',
      surname: '',
      email: '',
      zipCode: '',
      state: { id: '', initial: '' },
      city: { id: '', name: '' },
      neighborhood: '',
      publicArea: '',
      number: '',
      phones: [],
    };
  },
  created() {
    // Connects to IBGE API in order to return list of states
    axios
      .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
      .then((response) => {
        response.data.forEach((state) => {
          this.stateInitials.push({ id: state.id, initial: state.sigla });
        });

        // Sorts array alphabetically (based on state initials)
        this.stateInitials.sort((a, b) => {
          return a.initial < b.initial ? -1 : a.initial > b.initial ? 1 : 0;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    addContact() {
      const allPhones = document.querySelectorAll('.phones');
      allPhones.forEach((phone) => {
        this.phones.push(phone.value);
      });

      let params = new FormData();

      params.append('name', this.name);
      params.append('surname', this.surname);
      params.append('email', this.email);
      params.append('zip_code', this.zipCode);
      params.append('state_initials', this.state.id);
      params.append('city', this.city.id);
      params.append('neighborhood', this.neighborhood);
      params.append('public_area', this.publicArea);
      params.append('number', this.number);
      params.append('phones', JSON.stringify(Object.values(this.phones)));

      axios
        .post(
          `http://contact-agenda.herokuapp.com/src/scripts/AddContact.php`,
          params
        )
        .then((response) => {
          if (response.data.response === 200) {
            cuteAlert
              .cuteAlert({
                type: 'success',
                title: 'Sucesso',
                message: response.data.message,
              })
              .then(() => {
                this.$router.push('/');
              });
          } else if (response.data.response === 400) {
            cuteAlert.cuteAlert({
              type: 'error',
              title: 'Erro',
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          cuteAlert.cuteAlert({
            type: 'error',
            title: 'Erro',
            message: 'Erro na requisição ao servidor!',
          });
        });
    },

    // Adds new phone input field
    addPhone() {
      const block = this.$el.querySelector('.phone-block');
      const blockChildCount = block.childElementCount;

      const template = `
      <div class="form-group row">
        <div class="col-sm-12 mob-row">
          <div class="align-func-input">
            <input type="number" class="form-control phones" id="phone${blockChildCount}" name="phone${blockChildCount}"
            placeholder="Informe o número do telefone:"/>
          </div>
        </div>
      </div>
      `;

      block.insertAdjacentHTML('beforeend', template);
    },

    // Removes last phone input field
    removePhone() {
      const block = this.$el.querySelector('.phone-block');

      if (block.childElementCount > 1) {
        block.lastElementChild.remove();
      }
    },

    loadCities() {
      this.$el.querySelector('#city').innerHTML = '';
      this.cities = [];

      // On state change, connects to IBGE API in order to return list of cities according to selected state
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${this.state.id}/municipios`
        )
        .then((response) => {
          response.data.forEach((city) => {
            this.cities.push({ id: city.id, name: city.nome });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
