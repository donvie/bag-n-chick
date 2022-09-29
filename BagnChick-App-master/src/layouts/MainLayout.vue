<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-red">
      <q-toolbar>
        <q-avatar>
          <img
            @click="$router.push('/').catch(() => {})"
            src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e"
            />
        </q-avatar>
        <q-toolbar-title @click="$router.push('/').catch(() => {})">
          {{$route.name}}
        </q-toolbar-title>

        <q-btn
          v-if="!$q.localStorage.getItem('user').isAdmin"
          flat
          dense
          @click="barcodeLayout = true"
          color="white"
          round
          aria-label="Menu"
          icon="qr_code_scanner"
        />

        <q-btn
          flat
          v-if="!$q.localStorage.getItem('user').isAdmin"
          dense
          to="basket"
          color="white"
          @click="layoutNotification = true"
          round
          aria-label="Menu"
          icon="shopping_basket"
        >
          <q-badge v-if="carts.length !== 0" color="white" text-color="red" floating transparent>
            {{carts.length}}
          </q-badge>
        </q-btn>

        <q-btn
          flat
          dense
          v-if="$q.localStorage.getItem('user').isAdmin"
          to="order_history"
          color="white"
          round
          aria-label="Menu"
          icon="pending_actions"
        >
          <q-badge v-if="orders.length !== 0" color="white" text-color="red" floating transparent>
            {{orders.length}}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-white text-red-4">
      <q-tabs indicator-color="transparent" align="justify" dense no-caps active-color="red">
        <q-route-tab
          icon="home"
          v-if="!$q.localStorage.getItem('user').isKitchen"
          label="Home"
          to="/"
          exact
        />
        <q-route-tab
          v-if="$q.localStorage.getItem('user').isAdmin && !$q.localStorage.getItem('user').isKitchen"
          icon="dashboard"
          label="Dashboard"
          to="/dashboard"
          exact
        />
        <q-route-tab
          icon="history"
          label="Order History"
          to="/order_history"
          exact
        />
        <q-route-tab
          icon="person"
          label="Account"
          to="/account"
          exact
        />
      </q-tabs>
    </q-footer>

    <q-dialog v-model="barcodeLayout" persistent maximized>
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-red">
          <q-toolbar>
            <q-icon color="white" size="36px" name="qr_code_scanner" />
            <q-toolbar-title>QR Code Scanner</q-toolbar-title>
            <q-btn
              flat
              label="Close"
              dense
              @click="barcodeLayout = false"
              color="white"
              aria-label="Menu"
              icon="close"
            />
          </q-toolbar>
        </q-header>

        <q-footer class="bg-white q-pa-sm">
          <q-btn class="full-width" label="Click to Scan" size="lg" color="red" unelevated />
        </q-footer>

        <q-page-container>
          <q-page class="q-pa-lg">
            <q-carousel
              animated
              v-model="slide"
              arrows
              height="80vh"
              swipeable
              navigation
              control-color="red"
              infinite
            >
              <q-carousel-slide :name="1" img-src="~src/assets/cover1.png" />
              <q-carousel-slide :name="2" img-src="~src/assets/cover2.jpeg" />
              <q-carousel-slide :name="3" img-src="~src/assets/cover3.jpeg" />
            </q-carousel>
            <!-- <q-input filled v-model="name" color="red" class="q-mb-lg" label="Product Name" />
            <q-input filled v-model="description" color="red" type="textarea" class="q-mb-lg" label="Description" />
            <q-input filled v-model="price" color="red" class="q-mb-lg" label="Price" type="number" />
            <q-select filled v-model="type" color="red" class="q-mb-lg" :options="typeOptions" label="Type" />
            <q-input filled v-model="imageUrl" color="red" class="q-mb-lg" label="Image URL" />
            <q-btn @click="addMenu()" icon="save" class="full-width" label="Save" color="red" unelevated /> -->
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>


    <q-page-container>
      <router-view :tableNumber="tableNumber" :carts="carts" />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      slide: 1,
      tableNumber: '12345',
      barcodeLayout: false,
      carts: [],
      orders: []
    }
  },
  mounted () {
    if (this.tableNumber === '' && !$q.localStorage.getItem('user').isAdmin) {
      this.barcodeLayout = true
    }

    // if (this.$q.localStorage.getItem('user').isKitchen) {
    //   this.$router.push('/order_history')
    // }

    if (this.$q.localStorage.getItem('user')) {
      this.$bind('carts', this.$db.collection('carts').where('user.uid', '==',  this.$q.localStorage.getItem('user').uid)).then(carts => {
        this.carts = carts
      })
    }

    this.$bind('orders', this.$db.collection('orders').where('status', '==', 'Pending')).then(orders => {
      this.orders = orders
    })
  },
  methods: {
    placeOrder () {
      cordova.plugins.barcodeScanner.scan((result) => {
        this.tableNumber = result.text
        this.barcodeLayout = false
      },function (error) {
        this.$q.notify({
          position: 'top-left',
          timeout: 1500,
          icon: 'close',
          message: 'Scanning failed' + error,
          color: 'negative'
        })
      }, {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
      })
      }
  }
}
</script>
