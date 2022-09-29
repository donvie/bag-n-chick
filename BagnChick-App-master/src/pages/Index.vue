<template>
  <q-page style="margin-bottom: 60px;">
    <q-carousel
      v-model="slide"
      swipeable
      navigation
      animated
      padding
      height="30vh"
    >
      <q-carousel-slide name="1" img-src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bg1.jpg?alt=media&token=c0401246-98b9-4a68-9883-79b7598e0675" />
      <q-carousel-slide name="2" img-src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bg2.jpg?alt=media&token=225b309f-3998-46ab-9603-eb9a91b18856" />
      <q-carousel-slide name="3" img-src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bg3.jpg?alt=media&token=ccfd1b42-17f2-42c4-b44e-057adf800e3b" />
    </q-carousel>


    <div class="text-h6 q-mt-md q-mb-xs q-ml-md text-weight-bold">Menu</div>

    <div class="row q-pa-md q-col-gutter-md">
      <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2 col-xl-2 text-center" v-for="(menu, index) in $sortBy(menus, ['type', 'createdAt']).reverse()" :key="index">
        <q-card bordered class="no-shadow">
          <q-img
            height="160px"
            :src="menu.imageUrl"
          />

          <q-card-section class="q-pa-none q-ml-sm text-left">
            <div>Name: {{menu.name}}</div>
            <div>Bundle: {{menu.type}}</div>
            <div>Price: Php {{menu.price}}</div>
          </q-card-section>

          <q-card-actions class="justify-center">
            <q-btn @click="viewMenu(menu)" no-caps class="full-width" unelevated color="red">View</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.localStorage.getItem('user').isAdmin">
      <q-btn round color="red" @click="addMenuLayout = true" size="lg" icon="add" />
    </q-page-sticky>

    <q-dialog maximized v-model="viewMenuLayout">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-red">
          <q-toolbar>
            <q-btn flat v-close-popup dense color="white" icon="arrow_back" />
            <q-toolbar-title>Details</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-footer class="bg-white">
          <q-toolbar class="q-mb-xs">
            <q-toolbar-title></q-toolbar-title>
            <q-btn @click="addToBasket()" v-if="!$q.localStorage.getItem('user').isAdmin" label="Add to basket" size="16px" icon="add_shopping_cart" no-caps color="red" unelevated v-close-popup />
          </q-toolbar>
        </q-footer>

        <q-page-container>
          <q-page v-if="menuData">
            <q-card square flat>
              <q-img height="30vh" :src="menuData.imageUrl" />

              <q-card-section class="q-col-gutter-sm">
                <q-item-label class="text-h6">Name: {{menuData.name}}</q-item-label>
                <q-item-label caption style="font-size: 14px;">Price: Php {{menuData.price}}</q-item-label>
                <q-item-label><q-rating :value="averageRating" readonly :max="5" size="27px" /></q-item-label>
                <q-item-label>Description: {{menuData.description}}</q-item-label>
              </q-card-section>
            </q-card>

            <q-list>
              <q-item-label header class="text-h6">Reviews</q-item-label>

              <q-item v-for="review in $sortBy(reviews, ['createdAt'])" :key="review.id">
                <q-item-section avatar>
                  <q-avatar>
                    <img src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e" />
                  </q-avatar>
                </q-item-section>

                <q-item-section v-if="review.user">
                  <q-item-label>{{review.user.displayName}}</q-item-label>
                  <q-item-label caption>{{review.review}}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption v-if="review.createdAt">{{date.formatDate(review.createdAt.toDate(), 'YYYY-MM-DD HH:mm')}}</q-item-label>
                  <div class="text-yellow">
                    <q-icon :key="n" v-for="n in review.rating" name="star" />
                  </div>
                </q-item-section>
              </q-item>

              <q-item class="text-center" v-if="reviews.length === 0">
                <q-item-section>
                  <q-item-label>
                    No Review
                  </q-item-label>
                </q-item-section>
              </q-item>

              <div class="q-pa-md q-gutter-md" v-if="!$q.localStorage.getItem('user').isAdmin">
                <q-input v-model="review" type="textarea" placeholder="Write review" />
                <q-rating v-model="rating" :max="5" size="27px" /> <br>
                <q-btn @click="submitReview()" label="Submit" icon="send" unelevated color="red" />
              </div>
            </q-list>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="addMenuLayout">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-red">
          <q-toolbar>
            <q-btn flat v-close-popup dense color="white" icon="arrow_back" />
            <q-toolbar-title>Add Menu</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-lg">
            <q-input filled v-model="name" color="red" class="q-mb-lg" label="Product Name" />
            <q-input filled v-model="description" color="red" type="textarea" class="q-mb-lg" label="Description" />
            <q-input filled v-model="price" color="red" class="q-mb-lg" label="Price" type="number" />
            <q-select filled v-model="type" color="red" class="q-mb-lg" :options="typeOptions" label="Type" />
            <q-input filled v-model="imageUrl" color="red" class="q-mb-lg" label="Image URL" />
            <q-btn @click="addMenu()" icon="save" class="full-width" label="Save" color="red" unelevated />
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageIndex',
  mounted () {
    this.$bind('menus', this.$db.collection('menus').where('type', '!=', 'Add-ons')).then(menus => {
      this.menus = menus
    })
  },
  computed: {
    averageRating () {
      return this.reviews.reduce(function (acc, obj) { return acc + obj.rating }, 0) / this.reviews.length
    }
  },
  data () {
    return {
      type: '',
      typeOptions: [
        'Unlimited',
        'Solo',
        'Buddy',
        'Family',
        'Add-ons'
      ],
      date,
      text: '',
      reviews: [],
      rating: 5,
      addMenuLayout: false,
      review: '',
      menuData: null,
      viewMenuLayout: false,
      slide: '1',
      menus: [],
      name: '',
      price: 0,
      description: '',
      imageUrl: ''
    }
  },
  methods: {
    viewMenu (menu) {
      console.log('ddad', menu)
      this.$bind('reviews', this.$db.collection('reviews').where('menuId', '==', menu.id)).then(reviews => {
        this.reviews = reviews
      })
      this.viewMenuLayout = true;
      this.menuData = menu;
    },
    submitReview () {
      this.$db.collection('reviews').add({
        user: this.$q.localStorage.getItem('user'),
        menuId: this.menuData.id,
        review: this.review,
        rating: this.rating,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        this.review = ''
      })
    },
    addMenu () {
      this.$db.collection('menus').add({
        name: this.name,
        description: this.description,
        imageUrl: this.imageUrl,
        price: this.price,
        quantity: this.type === 'Add-ons ' ? 0 : 1,
        type: this.type,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        this.name = ''
        this.price = 0
        this.description = ''
        this.imageUrl = ''
        this.addMenuLayout = false

        this.$q.notify({
          position: 'top-left',
          timeout: 1500,
          icon: 'check',
          message: 'Menu has been succesfully added.',
          color: 'positive'
        })
      })
    },
    addToBasket () {
      this.menuData.menuId = this.menuData.id

      this.$db.collection('carts').where('type', '!=', 'Add-ons').where('menu.menuId', '==', this.menuData.id).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          this.$db.collection('carts').add({
            menu: this.menuData,
            isChecked: false,
            user: this.$q.localStorage.getItem('user'),
            createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            this.$q.notify({
              position: 'top-left',
              icon: 'check',
              timeout: 1500,
              message: 'Item been added to cart succesfully.',
              color: 'positive'
            })
          })
        } else {
          this.$q.notify({
            position: 'top-left',
            timeout: 1500,
            icon: 'warning',
            message: 'Item has been already added to cart.',
            color: 'amber'
          })
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 150px
</style>
