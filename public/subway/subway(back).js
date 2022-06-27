;(function(global, undefined) {
    "use strict"
    var _global,panZoom,state,time,func = [],arrowHref = 'http://localhost:9528/subway/arrow.png',turnHref= 'http://localhost:9528/subway/turn.png';

    function loadJS( url, callback ){
        var script = document.createElement('script'),
            fn = callback || function(){};
        script.type = 'text/javascript';
        //IE
        if(script.readyState){
            script.onreadystatechange = function(){
                if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                    script.onreadystatechange = null;
                    fn();
                }
            };
        }else{
            //其他浏览器
            script.onload = function(){
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function tct_subway(opt){
        var self = this
        loadJS('http://localhost:9528/subway/jquery.min.js',function(){
            loadJS('http://localhost:9528/subway/svg-pan-zoom.min.js',function(){
                self._initial(opt);
            })
        });
    }
    
    tct_subway.prototype = {
        constructor: this,
        xml:null,
        id:null,
        showfull:false,
        _initial:function(opt){
            var _self = this
            this.__proto__.id = opt.tmpId
            this._generate('g',{'id':'subwayMain'},opt.tmpId)
            if(opt.fullload) {
                this.__proto__.showfull = true
                var btn = "<div class='btn'><p><span class='sub sub1'>舒适</span><span class='sub sub2'>较舒适</span><span class='sub sub3'>轻度拥挤</span><span class='sub sub4'>拥挤</span><span class='parent'>满载率</span></p></div>"
                $('#' + opt.tmpId).after(btn)
                $('.parent').on('click',function(){
                    $('.btn').stop().animate({
                        width:$('.btn').width() == 87 ? 415 : 87
                    },300,function(){
                        _self.clearFlyLine()
                        if($('.btn').width() == 87){
                            $('#normal').show()
                            $('#fullLoad').hide()
                        }else{
                            $('#normal').hide()
                            $('#fullLoad').show()
                        }    
                    })
                })
            }
            $.ajax({
                // url: "beijing.xml",
                url: "http://localhost:9528/subway/beijing.xml",
                dataType: 'xml',
                type: 'GET',
                timeout: 5000,
                error: function(xml){
                    alert("加载XML文件出错！");
                },
                success: function(xml){
                    _self.__proto__.xml = xml;
                    _self._generate('g',{'id':'normal','class':'normal'},'subwayMain')
                    _self._generate('g',{'id':'image'},'subwayMain')
                    _self._generate('g',{'id':'fullLoad'},'subwayMain')
                    _self._generate('g',{'id':'lineName'},'subwayMain')
                    _self._generate('g',{'id':'stationPoint'},'subwayMain')
                    _self._generate('g',{'id':'stationName'},'subwayMain')
                    _self._generate('g',{'id':'arrow'},'subwayMain')
                    _self._getLine()
                }
            });
        },
        _getLine:function(){
            var _self = this
            $(this.xml).find('l').each(function(){
                var self = this
                _self._drewStation(this.attributes)
                for (let index = 0; index < this.children.length; index++) {
                    if(this.children[index].attributes.acc.value){//描绘点位
                        _self._drewStationPoint(self.attributes,this.children[index].attributes)
                        _self._drewStationName(self.attributes,this.children[index].attributes)
                        if(index < this.children.length - 1){
                            if(_self.showfull){
                                _self._drewFullLoad(self.attributes,this.children,index,index + 1)
                            }
                        }
                    }
                    if(this.children[index].attributes.arc){//描绘曲线
                        _self._drewCurve(self.attributes,this.children,index,index + 1)
                    }else{
                        if(index < this.children.length - 1){//描绘直线
                            _self._drewLine(self.attributes,this.children,index,index + 1)
                        }
                    }
                }
                if(this.attributes.loop.value == 'true'){//回环补全一站
                    _self._drewLine(this.attributes,this.children,this.children.length - 1,0)
                    if(_self.showfull){
                        _self._drewFullLoad(this.attributes,this.children,this.children.length - 1,0)
                    }
                }
            })
            this._generate('image',{'href':'http://localhost:9528/subway/tam.png','width':85,'height':26,'x':908,'y':758},'image')
            this._generate('image',{'href':'http://localhost:9528/subway/north.png','width':50,'height':100,'x':1710,'y':250},'image')
            this._generate('image',{'href':'http://localhost:9528/subway/airport.png','width':40,'height':40,'x':1510,'y':355},'image')
            this._generate('image',{'href':'http://localhost:9528/subway/airport.png','width':40,'height':40,'x':1000,'y':1228},'image')
            panZoom = svgPanZoom('#subway',{zoomEnabled: true,dblClickZoomEnabled:false,minZoom:.9,maxZoom:4,fit:false});
            panZoom.pan({x: -950 + window.innerWidth/2, y: -770 + window.innerHeight/2});
            panZoom.zoom(.9)
        },
        _drewLine:function(parent,data,index,next){
            this._generate('line',{'id':data[index].attributes.acc.value,'x1':data[index].attributes.x.value,'y1':data[index].attributes.y.value,'x2':data[next].attributes.x.value,'y2':data[next].attributes.y.value,'stroke':parent.lc.nodeValue.replace("0x", "#"),'stroke-width':5,'stroke-linejoin':'round','stroke-linecap':'round','lineId':Number(parent.lcode.value)},'normal')
        },
        _drewCurve:function(parent,data,index,next) {
            this._generate('path',{'id':data[index].attributes.acc.value,'d':'M' + data[index].attributes.x.value + ' ' + data[index].attributes.y.value + ' Q' +  data[index].attributes.arc.value.replace(":", " ") + ' ' + data[next].attributes.x.value + ' ' + data[next].attributes.y.value,'stroke':parent.lc.nodeValue.replace("0x", "#"),'stroke-width':5,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none','lineId':Number(parent.lcode.value)},'normal')
        },
        _drewStation:function(data){
            var self = this
            var _arry = data.lp.value.split(';')
            var _state = data.slb.value.split(';')
            _state = _state[0].split(',')
            for (let index = 0; index < _arry.length; index++) {
                var str = _arry[index].split(',')
                self._generate('rect',{'lineId':Number(data.lcode.nodeValue),'fill':data.lc.nodeValue.replace("0x", "#"),'width':str[2],'height':str[3],'x':str[0],'y':str[1]},'lineName')
                if (Number(data.lcode.nodeValue) <= 57)
                    if(_state[index] != '大兴')
                        state = "地铁" + _state[index] + "号线";
                    else{
                        state = "地铁" + _state[index] + "线";
                    }
                else {
                    if (_state[index] == "首都机场")
                        state = _state[index]+"线";
                    else if (_state[index] == "大兴机场")
                        state = _state[index]+"线";
                    else
                        state = "地铁"+_state[index]+"线";
                }
                self._generate('text',{'lineId':Number(data.lcode.nodeValue),'fill':'white','font-family':'微软雅黑','font-size':12,'text-anchor':'middle','x':Number(str[0]) + 35,'y':Number(str[1]) + 14,'sdata':state,'lb':data.lb.value,'lbx':data.lbx.value,'lby':data.lby.value,'type':'line'},'lineName',state)

            }
        },
        _drewStationPoint:function(parent,data){
            if(data.ex.value == 'true'){
                this._generate('image',{'id':data.acc.value,'href':turnHref,'width':14,'height':14,'x':data.dx ? Number(data.x.value) - 7 + Number(data.dx.value) : Number(data.x.value) - 7,'y':data.dy ? Number(data.y.value) - 7 + Number(data.dy.value) : Number(data.y.value) - 7,'sdata':data.lb.value,'type':'station','lineId':Number(parent.lcode.value),'sort':parent.sort.value},'stationPoint')
            }else{
                this._generate('circle',{'id':data.acc.value,'fill':'white','r':4,'stroke':'black','stroke-width':1,'cx':Number(data.x.value),'cy':Number(data.y.value),'sdata':data.lb.value,'type':'station','lineId':Number(parent.lcode.value),'sort':parent.sort.value},'stationPoint')
            }
        },
        _drewStationName:function(parent,data){
            this._generate('text',{'id':data.acc.value,'font-family':'微软雅黑','x':Number(data.x.value) + Number(data.rx.value),'y':Number(data.y.value) + Number(data.ry.value) + 15,'fill':'#000','font-size':12,'lineId':Number(parent.lcode.value)},'stationName',data.lb.value)
        },
        _drewFullLoad:function(parent,data,index,next){
            var self = this
            var _x = Number(data[index].attributes.x.value)
            var _y = Number(data[index].attributes.y.value)
            var _uox = Number(data[index].attributes.uox.value)
            var _uoy = Number(data[index].attributes.uoy.value)
            var _dox = Number(data[index].attributes.dox.value)
            var _doy = Number(data[index].attributes.doy.value)
            var dom = document.createElementNS('http://www.w3.org/2000/svg','g')
            dom.setAttribute('id',data[index].attributes.acc.value + 'full')
            document.getElementById('fullLoad').appendChild(dom);
            if(data[index].attributes.arc != undefined){
                var arr = data[index].attributes.arc.value.split(',')[0].split(':')
                var urc = data[index].attributes.uoarc.value.split(',')[0].split(':')
                var drc = data[index].attributes.doarc.value.split(',')[0].split(':')
                this._generate('path',{'id':'up','d':'M' + (_x + 2 * _uox) + ' ' + (_y + 2 * _uoy) + ' Q' + (Number(arr[0]) + 2 * urc[0]) + ' ' + (Number(arr[1]) + 2 * urc[1]) + ' ' + (Number(data[next].attributes.x.value) + 2 * Number(data[next].attributes.uox.value)) + ' ' + (Number(data[next].attributes.y.value) + 2 * Number(data[next].attributes.uoy.value)),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none'},data[index].attributes.acc.value + 'full')
                this._generate('path',{'id':'down','d':'M' + (_x + 2 * _dox) + ' ' + (_y + 2 * _doy) + ' Q' + (Number(arr[0]) + 2 * drc[0]) + ' ' + (Number(arr[1]) + 2 * drc[1]) + ' ' + (Number(data[next].attributes.x.value) + 2 * Number(data[next].attributes.dox.value)) + ' ' + (Number(data[next].attributes.y.value) + 2 * Number(data[next].attributes.doy.value)),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none'},data[index].attributes.acc.value + 'full')
            }else{
                this._generate('line',{'id':'up','x1':_x + 2 * _uox,'y1':_y + 2 * _uoy,'x2':Number(data[next].attributes.x.value) + 2 * Number(data[next].attributes.uox.value),'y2':Number(data[next].attributes.y.value) + 2 * Number(data[next].attributes.uoy.value),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},data[index].attributes.acc.value + 'full')
                this._generate('line',{'id':'down','x1':_x + 2 * _dox,'y1':_y + 2 * _doy,'x2':Number(data[next].attributes.x.value) + 2 * Number(data[next].attributes.dox.value),'y2':Number(data[next].attributes.y.value) + 2 * Number(data[next].attributes.doy.value),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},data[index].attributes.acc.value + 'full')
            }
            for (let i = index + 1; i < data.length; i++) {
                if(data[i].attributes.acc.value == ''){
                    var _x = Number(data[i].attributes.x.value)
                    var _y = Number(data[i].attributes.y.value)
                    var _uox = Number(data[i].attributes.uox.value)
                    var _uoy = Number(data[i].attributes.uoy.value)
                    var _dox = Number(data[i].attributes.dox.value)
                    var _doy = Number(data[i].attributes.doy.value)
                    if(data[i].attributes.arc != undefined){
                        var arr = data[i].attributes.arc.value.split(',')[0].split(':')
                        var urc = data[i].attributes.uoarc.value.split(',')[0].split(':')
                        var drc = data[i].attributes.doarc.value.split(',')[0].split(':')
                        self._generate('path',{'id':'up','d':'M' + (_x + 2 * _uox) + ' ' + (_y + 2 * _uoy) + ' Q' + (Number(arr[0]) + 2 * urc[0]) + ' ' + (Number(arr[1]) + 2 * urc[1]) + ' ' + (Number(data[i + 1].attributes.x.value) + 2 * Number(data[i + 1].attributes.uox.value)) + ' ' + (Number(data[i + 1].attributes.y.value) + 2 * Number(data[i + 1].attributes.uoy.value)),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none'},data[index].attributes.acc.value + 'full')
                        self._generate('path',{'id':'down','d':'M' + (_x + 2 * _dox) + ' ' + (_y + 2 * _doy) + ' Q' + (Number(arr[0]) + 2 * drc[0]) + ' ' + (Number(arr[1]) + 2 * drc[1]) + ' ' + (Number(data[i + 1].attributes.x.value) + 2 * Number(data[i + 1].attributes.dox.value)) + ' ' + (Number(data[i + 1].attributes.y.value) + 2 * Number(data[i + 1].attributes.doy.value)),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none'},data[index].attributes.acc.value + 'full')
        
                    }else{
                        self._generate('line',{'id':'up','x1':_x + 2 * _uox,'y1':_y + 2 * _uoy,'x2':Number(data[i + 1].attributes.x.value) + 2 * Number(data[i + 1].attributes.uox.value),'y2':Number(data[i + 1].attributes.y.value) + 2 * Number(data[i + 1].attributes.uoy.value),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},data[index].attributes.acc.value + 'full')
                        self._generate('line',{'id':'down','x1':_x + 2 * _dox,'y1':_y + 2 * _doy,'x2':Number(data[i + 1].attributes.x.value) + 2 * Number(data[i + 1].attributes.dox.value),'y2':Number(data[i + 1].attributes.y.value) + 2 * Number(data[i + 1].attributes.doy.value),'stroke':'#79be85','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'},data[index].attributes.acc.value + 'full')
                    }
                }else{
                    break
                }
            }
        },
        _generate:function(element,obj,tag,inner){
            var self = this
            var xx = 0
            var dom = document.createElementNS('http://www.w3.org/2000/svg',element)
            for (var key in obj) {
                dom.setAttribute(key,obj[key])
            }
            if(inner)
                dom.innerHTML = inner
            dom.onmousedown = function(){
                xx = panZoom.getPan().x
            }
            dom.onmouseup = function(e){
                if(panZoom.getPan().x == xx){
                    obj.rx = e.clientX
                    obj.ry = e.clientY
                    obj = JSON.parse(JSON.stringify(obj))
                    switch (obj.type) {
                        case 'line':
                            self._events('lineName.touch',obj)
                        break;
                        case 'station':
                            self._events('station.touch',obj)
                        break;
                        case 'mask':
                            self._events('mask')
                        default:
                        break;
                    }
                }
            }
            document.getElementById(tag).appendChild(dom);
        },
        _events: function (event,info){
            var _w = document.getElementById('subwayMain').getBBox().width
            var _h = document.getElementById('subwayMain').getBBox().height
            var _info = {}
            if(info){
                if(info.id){
                    _info.id = info.id
                    _info.x = info.x ? info.x : info.cx
                    _info.y = info.y ? info.y : info.cy
                    _info.rx = info.rx
                    _info.ry = info.ry
                    _info.line = {
                        lineId:info.lineId
                    }
                }else{
                    _info.lineId = info.lineId
                }
                _info.sdata = info.sdata ? info.sdata : ''
            }
            switch (event) {
                case 'lineName.touch':
                    $('#background,#select').remove()
                    this._generate('g',{'id':'background'},'subwayMain')
                    this._generate('rect',{'id':'eventsBg','x':-30,'y':135,'width':_w,'height':_h,'fill':'#fff','fill-opacity':0.8,'type':'mask'},'background')
                    this._generate('g',{'id':'select'},'subwayMain')
                    $('#subwayMain g').children().each(function(e,i){
                        if(i.attributes.lineId && i.attributes.lineId.value == info.lineId){
                            var _dom = i.cloneNode(true)
                            document.getElementById('select').appendChild(_dom);
                        }
                    })
                    this._getCenterLine(info)
                    _callback()
                break;
                case 'station.touch':
                    $('#background,#select').remove()
                    this._generate('g',{'id':'background'},'subwayMain')
                    this._generate('rect',{'id':'eventsBg','x':-30,'y':135,'width':_w,'height':_h,'fill':'#fff','fill-opacity':0.8,'type':'mask'},'background')
                    this._generate('g',{'id':'select'},'subwayMain')
                    $('#subwayMain g').children().each(function(e,i){
                        if(i.attributes.id && i.attributes.id.value == info.id && i.nodeName != 'line' && i.nodeName != 'path'){
                            var _dom = i.cloneNode(true)
                            document.getElementById('select').appendChild(_dom);
                        }
                    })
                    _callback()
                break;
                case 'mask':
                    $('#background,#select').remove()
                    _callback()
                break;
                default:
                break;
            }
            
            //do something
            function _callback(){
                for (let index = 0; index < func.length; index++) {
                    if(func[index].event == event){
                        func[index].callback(_info)
                    }
                }
            }
        },
        _resize:function(){
            panZoom.resize();
            panZoom.fit();
            panZoom.zoom(1.2)
            panZoom.center();
        },
        _getCenterLine:function(params){
            var self = this
            var allLine = $(this.__proto__.xml).find('l')
            var pan = panZoom.getPan();
            var zoom = panZoom.getZoom();
            for (let index = 0; index < allLine.length; index++) {
                if(params.lb == allLine[index].attributes.lb.value){
                    self._animatePan({sx: pan.x, sy: pan.y, tx: (-params.lbx*zoom)+window.innerWidth/2, ty: (-params.lby*zoom)+window.innerHeight/2})
                }
            }
        },
        _animatePan:function(amount){
            var animationTime = 300; // ms
            var animationStepTime = 15; // one frame per 30 ms
            var animationSteps = animationTime / animationStepTime;
            var animationStep = 0;
            var intervalID = null;
            var stepX = (amount.tx - amount.sx) / animationSteps;
            var stepY = (amount.ty - amount.sy) / animationSteps;

            intervalID = setInterval(function() {
                if (animationStep++ < animationSteps) {
                    panZoom.panBy({x: stepX, y: stepY});
                } else {
                    clearInterval(intervalID);
                }
            }, animationStepTime);
        },
        addFlyLine:function(from,to,config){
            var self = this
            var fx = Number(from.x)
            var fy = Number(from.y)
            var _w = document.getElementById('subwayMain').getBBox().width
            var _h = document.getElementById('subwayMain').getBBox().height
            var _DOM = ''
            var fly = 'fly' + config
            var color = ['#028101','#009BC0']
            
            if($('#select').length == 0){
                this._generate('g',{'id':'background'},'subwayMain')
                this._generate('rect',{'id':'eventsBg','x':-30,'y':135,'width':_w,'height':_h,'fill':'#fff','fill-opacity':0.8},'background')
                this._generate('g',{'id':'select'},'subwayMain')
            }

            // $('#background,#select').remove()

            $('#subwayMain #stationName').children().each(function(e,i){
                if(i.attributes.id && i.attributes.id.value == from.id && i.nodeName != 'line' && i.nodeName != 'path'){
                    var _dom = i.cloneNode(true)
                    document.getElementById('select').appendChild(_dom);
                }
                
                for (let index = 0; index < to.length; index++) {
                    if(i.attributes.id && i.attributes.id.value == to[index].id && i.nodeName != 'line' && i.nodeName != 'path' && i.localName == 'text'){
                        var _dom = i.cloneNode(true)
                            _dom.textContent = _dom.textContent + '(' + to[index].detail + ')'
                            _dom.attributes.fill.value = color[config]
                            // _dom.textContent.appendChild('<tspan x="10" y="45" style="fill:#000;">111</tspan>')
                        
                        console.log($('#select #' + _dom.attributes.id.value).length);
                        if($('#select #' + _dom.attributes.id.value).length){
                            _dom.attributes.y.value = parseInt(_dom.attributes.y.value) + 11
                        }
                        document.getElementById('select').appendChild(_dom);
                        continue;
                    }
                }
            })
            
            this._generate('g',{'id':fly},'subwayMain')
            for (let index = 0; index < 3; index++) {
                this._generate('circle',{'id':fly + 'to' + index,'cx':fx,'cy':fy,'stroke':color[config],'stroke-width':1,'fill-opacity':'0'},fly)
                if(index > 0){
                    this._generate('animate',{'attributeName':'r','begin':'ani1.begin + ' + index*0.5 + 's','from':4,'to':20,'dur':'3s','repeatCount':'indefinite'},fly + 'to' + index)
                    this._generate('animate',{'attributeName':'opacity','begin':'ani1.begin + ' + index*0.5 + 's','from':1,'to':0,'dur':'3s','repeatCount':'indefinite'},fly + 'to' + index)
                }else{
                    this._generate('animate',{'attributeName':'r','id':'ani1','begin':0,'from':4,'to':20,'dur':'3s','repeatCount':'indefinite'},fly + 'to' + index)
                    this._generate('animate',{'attributeName':'opacity','begin':0,'from':1,'to':0,'dur':'3s','repeatCount':'indefinite'},fly + 'to' + index)
                }
            }
            
            for (let index = 0; index < to.length; index++) {
                var tx = Number(to[index].x)
                var ty = Number(to[index].y)
                var id = to[index].name
                this._generate('g',{'id':id + fly},fly)
                this._generate('path',{'id':id + fly + 'parent','d':'M' + fx + ' ' + fy + ' Q' + ((fx - tx ) / 2 + tx) + ' ' + ty + ' ' + tx + ' ' + ty,'stroke':color[config],'stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round','fill':'none'},id + fly)
                this._generate('path',{'id':id + fly + 'path','d':'M0,0 L4,6 L0,12 L12,6 L0,0','fill':color[config],'transform':'translate(-6,-6)'},id + fly)
                if(config == 1){
                    this._generate('animateMotion',{'path':'M' + tx + ' ' + ty + ' Q' + ((fx - tx ) / 2 + tx) + ' ' + ty + ' ' + fx + ' ' + fy,'begin':index*0.5 + 's','dur':'5s','rotate':'auto','repeatCount':'indefinite'},id + fly + 'path')                   
                }else{
                    this._generate('animateMotion',{'path':'M' + fx + ' ' + fy + ' Q' + ((fx - tx ) / 2 + tx) + ' ' + ty + ' ' + tx + ' ' + ty,'begin':index*0.5 + 's','dur':'5s','rotate':'auto','repeatCount':'indefinite'},id + fly + 'path')                   
                }
                this._generate('circle',{'id':id + 'point','cx':tx,'cy':ty,'r':3,'stroke':color[config],'fill':'#fff','stroke-width':2,'fill-opacity':1},fly)
            }
            this._generate('circle',{'id':'to','cx':fx,'cy':fy,'r':5,'stroke':color[config],'fill':'#fff','stroke-width':4,'fill-opacity':1},fly)
        },
        clearFlyLine:function(){
            $('#background,#select,#fly0,#fly1').remove()
        },
        loadRateMultiply:function(from,to,num){
            var self = this
            if(this.__proto__.showfull){
                if($('.btn').width() == 87){
                    $('.parent').click()
                    showMultiply()
                }else{
                    showMultiply()
                }
            }else{
                alert('请先开启客流开关！')
            }
            function getColor(num) {
                if(num >= 0 && num <= 25){
                    return '#79be85'
                }else if(num > 25 && num <= 50){
                    return '#f1d44b'
                }else if(num > 50 && num <= 75){
                    return '#de8c17'
                }else if(num > 75){
                    return '#d0000f'
                }
            }
            function showMultiply(){
                var id,next;
                for (let index = 0; index < from.line.length; index++) {
                    for (let i = 0; i < to.line.length; i++) {
                        if(from.line[index].lineId == to.line[i].lineId){
                            if(from.line[index].lineId == 98){
                                switch (from.line[index].id) {
                                    case 151020053:
                                        switch (to.line[i].id) {
                                            case 151020055://东直门至三元桥
                                                drewMultiply('#151020053full')
                                            break;
                                        }
                                    break;
                                    case 151020055:
                                        switch (to.line[i].id) {
                                            case 151020053://三元桥至东直门
                                                drewMultiply('#151020061full')
                                            break;
                                            case 151020057://三元桥至3号航站楼
                                                drewMultiply('#151020055full')
                                            break;
                                        }
                                    break;
                                    case 151020057:
                                        switch (to.line[i].id) {
                                            case 151020059://3号航站楼至2号航站楼
                                                drewMultiply('#151020057full')
                                            break;
                                        }
                                    break;
                                    case 151020059:
                                        switch (to.line[i].id) {
                                            case 151020055://2号航站楼至三元桥
                                                drewMultiply('#151020059full')
                                            break;
                                        }
                                    break;
                                }
                            }else{
                                console.log(from.line[index],to.line[i]);
                                if(from.line[index].id > to.line[i].id){
                                    next = true
                                    id = to.line[i].id
                                    if(from.line[index].id > to.line[i].id + 3){
                                        next = false
                                        id = from.line[index].id
                                    }
                                }else{
                                    next = false
                                    id = from.line[index].id
                                    if(from.line[index].id < to.line[i].id - 3){
                                        next = true
                                        id = to.line[i].id
                                    }
                                }
                                drewMultiply('',from.line[index].lineId)
                            }
                        }
                    }
                }
                function drewMultiply(tagId,lineid) {
                    if(tagId){
                        $(tagId).children().each(function(e,i){
                            i.attributes.stroke.value = getColor(num)
                            // pushArrow(i)
                        })
                    }else{
                        $('#subwayMain g').children().each(function(e,i){
                            if(i.attributes.id && i.attributes.id.value == id + 'full'){
                                for (let index = 0; index < i.childNodes.length; index++) {
                                    if(i.childNodes[index].id == 'down' && next){
                                        i.childNodes[index].attributes.stroke.value = getColor(num)
                                        // pushArrow(i.childNodes[index],'down',lineid)
                                    }else if(i.childNodes[index].id == 'up' && !next){
                                        i.childNodes[index].attributes.stroke.value = getColor(num)
                                        // pushArrow(i.childNodes[index],'up',lineid)
                                    }
                                    
                                }
                            }
                        })
                    }
                }
            }
            function pushArrow(params,direction,lineid) {
                console.log(params,direction,lineid);
                if(params.localName == 'line'){
                    var rx1 = Number(params.attributes.x1.value)
                    var rx2 = Number(params.attributes.x2.value)
                    var ry1 = Number(params.attributes.y1.value)
                    var ry2 = Number(params.attributes.y2.value)
                    var x = Math.abs((rx1 - rx2) / 2) + (rx1 >= rx2 ?  rx2 : rx1)
                    var y = Math.abs((ry1 - ry2) / 2) + (ry1 >= ry2 ?  ry2 : ry1)
                    var rotate,sc,aa;
                    
                    if((rx1 == rx2)){//竖线细分从上至下和从下至上
                        if((ry1 > ry2)){//从下向上竖线
                            rotate = 'down'
                        }else{//从上向下竖线
                            rotate = 'up'
                        }
                        x-=1.5
                        y-=4.5
                    }else if((ry1 == ry2)){//横线细分从左至右和从右至左
                        if((rx1 > rx2)){//从右向左横线
                            rotate = 'right'
                        }else{//从左向右横线
                            rotate = 'left'
                        }
                        x-=4.5
                        y-=1.5
                    }else{
                        sc = Math.sqrt(Math.abs(ry1 - ry2) * Math.abs(ry1 - ry2) + Math.abs(rx1 - rx2) * Math.abs(rx1 - rx2));
                        aa = Number(Math.asin(Math.abs(ry1 - ry2)/sc) * 180 / Math.PI);
                    }
                    console.log(rotate,direction,aa);
                    if(lineid == 10 || lineid == 2 || lineid == 13 || lineid == 15 || lineid == 74 || lineid == 91){
                        console.log(direction);
                        switch (rotate) {
                            case 'down':
                                if(direction == 'up'){
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(90,1.5 1.5)'},'arrow')
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(-90,4.5 4.5)'},'arrow')
                                }
                            break;
                            case 'up':
                                if(direction == 'up'){
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(-90,4.5 4.5)'},'arrow')
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(90,1.5 1.5)'},'arrow')
                                }
                            break;
                            case 'left':
                                if(direction == 'up'){
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(180,4.5 1.5)'},'arrow')
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ')'},'arrow')
                                }
                            break;
                            case 'right':
                                if(direction == 'up'){
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ')'},'arrow')
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(180,4.5 1.5)'},'arrow')
                                }
                            break;
                        }
                    }else{
                        if(direction == 'up'){
                            if(rotate == 'left' || rotate == 'right'){
                                self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(180,4.5 1.5)'},'arrow')
                            }else{
                                if(aa){
                                    if(rx1 > rx2){
                                        self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(' + (90 + aa) + ',2.3 -.1)'},'arrow')
                                    }else{
                                        self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(' + (180 + aa) + ',3 2.2)'},'arrow')
                                    }
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(270,4.5 4.5)'},'arrow')
                                }
                            }
                        }else{
                            if(rotate == 'left' || rotate == 'right'){
                                self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ')'},'arrow')
                            }else{
                                if(aa){
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(' + aa + ',4 -4)'},'arrow')
                                }else{
                                    self._generate('image',{'href':arrowHref,'width':9,'height':3,'way':direction,'transform':'translate(' + x + ',' + y + ') rotate(90,1.5 1.5)'},'arrow')
                                }
                            }
                        }
                    }                    
                }else{

                }
            }
        },
        getPosition:function(id){
            // var p = new Promise(function(resolve,reject){
            //     setTimeout(()=>{
            //         var cb = []
            //         $('#subwayMain g').children().each(function(e,i){
            //             if(i.attributes.type && i.attributes.type.value == 'station'){
            //                 if(!isNaN(Number(id))){
            //                     if(i.attributes.id && i.attributes.id.value === id){
            //                         cb = {
            //                             x:i.attributes.cx ? Number(i.attributes.cx.value) : Number(i.attributes.x.value),
            //                             y:i.attributes.cy ? Number(i.attributes.cy.value) : Number(i.attributes.y.value)
            //                         }
            //                     }
            //                 }else{
            //                     if(i.attributes.sdata && i.attributes.sdata.value === id){
            //                         cb.push({
            //                             x:i.attributes.cx ? Number(i.attributes.cx.value) : Number(i.attributes.x.value),
            //                             y:i.attributes.cy ? Number(i.attributes.cy.value) : Number(i.attributes.y.value)
            //                         })
            //                     }
            //                 }
            //             }
            //         })
            //         resolve(cb)
            //     },400)
            // })
            // return p
            var cb = {}
            var tmp = []
            var ax = parseFloat($('#subwayMain').css('transform').substring(7).split(',')[4])
            var ay = parseFloat($('#subwayMain').css('transform').substring(7).split(',')[5])
            $('#subwayMain g').children().each(function(e,i){
                if(i.attributes.type && i.attributes.type.value == 'station'){
                    if(i.attributes.id && i.attributes.id.value === id){
                        tmp.push(i)
                    }else if(i.attributes.sdata && i.attributes.sdata.value === id){
                        tmp.push(i)
                    }
                }
            })
            setInfo(tmp)
            function setInfo(i){
                cb = {
                    x:i[0].attributes.cx ? Number(i[0].attributes.cx.value) : Number(i[0].attributes.x.value),
                    y:i[0].attributes.cy ? Number(i[0].attributes.cy.value) : Number(i[0].attributes.y.value),
                    id:Number(i[0].attributes.id.value),
                    name:i[0].attributes.sdata.value,
                    line:[]
                }
                if(i[0].localName == 'image'){
                    cb.x = cb.x + 7
                    cb.y = cb.y + 7
                    cb.rx = cb.x + ax
                    cb.ry = cb.y + ay
                }
                for (let index = 0; index < tmp.length; index++) {
                    var x = {}
                    x.id = Number(tmp[index].attributes.id.value)
                    x.lineId = Number(tmp[index].attributes.lineId.value)
                    x.sort = tmp[index].attributes.sort.value
                    cb.line.push(x)
                }
            }
            return cb
        },
        on:function(event,callback){
            func.push({event,callback})
        },
        listener:function(event,callback){
            var self = this
            // if($('#subwayMain g').length > 0){
            if(document.getElementsByClassName('normal').length > 0){
                callback()
            }else{
                setTimeout(()=>{
                    self.listener(event,callback)
                })
            }
        },
        showLine:function(id) {
            var _w = document.getElementById('subwayMain').getBBox().width
            var _h = document.getElementById('subwayMain').getBBox().height
            $('#background,#select').remove()
            this._generate('g',{'id':'background'},'subwayMain')
            this._generate('rect',{'id':'eventsBg','x':-30,'y':135,'width':_w,'height':_h,'fill':'#fff','fill-opacity':0.8,'type':'mask'},'background')
            this._generate('g',{'id':'select'},'subwayMain')
            $('#subwayMain g').children().each(function(e,i){
                if(i.attributes.lineId && i.attributes.lineId.value == id){
                    var _dom = i.cloneNode(true)
                    document.getElementById('select').appendChild(_dom);
                }
            })
        }
    }
    window.onresize = function(){
        // tct_subway.prototype._resize()
    }
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = tct_subway;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return tct_subway;});
    } else {
        !('tct_subway' in _global) && (_global.tct_subway = tct_subway);
    }
}());