<template>
  <div class="container">
    <div class="inner-container">
      <select
        class="form-control contact-select"
        v-model="limit"
        v-on:change="limitContacts"
      >
        <option value="5" selected>Exibir 5 contatos</option>
        <option value="10">Exibir 10 contatos</option>
        <option value="25">Exibir 25 contatos</option>
        <option value="50">Exibir 50 contatos</option>
        <option value>Exibir todos os contatos</option>
      </select>
      <div class="frame">
        <div
          class="contact-frame"
          v-for="(contact, index) in limitContacts()"
          v-bind:key="contact.contact_id"
          v-bind:value="contact.contact_id"
        >
          <div class="contact-info">
            <span class="contact-name">{{ contact.full_name }}</span>
            <span class="contact-detail">{{ contact.email }}</span>
            <span class="contact-detail">{{ contact.phone_number }}</span>
          </div>
          <div class="contact-buttons">
            <router-link
              :to="'/edit-contact/' + contact.contact_id"
              class="edit-button"
            >
              <button class="action-button">
                <span class="fas fa-pen-square"></span>
              </button>
            </router-link>
            <button
              v-on:click="removeContact(contact.contact_id, index)"
              class="action-button remove-button"
            >
              <span class="fas fa-trash"></span>
            </button>
          </div>
        </div>
      </div>
      <router-link to="/add-contact" class="add-button"
        >Adicionar contato</router-link
      >
    </div>
    <Footer />
  </div>
</template>

<script>
import '../../global.css';
import './styles.css';

import axios from 'axios';

import cuteAlert from '../../../libs/cutealert/cutealert';
import '../../../libs/cutealert/cutealert.css';

import '@fortawesome/fontawesome-free/css/all.css';

import Footer from '../../components/Footer.vue';

export default {
  data() {
    return {
      contacts: [],
      limit: 5,
    };
  },
  created() {
    this.listContacts();
  },
  components: {
    Footer,
  },
  methods: {
    addLine() {
      const frame = document.querySelector('.frame');

      if (this.contacts.length === 0) {
        frame.style.border = '1px solid #d9d9d9';
        frame.style.marginTop = '20px';
      } else {
        frame.style.border = '0px !important';
        frame.style.marginTop = '0px';
      }
    },

    limitContacts() {
      return this.limit ? this.contacts.slice(0, this.limit) : this.contacts;
    },

    listContacts() {
      axios
        .get(`http://contact-agenda.herokuapp.com/src/scripts/ListContact.php`)
        .then((response) => {
          response.data.forEach((contact) => {
            this.contacts.push({
              contact_id: contact.contact_id,
              full_name: contact.full_name,
              email: contact.email,
              phone_number: contact.phone_number,
            });
          });
          this.addLine();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    removeContact(id, index) {
      cuteAlert
        .cuteAlert({
          type: 'question',
          title: 'Atenção!',
          message: 'Deseja realmente excluir o contato?',
          confirmText: 'Sim',
          cancelText: 'Não',
        })
        .then((info) => {
          axios
            .get(
              `http://contact-agenda.herokuapp.com/src/scripts/DeleteContact.php?id=${id}`
            )
            .then(() => {
              if (info === 'confirm') {
                this.contacts.splice(index, 1);
                cuteAlert.cuteToast({
                  type: 'info',
                  message: 'O contato foi excluído!',
                });
              }
              this.addLine();
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
  },
};
</script>
