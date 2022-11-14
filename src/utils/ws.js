import Vue from 'vue'

var websock = null;
var global_callback = {};
var lock = 0
var time = 0
var text = ''
var wsuri = 'ws://172.51.216.52:25703';
// var wsuri = 'ws://172.29.0.196:25703';

let ack_topic = false;

let loading;

export function initWebSocket() { //初始化weosocket

    APP_NAME = APP_NAME ? APP_NAME : "web_default";
    APP_KEY = APP_KEY ? APP_KEY : "web";
    SERVER_NAME = SERVER_NAME ? SERVER_NAME : "server_default";
    SERVER_KEY = SERVER_KEY ? SERVER_KEY : "server";

    //ws地址
    wsuri = WS ? WS : wsuri;
    websock = new WebSocket(wsuri);
    websock.onmessage = function(e) {
        websocketonmessage(e);
    };
    websock.onclose = function(e) {
        ack_topic = false;
        websocketclose(e);
        console.log("WebSocket关闭");
    };
    websock.onopen = function() {
        websocketOpen();
    };
    //连接发生错误的回调方法
    websock.onerror = function() {
        ack_topic = false;
        console.log("WebSocket连接发生错误");
    }
}

export function close() {
    if (websock) {
        websock.onclose()
    }
}

export function registerCallback(pagename, callback) {
    global_callback[pagename] = callback;
    console.log('---global_callback---');
    console.log(global_callback);
    console.log('---------------------');
}

export function unregisterCallback(pagename) {
    if (global_callback[pagename]) {
        delete global_callback[pagename];
    }

}


// 实际调用的方法
export function sendSock(agentData) {
    //若是ws开启状态
    if (websock.readyState === websock.OPEN) {
        if (!ack_topic) {
            websocketsend({
                topic: {
                    sname: SERVER_NAME,
                    skey: SERVER_KEY
                }
            })
            setTimeout(function() {
                sendSock(agentData);
            }, 2000);
        } else {
            websocketsend(agentData)
        }
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function() {
            sendSock(agentData);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function() {
            sendSock(agentData);
        }, 1000);
    }
}


// 获取发送的报文
export function getPackage(msgType, data, status = 1, msg = "") {
    return {
        appName: APP_NAME,
        key: APP_KEY,
        msgType: msgType,
        data: typeof(data) == 'string' ? data : JSON.stringify(data),
        status: status,
        msg: msg,
        dateTime: Vue.prototype.$getCurrentDate()
    };
}

//数据接收
function websocketonmessage(e) {
    let data = JSON.parse(e.data);
    // console.log("=== origin ===");
    // console.log(e.data);
    if (!ack_topic) {
        if (data.topic_ack) {
            ack_topic = true;
            console.log('topic ack ok.');
        } else {
            websocketsend({
                topic: {
                    sname: SERVER_NAME,
                    skey: SERVER_KEY
                }
            })
        }
    }

    // 前端收到所有后端数据，应该过滤 
    if (data.appName == SERVER_NAME) {
        if (data.data) {
            try {
                data.data = JSON.parse(data.data);
            } catch (err) {
                console.log('package from outside invalid.', data);
            }
        }
        for (let prop in global_callback) {
            if (prop) {
                global_callback[prop](data);
            }
        }
    }
}

//数据发送
function websocketsend(agentData) {
    websock.send(JSON.stringify(agentData));
}

//关闭
function websocketclose(e) {
    if (e) {
        console.log("connection closed (" + e.code + ")");
        reconnect()
    }

}

function websocketOpen(e) {
    if (loading != undefined) {
        loading.close()
    }
    console.log("ws connect success.");
    websocketsend({
        topic: {
            sname: SERVER_NAME,
            skey: SERVER_KEY
        }
    })

}

function reconnect() {
    lock++
    time = navigator.onLine ? 3000 : 10000
    text = navigator.onLine ? '链接丢失等待第' + lock + '次重新链接！' : '您与互联网断开连接，等待重新连接互联网！'
        // loading = Loading.service({
        //     lock:true,
        //     fullscreen:true,
        //     text:text,
        //     background:'rgba(0, 0, 0, 0.8)',
        //     spinner:'el-icon-loading'
        // });
    if (lock < 2000) {
        setTimeout(() => {
            initWebSocket();
            // Vue.prototype.$getWebsocketData(Vue.prototype.modulecode[router.history.current.name]);
        }, time)
    } else {
        location.reload()
    }
}


Vue.prototype.$getCurrentDate = function getCurrentDate(time) {
    let date = time ? new Date(time) : new Date();
    let Y = date.getFullYear() + "-";
    let M =
        (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1) + "-";
    let D = ("0" + date.getDate()).slice(-2) + " ";
    let h = ("0" + date.getHours()).slice(-2) + ":";
    let m = ("0" + date.getMinutes()).slice(-2) + ":";
    let s = ("0" + date.getSeconds()).slice(-2);
    return Y + M + D + h + m + s;
};