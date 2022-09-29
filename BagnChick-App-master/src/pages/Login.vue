<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center q-pa-lg">
        <q-img
        style="width: 180px;"
        src="~assets/bnc.jpg"
        />

        <div class="full-width text-center">
          <q-input class="full-width q-mb-sm" color="red" v-model="email" label="Email" type="email" />
          <q-input :type="isPwd ? 'password' : 'text'" class="full-width q-mb-md" color="red" v-model="password" label="Password">
              <template v-slot:append>
              <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
              />
              </template>
          </q-input>
          <q-btn :loading="loading" :disable="email === '' || password === ''" @click="logInWithEmailAndPassword()" class="full-width" no-caps size="18px" color="red" unelevated rounded label="Sign in" />
          <q-btn :disable="email === '' || password === ''" :loading="accountLoading" class="q-mt-xs" color="red" @click="createAccount()" label="Create an Account" flat />
        </div>

        <div class="full-width">
          <q-btn @click="logInWithGoogle()"  icon="ion-logo-google" class="full-width q-mt-md" no-caps size="18px" color="red" outline rounded label="Log in with Google" />
          <q-btn @click="logInWithFacebook()" icon="ion-logo-facebook" class="full-width q-mt-md" no-caps size="18px" color="blue" outline rounded label="Log in with Facebook" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      accountLoading: false,
      loading: false,
      isPwd: true,
      email: '',
      password: ''
    }
  },
  methods: {
    createAccount () {
      this.accountLoading = true
      this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((userCredential) => {
        // Signed in 
        var user = userCredential.user
        this.accountLoading = false
        // ...
      }).catch((error) => {
        this.accountLoading = false
        var errorCode = error.code
        var errorMessage = error.message
        this.$q.notify({
          position: 'top-left',
          icon: 'close',
          timeout: 1500,
          message: error.message,
          color: 'negative'
        })
        // ..
      })
    },
    logInWithFacebook () {
      var provider = new this.$firebase.auth.FacebookAuthProvider();

      this.$firebase.auth().signInWithRedirect(provider).then((result) => {
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        // this.$user = user
        this.$q.localStorage.set('user', user)
        // this.$router.push('/')

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
    },
    logInWithGoogle () {
      var provider = new this.$firebase.auth.GoogleAuthProvider();

      this.$firebase.auth().signInWithRedirect(provider).then((result) => {
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        this.$q.localStorage.set('user', user)
        // this.$router.push('/')

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
    },
    logInWithEmailAndPassword () {
      this.loading = true
      this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.$q.localStorage.set('user', user)
        // this.$router.push('/')
        this.loading = false
        // ...
      }).catch((error) => {
        this.loading = false
        console.log(error)
        this.$q.notify({
          position: 'top-left',
          icon: 'close',
          timeout: 1500,
          message: error.message,
          color: 'negative'
        })
        var errorCode = error.code;
        var errorMessage = error.message;
      })
    }
  }
}
</script>
