import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import defult from './modules/defult'


Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        defult,
    },
    getters,
    state: {
        currentLine: null,
        testTool: false
    },
    mutations: {
        setCurrentLine: (state, lineName) => {
            state.currentLine = lineName;
        },
        setCacheData: (state, cacheData) => {
            if (cacheData) {
                state.currentLine = cacheData.currentLine;
                state.testTool = cacheData.testTool;
            }
        },
        setTestTool: (state, show) => {
            state.testTool = show;
        },
        setConfig: (state, c) => {
            let needAdd = true;
            for (let i = 0; i < state.config.length && needAdd; i++) {
                if (state.config[i].name == c.name) {
                    state.config[i].value = c.value;
                    needAdd = false;
                }
            }
            if (needAdd) {
                state.config.push(c);
            }
        },
        removeConfig: (state, c) => {
            let findC = state.config.find(item => {
                return item.name == c.name;
            });
            if (findC) {
                state.config.splice(state.config.indexOf(findC), 1);
            }
        }
    }
})

export default store
