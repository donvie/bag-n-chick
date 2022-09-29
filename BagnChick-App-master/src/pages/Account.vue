<template>
  <q-page>
    <q-card flat>
      <q-item class="q-mb-md q-mt-xs">
        <q-item-section avatar>
          <q-avatar size="60px">
            <img src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h6">{{ $q.localStorage.getItem('user').isAdmin ? 'Company' :  $q.localStorage.getItem('user').displayName }}</q-item-label>
          <q-item-label caption>
            {{ $q.localStorage.getItem('user').email }}
          </q-item-label>
          <q-item-label>
            <q-btn icon="edit" @click="editLayout = true" size="sm" unelevated label="Edit" dense />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="red" name="group" />
        </q-item-section>

        <q-item-section>
          <q-item-label>My Team</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/order_history">
        <q-item-section avatar>
          <q-icon color="red" name="history" />
        </q-item-section>
        <q-item-section>
          <q-item-label>My Orders</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="red" name="help" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Help</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="red" name="info" />
        </q-item-section>

        <q-item-section>
          <q-item-label>About Us</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="logOut()">
        <q-item-section avatar>
          <q-icon color="red" name="exit_to_app" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>

    <q-dialog v-model="editLayout" maximized>
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-red">
          <q-toolbar>
            <q-btn flat @click="editLayout = false" round dense icon="arrow_back" />
            <q-toolbar-title>Edit Profile</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-footer class="bg-white">
          <q-toolbar>
            <q-toolbar-title></q-toolbar-title>
            <q-btn :loading="loading" @click="updateProfile()" label="Save" color="red" icon="save" />
          </q-toolbar>
        </q-footer>

        <q-page-container>
          <q-page class="q-pa-lg">
          <q-input class="full-width q-mb-md" color="red" v-model="displayName" label="Name" />
          <q-input class="full-width q-mb-md" color="red" :value="$q.localStorage.getItem('user').email" readonly label="Email" />
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  data () {
    return {
      editLayout: false,
      displayName: '',
      loading: false
    }
  },
  mounted () {
    this.displayName = this.$q.localStorage.getItem('user').displayName
  },
  methods: {
    updateProfile () {
      this.loading = true
      this.$db.collection('users').doc(this.$q.localStorage.getItem('user').uid).set({
        displayName: this.displayName
      }, { merge: true }).then((data) => {
        const user = this.$q.localStorage.getItem('user')
        user.displayName = this.displayName
        this.$q.localStorage.set('user', user)
        this.loading = false
        this.$q.notify({
          position: 'top-left',
          timeout: 1500,
          icon: 'check',
          message: 'Profile has been successfully updated.',
          color: 'positive'
        })
      }).catch(() => {
        this.$q.notify({
          position: 'top-left',
          timeout: 1500,
          icon: 'close',
          message: 'Error!',
          color: 'negative'
        })
      })
    },
    logOut () {
      this.$q.dialog({
        message: 'Are you sure you want to logout?',
        ok: {
          color: 'red',
          unelevated: true
        },
        cancel: {
          color: 'red',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.$firebase.auth().signOut().then(() => {
          this.$q.localStorage.remove('user')
          this.$router.push('/login')
        }).catch((error) => {
        });
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
  }
}
</script>

<style>

</style>
