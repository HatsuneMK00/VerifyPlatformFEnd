import {getToken} from "@/utils/auth";

const getDefaultState = () => {
  return {
    websocket: null,
    url: '',
    message: {},
  }
}

const state = getDefaultState()

const mutations = {
  WEBSOCKET_INIT(state, url) {
    var that = this;
    state.websocket = new WebSocket(url);
    state.url = url;
    state.websocket.onopen = function () {
      console.log("连接成功")
    }
    state.websocket.onmessage = function (callBack) {
      state.message = callBack.data
    }
    state.websocket.onerror = function (e) {
      console.log("websocket error occured")
    }
    state.websocket.onclose = function () {
      console.log("websocket closed")
    }
  },
  WEBSOCKET_SEND(state, message) {
    state.websocket.send(message);
  }
}

const actions = {
  WEBSOCKET_INIT({ commit }, url) {
    commit('WEBSOCKET_INIT', url)
  },
  WEBSOCKET_SEND({ commit }, message) {
    commit('WEBSOCKET_SEND', message)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
