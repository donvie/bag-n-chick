import Vue from 'vue'
import axios from 'axios'

import { sortBy } from 'lodash'

Vue.prototype.$axios = axios
Vue.prototype.$sortBy = sortBy
