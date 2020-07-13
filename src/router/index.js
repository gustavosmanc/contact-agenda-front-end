import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/Index.vue';
import AddContact from '../views/ContactForm/AddContact.vue';
import EditContact from '../views/ContactForm/EditContact.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/add-contact',
    name: 'Add Contact',
    component: AddContact,
  },
  {
    path: '/edit-contact/:id',
    name: 'Edit Contact',
    component: EditContact,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
