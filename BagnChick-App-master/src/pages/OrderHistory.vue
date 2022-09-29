<template>
  <q-page>
    <q-tabs
      v-model="tab"
      dense
      @click="loadOrder(tab)"
      class="text-grey"
      active-color="red"
      indicator-color="red"
      align="justify"
      narrow-indicator
      >
      <q-tab name="Pending" label="Pending" />
      <q-tab name="Completed" label="Completed" />
      <q-tab name="Cancelled" label="Cancelled" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Pending">
          <div class="text-h6 q-mb-sm">Pending</div>
            <q-list bordered>
              <q-expansion-item v-for="order in $sortBy(orders, ['createdAt']).reverse()" :key="order.id">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Order ID: {{order.id}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Name: {{order && order.user && order.user.displayName !== null ? order.user.displayName : ''}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Table Number: {{order.tableNumber}}</q-item-label>
                  </q-item-section>
                </template>

                <q-list>
                  <q-item-label header class="text-h6">Orders</q-item-label>
                  <q-item v-for="(menu, index) in order.menus" :key="index">
                    <q-item-section avatar>
                      <q-avatar size="80px" rounded>
                        <q-img
                          :src="menu.imageUrl"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Name: {{menu.name}}</q-item-label>
                      <q-item-label>Bundle: {{menu.type}}</q-item-label>
                      <q-item-label caption>Price: Php {{menu.price}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-separator inset spaced v-if="order.menus.some(order => order.type === 'Unlimited')" />

                <q-list v-if="order.menus.some(order => order.type === 'Unlimited')">
                  <q-item-label header class="text-h6"># of Customer for Unlimited</q-item-label>
                  <span v-for="(discount, discountInd) in order.discounts" :key="discountInd">
                    <q-item v-if="discount.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          {{discount.name}}
                        </q-item-label>
                        <q-item-label caption>
                          {{discount.discount}}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section top side>
                        {{discount.quantity}} person/s
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

                <q-separator inset spaced v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0" />

                <q-list v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0">
                  <q-item-label header class="text-h6">Add-ons</q-item-label>
                  <span v-for="(addon, addonInd) in order.addOns" :key="addonInd">
                    <q-item v-if="addon.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          Name: {{addon.name}}
                        </q-item-label>
                        <q-item-label caption>
                          Price: Php {{addon.price}}
                        </q-item-label>
                        <q-item-label caption>
                          Qty: {{addon.quantity}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

              <q-separator inset spaced />

                <q-list>
                  <q-item-label header class="text-h6 q-pb-none">Remarks</q-item-label>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{order.remarks === '' ? 'None' : order.remarks}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-item>
                  <q-item-section>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin"><q-btn unelevated @click="markAsCompleted(order)" label="Mark as completed" color="red" /></q-item-label>
                    <q-item-label><q-btn @click="markAsCancelled(order)" unelevated label="Mark as Cancelled" color="negative" /></q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>

            <q-item class="text-center" v-if="orders.length === 0">
              <q-item-section>
                <q-item-label>
                  No Data
                </q-item-label>
              </q-item-section>
            </q-item>
        </q-tab-panel>

        <q-tab-panel name="Completed">
          <div class="text-h6 q-mb-sm">Completed</div>
            <q-list bordered>
              <q-expansion-item v-for="order in $sortBy(orders, ['createdAt']).reverse()" :key="order.id">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Order ID: {{order.id}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Name: {{order && order.user && order.user.displayName !== null ? order.user.displayName : ''}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Table Number: {{order.tableNumber}}</q-item-label>
                  </q-item-section>
                </template>

                <q-list>
                  <q-item-label header class="text-h6">Orders</q-item-label>
                  <q-item v-for="(menu, index) in order.menus" :key="index">
                    <q-item-section avatar>
                      <q-avatar size="80px" rounded>
                        <q-img
                          :src="menu.imageUrl"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Name: {{menu.name}}</q-item-label>
                      <q-item-label>Bundle: {{menu.type}}</q-item-label>
                      <q-item-label caption>Price: Php {{menu.price}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-separator inset spaced v-if="order.menus.some(order => order.type === 'Unlimited')" />

                <q-list v-if="order.menus.some(order => order.type === 'Unlimited')">
                  <q-item-label header class="text-h6"># of Customer for Unlimited</q-item-label>
                  <span v-for="(discount, discountInd) in order.discounts" :key="discountInd">
                    <q-item v-if="discount.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          {{discount.name}}
                        </q-item-label>
                        <q-item-label caption>
                          {{discount.discount}}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section top side>
                        {{discount.quantity}} person/s
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

                <q-separator inset spaced v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0" />

                <q-list v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0">
                  <q-item-label header class="text-h6">Add-ons</q-item-label>
                  <span v-for="(addon, addonInd) in order.addOns" :key="addonInd">
                    <q-item v-if="addon.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          Name: {{addon.name}}
                        </q-item-label>
                        <q-item-label caption>
                          Price: {{addon.price}}
                        </q-item-label>
                        <q-item-label caption>
                          Qty: {{addon.quantity}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

               <q-separator inset spaced />

                <q-list>
                  <q-item-label header class="text-h6 q-pb-none">Remarks</q-item-label>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{order.remarks === '' ? 'None' : order.remarks}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                
                <q-item>
                  <q-item-section>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin"><q-btn unelevated @click="markAsPayment(order)" label="Mark as payment" color="positive" /></q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>

            <q-item class="text-center" v-if="orders.length === 0">
              <q-item-section>
                <q-item-label>
                  No Data
                </q-item-label>
              </q-item-section>
            </q-item>
        </q-tab-panel>

        <q-tab-panel name="Cancelled">
          <div class="text-h6 q-mb-sm">Cancelled</div>
            <q-list bordered>
              <q-expansion-item v-for="order in $sortBy(orders, ['createdAt']).reverse()" :key="order.id">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://firebasestorage.googleapis.com/v0/b/bagn-chick.appspot.com/o/bnc.jpg?alt=media&token=dec41778-5060-4e88-b3d8-84061f0ab69e" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Order ID: {{order.id}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Name: {{order && order.user && order.user.displayName !== null ? order.user.displayName : ''}}</q-item-label>
                    <q-item-label v-if="$q.localStorage.getItem('user').isAdmin">Table Number: {{order.tableNumber}}</q-item-label>
                  </q-item-section>
                </template>

                <q-list>
                  <q-item-label header class="text-h6">Orders</q-item-label>
                  <q-item v-for="(menu, index) in order.menus" :key="index">
                    <q-item-section avatar>
                      <q-avatar size="80px" rounded>
                        <q-img
                          :src="menu.imageUrl"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Name: {{menu.name}}</q-item-label>
                      <q-item-label>Bundle: {{menu.type}}</q-item-label>
                      <q-item-label caption>Price: Php {{menu.price}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-separator inset spaced v-if="order.menus.some(order => order.type === 'Unlimited')" />

                <q-list v-if="order.menus.some(order => order.type === 'Unlimited')">
                  <q-item-label header class="text-h6"># of Customer for Unlimited</q-item-label>
                  <span v-for="(discount, discountInd) in order.discounts" :key="discountInd">
                    <q-item v-if="discount.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          {{discount.name}}
                        </q-item-label>
                        <q-item-label caption>
                          {{discount.discount}}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section top side>
                        {{discount.quantity}} person/s
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

                <q-separator inset spaced v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0" />

                <q-list v-if="order.addOns.reduce(function (acc, obj) { return acc + obj.quantity }, 0) !== 0">
                  <q-item-label header class="text-h6">Add-ons</q-item-label>
                  <span v-for="(addon, addonInd) in order.addOns" :key="addonInd">
                    <q-item v-if="addon.quantity > 0">
                      <q-item-section>
                        <q-item-label>
                          Name: {{addon.name}}
                        </q-item-label>
                        <q-item-label caption>
                          Price: Php {{addon.price}}
                        </q-item-label>
                        <q-item-label caption>
                          Qty: {{addon.quantity}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </span>
                </q-list>

                <q-separator inset spaced />

                <q-list>
                  <q-item-label header class="text-h6 q-pb-none">Remarks</q-item-label>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        {{order.remarks === '' ? 'None' : order.remarks}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>

            <q-item class="text-center" v-if="orders.length === 0">
              <q-item-section>
                <q-item-label>
                  No Data
                </q-item-label>
              </q-item-section>
            </q-item>
        </q-tab-panel>
      </q-tab-panels>
  </q-page>
</template>

<script>

import { sumBy } from 'lodash'
export default {
  mounted () {
    this.loadOrder('Pending')
  },
  data () {
    return {
      totalPrice: 0,
      sumBy,
      tab: 'Pending',
      orders: []
    }
  },
  methods: {
    loadOrder (status) {
      if (this.$q.localStorage.getItem('user').isAdmin) {
        this.$bind('orders', this.$db.collection('orders').where('status', '==', status)).then(orders => {
          this.orders = orders
        })
      } else {
        if (this.$q.localStorage.getItem('user')) {
          this.$bind('orders', this.$db.collection('orders').where('status', '==', status).where('user.uid', '==', this.$q.localStorage.getItem('user').uid)).then(orders => {
            this.orders = orders
          })
        }
      }
    },
    markAsCancelled (order) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to cancel?',
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
        this.$db.collection('orders').doc(order.id).set({
          status: 'Cancelled'
        }, { merge: true });
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    markAsPayment (order) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Enter Total price',
        color: 'red',
        prompt: {
          model: '',
          type: 'number'
        },
        ok: {
          color: 'red',
          unelevated: true
        },
        cancel: {
          color: 'red',
          flat: true
        },
        persistent: true
      }).onOk(data => {
        if (data === '') {
          this.$q.notify({
            position: 'top-left',
            timeout: 1500,
            icon: 'close',
            message: 'Total Price can not be empty.',
            color: 'negative'
          })
        } else {
          this.$db.collection('orders').doc(order.id).set({
            totalPrice: data,
            // status: 'Completed'
          }, { merge: true });
          this.$q.notify({
            position: 'top-left',
            timeout: 1500,
            icon: 'check',
            message: 'Success!',
            color: 'positive'
          })
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    markAsCompleted (order) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to proceed?',
        // color: 'red',
        // prompt: {
        //   model: '',
        //   type: 'number'
        // },
        ok: {
          color: 'red',
          unelevated: true
        },
        cancel: {
          color: 'red',
          flat: true
        },
        persistent: true
      }).onOk(data => {
        if (data === '') {
          this.$q.notify({
            position: 'top-left',
            timeout: 1500,
            icon: 'close',
            message: 'Total Price can not be empty.',
            color: 'negative'
          })
        } else {
          this.$db.collection('orders').doc(order.id).set({
            // totalPrice: data,
            status: 'Completed'
          }, { merge: true });
          this.$q.notify({
            position: 'top-left',
            timeout: 1500,
            icon: 'check',
            message: 'Order has been successfully completed.',
            color: 'positive'
          })
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
  }
}
</script>

<style>

</style>