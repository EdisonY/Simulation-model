<template>
    <div class="container">
        <div class="header">
            <h1>{{diagramName}}</h1>
        </div>
        <div ref="middle"
            class="middle">
            <div ref="diagram"
                class="diagram">
                <svg ref="svg_station"
                    id="svg_station"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1" />
                <div ref="diagram-data"
                    class="diagram-data">
                    <svg ref="svg_data"
                        style="display:none"
                        id="svg_data"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1" />
                </div>
            </div>
            <div ref="info-panel"
                class="info-panel"
                v-show="pointLineVisible && realInfo && realInfo.data.length>0">
                <h3>时间 {{realInfo.time}}</h3>
                <div v-for="d in realInfo.data"
                    :style="{backgroundColor:d.dir==170?'rgb(190, 19, 71)':'rgb(88, 134, 231)'}">服务号:{{d.serveNo}}-车次号:{{d.tripNo}}-{{d.station.name}}-{{d.dir}}-晚点:{{d.late}}</div>
            </div>
        </div>
        <div class="footer">
        </div>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: [
        "diagramName",
        "stations",
        "planData",
        "realData",
        "forecastData",
        "diagramConfig",
        "maxTime",
        "forcastTime",
        "autoMode",
    ],
    data() {
        return {
            pointLineVisible: false,
            realInfo: { time: "00:00", data: [] },
            scaleX: 0.5,
            CHART_CONFIG: {
                MainLineColor: "black",
                AxisTextColor: "#666",
                Colors: [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3",
                ],
                TripNoColor: "#005",
            },
            SVG_STATION: null,
            SVG_DATA: null,
            INFO_PANEL: null,
            DIAGRAM_STATIC: {
                StaionName: {},
            }, // YAxisMain \ XAxisMain \ StaionName{1} \ Height \ PointLine \ PointLineX
            TRIPS: [],
            TRIPS_TEXT: [],
            REAL_SEGMENT: [],
            FORECAST_SEGMENT: [],
            CURRENT_TIME_LINE: null,
            FORCAST_TIME_LINE: null,
            stationMap: {},
            hasInit: false,
        };
    },
    mounted() {
        this.SVG_STATION = this.$refs.svg_station;
        this.SVG_DATA = this.$refs.svg_data;
        this.SVG_DATA.setAttribute("width", `${86400 * this.scaleX + 40}px`);
        this.INFO_PANEL = this.$refs["info-panel"];
        //this.initDiagram();
    },
    methods: {
        initDiagram() {
            // 0. 先清除所有元素
            this.SVG_STATION.innerHTML = "";
            this.SVG_DATA.innerHTML = "";
            this.TRIPS = [];
            this.TRIPS_TEXT = [];
            this.REAL_SEGMENT = [];
            this.FORECAST_SEGMENT = [];
            this.CURRENT_TIME_LINE = null;
            this.FORCAST_TIME_LINE = null;

            // 1. 设置svg高度
            this.SVG_DATA.style.display = "unset";
            let stationHeight = this.diagramConfig.stationHeight;
            let sideWidth = this.diagramConfig.sideWidth;
            let diagramHeight =
                stationHeight * this.stations.length +
                this.diagramConfig.bottomBlockHeight +
                this.diagramConfig.topBlockHeight;

            this.DIAGRAM_STATIC.Height = diagramHeight;

            this.SVG_STATION.setAttribute(
                "style",
                `width: ${sideWidth}px;height:${diagramHeight}px; !important`
            );

            this.SVG_DATA.setAttribute(
                "style",
                `height:${diagramHeight}px; !important`
            );

            // 2. 画图表框架
            // y主轴
            this.drawYAxisMainLine(
                sideWidth - 1,
                diagramHeight - this.diagramConfig.bottomBlockHeight,
                `stroke:${this.CHART_CONFIG.MainLineColor};stroke-width:1`
            );

            // x主轴
            this.drawXAxisMainLine(
                diagramHeight - this.diagramConfig.bottomBlockHeight,
                `stroke:${this.CHART_CONFIG.MainLineColor};stroke-width:1`
            );

            // 更新车站map \ 车站刻度 \ 横向条纹
            this.stations.forEach((s) => {
                let count = this.stations.indexOf(s) + 1;
                let y =
                    diagramHeight -
                    (this.diagramConfig.bottomBlockHeight +
                        count * this.diagramConfig.stationHeight);
                this.stationMap[s.id] = y;

                this.drawStationName(s, sideWidth / 2, y);
                this.drawHorizontalBack(y);
            });

            // 4. 横轴刻度线 \ 横轴时间 \ 纵向条纹
            let y = diagramHeight - this.diagramConfig.bottomBlockHeight;
            for (let i = 0; i <= 86400 * this.scaleX; i++) {
                if (i % (3600 * this.scaleX) == 0) {
                    let time = i / (3600 * this.scaleX);
                    this.drawTick(i, y, 10);
                    this.drawTickText(
                        i,
                        y + 25,
                        "font-size:20px;font-weight:bold;",
                        i == 0 ? "00" : `${time}:00`
                    );
                    this.drawVerticalBack(
                        i,
                        y,
                        "10,0",
                        "stroke:#777;stroke-width:1"
                    );
                } else if (i % (600 * this.scaleX) == 0) {
                    let hour = parseInt(i / (3600 * this.scaleX));
                    let time = (i % (3600 * this.scaleX)) / (60 * this.scaleX);
                    this.drawTick(i, y, 5);
                    this.drawTickText(
                        i,
                        y + 15,
                        "font-size:15px;font-weight:bold;",
                        `${hour}:${time}`
                    );
                    this.drawVerticalBack(i, y);
                } else if (i % (60 * this.scaleX) == 0) {
                    let time = (i / (60 * this.scaleX)) % (60 * this.scaleX);
                    this.drawTick(i, y, 5);
                    this.drawVerticalBack(i, y);
                    // if (time % 5 == 0) {
                    //     let hour = parseInt(i / (3600 * this.scaleX));
                    //     let minute = parseInt(
                    //         (i % (3600 * this.scaleX)) / (60 * this.scaleX)
                    //     );
                    //     this.drawTickText(
                    //         i,
                    //         y + 15,
                    //         "font-size:12px;",
                    //         `${hour}:${minute}:${time}`
                    //     );
                    // }
                }
            }

            if (!this.DIAGRAM_STATIC.PointLine) {
                this.drawPointLine(0, y);
            }

            // 5.设置滚动事件
            let middle = this.$refs.middle;
            middle.scrollTop = middle.scrollHeight;
            let diagram = this.$refs.diagram;
            let diagram_data = this.$refs["diagram-data"];
            diagram_data.scrollLeft = 0;
            diagram.onwheel = (evt) => {
                evt.preventDefault();
                //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
                let left = diagram_data.scrollLeft + evt.deltaY * 2;
                diagram_data.scrollLeft = left;
            };

            // 6. 设置鼠标移动和鼠标线绑定
            this.SVG_DATA.onmouseenter = (evt) => {
                if (this.DIAGRAM_STATIC.PointLine && evt.layerY < y) {
                    this.DIAGRAM_STATIC.PointLine.setAttribute("opacity", 1);
                    this.pointLineVisible = true;
                }
            };
            this.SVG_DATA.onmouseleave = (evt) => {
                if (this.DIAGRAM_STATIC.PointLine) {
                    this.DIAGRAM_STATIC.PointLine.setAttribute("opacity", 0);
                    this.pointLineVisible = false;
                }
            };
            this.SVG_DATA.onmousemove = (evt) => {
                let x = evt.layerX;
                this.DIAGRAM_STATIC.PointLineX = x;
                this.DIAGRAM_STATIC.PointLine.setAttribute("x1", x);
                this.DIAGRAM_STATIC.PointLine.setAttribute("x2", x);

                if (evt.layerY < y) {
                    this.DIAGRAM_STATIC.PointLine.setAttribute("opacity", 1);
                    this.pointLineVisible = true;
                } else {
                    this.DIAGRAM_STATIC.PointLine.setAttribute("opacity", 0);
                    this.pointLineVisible = false;
                }
                this.updateInfoPanel(evt);
            };

            this.hasInit = true;
        },
        drawPlanData() {
            if (!this.hasInit) {
                return;
            }

            // 清除旧的计划图
            this.TRIPS.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.TRIPS_TEXT.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.TRIPS = [];
            this.TRIPS_TEXT = [];

            this.planData.forEach((tripItem) => {
                let poliLineData = "";
                tripItem.data.forEach((d) => {
                    // 有时候后端返回的数据是错的，没有找到站，那么就不绘制
                    if (this.stationMap[d.sid]) {
                        poliLineData += ` ${d.arrive * this.scaleX},${
                            this.stationMap[d.sid]
                        } `;
                        poliLineData += ` ${d.depart * this.scaleX},${
                            this.stationMap[d.sid]
                        } `;
                    }
                });

                this.drawTrip(poliLineData, `fill:none;stroke:#666`);

                this.drawTripText(
                    tripItem.data[0].arrive * this.scaleX + 10,
                    this.stationMap[tripItem.data[0].sid] - 10,
                    `S:${tripItem.serveNo} T:${tripItem.tripNo}`,
                    null,
                    0
                );
            });
        },
        drawRealData() {
            if (!this.hasInit) {
                return;
            }

            // 清除旧的实际图
            this.REAL_SEGMENT.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.REAL_SEGMENT = [];

            this.realData.forEach((tripItem) => {
                if (tripItem.data.length > 0) {
                    for (let i = 0; i < tripItem.data.length - 1; i++) {
                        this.drawSegment(
                            tripItem.data[i].arrive * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i].depart * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            this.getLoadRateColor(
                                tripItem.data[i].loadrate / 10000
                            )
                        );
                        this.drawSegment(
                            tripItem.data[i].depart * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i + 1].arrive * this.scaleX,
                            this.stationMap[tripItem.data[i + 1].sid],
                            this.getLoadRateColor(
                                tripItem.data[i].loadrate / 10000
                            )
                        );
                    }
                    let lastI = tripItem.data.length - 1;
                    if (lastI > 0) {
                        this.drawSegment(
                            tripItem.data[lastI].arrive * this.scaleX,
                            this.stationMap[tripItem.data[lastI].sid],
                            tripItem.data[lastI].depart * this.scaleX,
                            this.stationMap[tripItem.data[lastI].sid],
                            this.getLoadRateColor(
                                tripItem.data[lastI].loadrate / 10000
                            )
                        );
                    }
                }
            });
        },
        drawforecastData() {
            if (!this.hasInit) {
                return;
            }

            // 清除旧的预测图
            this.FORECAST_SEGMENT.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.FORECAST_SEGMENT = [];

            this.forecastData.forEach((tripItem) => {
                if (tripItem.data.length > 0) {
                    for (let i = 0; i < tripItem.data.length - 1; i++) {
                        this.drawForecastSegment(
                            tripItem.data[i].arrive * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i].depart * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            "#1E90FF"
                        );
                        this.drawForecastSegment(
                            tripItem.data[i].depart * this.scaleX,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i + 1].arrive * this.scaleX,
                            this.stationMap[tripItem.data[i + 1].sid],
                            "#1E90FF"
                        );
                    }
                    let lastI = tripItem.data.length - 1;
                    if (lastI > 0) {
                        this.drawSegment(
                            tripItem.data[lastI].arrive * this.scaleX,
                            this.stationMap[tripItem.data[lastI].sid],
                            tripItem.data[lastI].depart * this.scaleX,
                            this.stationMap[tripItem.data[lastI].sid],
                            "#1E90FF"
                        );
                    }
                }
            });
        },
        updateInfoPanel(evt) {
            if (!this.hasInit) {
                return;
            }
            let filterData = [];

            this.realData.forEach((trip) => {
                for (let i = 0; i < trip.data.length; i++) {
                    if (
                        trip.data[i].arrive * this.scaleX <=
                            this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i].depart * this.scaleX >=
                            this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations.find((s) => {
                                return s.id == trip.data[i].sid;
                            }),
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    } else if (
                        trip.data[i + 1] &&
                        trip.data[i].depart * this.scaleX <
                            this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i + 1].arrive * this.scaleX >
                            this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations.find((s) => {
                                return s.id == trip.data[i].sid;
                            }),
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    }
                }
            });

            this.forecastData.forEach((trip) => {
                for (let i = 0; i < trip.data.length; i++) {
                    if (
                        trip.data[i].arrive * this.scaleX <=
                            this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i].depart * this.scaleX >=
                            this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations.find((s) => {
                                return s.id == trip.data[i].sid;
                            }),
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    } else if (
                        trip.data[i + 1] &&
                        trip.data[i].depart * this.scaleX <
                            this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i + 1].arrive * this.scaleX >
                            this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations.find((s) => {
                                return s.id == trip.data[i].sid;
                            }),
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    }
                }
            });
            this.realInfo = {
                time: this.secondToDate(
                    this.DIAGRAM_STATIC.PointLineX / this.scaleX
                ),
                data: filterData,
            };

            if (
                this.DIAGRAM_STATIC.Height -
                    this.diagramConfig.bottomBlockHeight >=
                evt.layerY + this.INFO_PANEL.offsetHeight + 10
            ) {
                this.INFO_PANEL.style.top = `${evt.clientY + 10}px`;
            } else {
                this.INFO_PANEL.style.top = `${
                    evt.clientY - this.INFO_PANEL.offsetHeight - 10
                }px`;
            }

            if (
                86400 * this.scaleX <
                evt.layerX + this.INFO_PANEL.offsetWidth + 10
            ) {
                this.INFO_PANEL.style.left = `${
                    evt.clientX - this.INFO_PANEL.offsetWidth - 10
                }px`;
            } else {
                this.INFO_PANEL.style.left = `${evt.clientX + 10}px`;
            }
        },

        secondToDate(result) {
            let h =
                Math.floor(result / 3600) < 10
                    ? "0" + Math.floor(result / 3600)
                    : Math.floor(result / 3600);
            let m =
                Math.floor((result / 60) % 60) < 10
                    ? "0" + Math.floor((result / 60) % 60)
                    : Math.floor((result / 60) % 60);
            let s =
                Math.floor(result % 60) < 10
                    ? "0" + Math.floor(result % 60)
                    : Math.floor(result % 60);
            return (result = h + ":" + m + ":" + s);
        },
        getLoadRateColor(n) {
            if (n < 0.4) {
                return "#409EFF";
            } else if (n < 0.6) {
                return "#7fff00";
            } else if (n < 0.8) {
                return "#fc0";
            } else if (n < 1) {
                return "#f00";
            } else if (n >= 1) {
                return "#750614";
            } else {
                return "#409EFF";
            }
        },
        getLateTimeColor(n) {
            if (n <= 0) {
                return "#409EFF";
            } else if (n < 2 * 60) {
                return "#7fff00";
            } else if (n < 5 * 60) {
                return "#fc0";
            } else if (n < 10 * 60) {
                return "#f00";
            } else if (n >= 10 * 60) {
                return "#750614";
            } else {
                return "#409EFF";
            }
        },
        createSvgTag(tagName, attrs) {
            let svgNS = "http://www.w3.org/2000/svg";
            let tagElement = document.createElementNS(svgNS, tagName);
            for (let a in attrs) {
                tagElement.setAttribute(a, attrs[a]);
                tagElement.setAttribute("cursor", "pointer");
                tagElement.setAttribute("onselectstart", "return false");
            }
            return tagElement;
        },
        drawXAxisMainLine(y, style) {
            this.DIAGRAM_STATIC.XAxisMain = this.createSvgTag("line", {
                x1: 0,
                y1: y,
                x2: 86400 * this.scaleX,
                y2: y,
                style: style,
            });
            this.SVG_DATA.appendChild(this.DIAGRAM_STATIC.XAxisMain);
        },
        drawYAxisMainLine(x, y2, style) {
            this.DIAGRAM_STATIC.YAxisMain = this.createSvgTag("line", {
                x1: x,
                y1: 0,
                x2: x,
                y2: y2,
                style: style,
            });
            this.SVG_STATION.appendChild(this.DIAGRAM_STATIC.YAxisMain);
        },
        drawStationName(s, x, y) {
            this.DIAGRAM_STATIC.StaionName[s.id] = this.createSvgTag("text", {
                x: x,
                y: y,
                fill: this.CHART_CONFIG.AxisTextColor,
                "text-anchor": "middle",
                "alignment-baseline": "middle",
            });
            this.DIAGRAM_STATIC.StaionName[s.id].innerHTML = s.name;
            this.SVG_STATION.appendChild(this.DIAGRAM_STATIC.StaionName[s.id]);
        },
        drawHorizontalBack(y, dasharray, style) {
            let tag = this.createSvgTag("line", {
                x1: 0,
                y1: y,
                x2: 86400 * this.scaleX,
                y2: y,
                "stroke-dasharray": dasharray ? dasharray : "10,0",
                style: style ? style : "stroke:#9995;stroke-width:1",
            });
            tag.setAttribute("cursor", "default");
            this.SVG_DATA.appendChild(tag);
        },
        drawTick(x, y, offset, style) {
            let tag = this.createSvgTag("line", {
                x1: x,
                y1: y,
                x2: x,
                y2: y + offset,
                style: style
                    ? style
                    : `stroke:${this.CHART_CONFIG.MainLineColor};stroke-width:1`,
            });
            this.SVG_DATA.appendChild(tag);
        },
        drawTickText(x, y, style, text) {
            let tag = this.createSvgTag("text", {
                x: x,
                y: y,
                fill: this.CHART_CONFIG.AxisTextColor,
                "text-anchor": "middle",
                "alignment-baseline": "middle",
                style: style,
            });
            tag.innerHTML = text;
            this.SVG_DATA.appendChild(tag);
        },
        drawVerticalBack(x, y, dasharray, style) {
            let tag = this.createSvgTag("line", {
                x1: x,
                y1: 0,
                x2: x,
                y2: y,
                "stroke-dasharray": dasharray ? dasharray : "10,10",
                style: style ? style : "stroke:#9995;stroke-width:1",
            });
            tag.setAttribute("cursor", "default");
            this.SVG_DATA.appendChild(tag);
        },
        drawTrip(points, style) {
            let tag = this.createSvgTag("polyline", {
                points: points,
                style: style,
            });
            tag.setAttribute("stroke-width", "2");

            tag.onmouseenter = (a) => {
                a.path[0].setAttribute("stroke-width", "3");
            };
            tag.onmouseleave = (a) => {
                a.path[0].setAttribute("stroke-width", "2");
            };
            this.SVG_DATA.appendChild(tag);
            this.TRIPS.push(tag);
        },
        drawTripText(x, y, text, style, angle, rx, ry) {
            if (!(y > 0)) {
                // 有时候后端传的数据是错的，找不到车站，计算不出位置，绘制会出错
                return;
            }

            if (!angle) {
                angle = 0;
            }
            if (!rx) {
                rx = x;
            }
            if (!ry) {
                ry = y;
            }

            let tag = this.createSvgTag("text", {
                x: x,
                y: y,
                fill: this.CHART_CONFIG.TripNoColor,
                "text-anchor": "middle",
                "alignment-baseline": "middle",
                style: style ? style : "font-size:10px",
                transform: `rotate(${angle} ${rx},${ry})`,
            });
            tag.innerHTML = text;
            this.SVG_DATA.appendChild(tag);
            this.TRIPS_TEXT.push(tag);
        },
        drawPointLine(x, y, dasharray, style) {
            let tag = this.createSvgTag("line", {
                x1: x,
                y1: 0,
                x2: x,
                y2: y,
                "stroke-dasharray": dasharray ? dasharray : "10,0",
                style: style ? style : "stroke:#999;stroke-width:1",
            });
            tag.setAttribute("cursor", "default");
            this.DIAGRAM_STATIC.PointLine = tag;
            this.SVG_DATA.appendChild(tag);
        },
        drawSegment(x1, y1, x2, y2, stroke, style) {
            let tag = this.createSvgTag("line", {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: stroke,
                style: style ? style : "fill:transparent",
            });

            tag.setAttribute("cursor", "pointer");
            this.SVG_DATA.appendChild(tag);

            tag.onmouseenter = (a) => {
                a.path[0].setAttribute("stroke-width", "3");
            };
            tag.onmouseleave = (a) => {
                a.path[0].setAttribute("stroke-width", "2");
            };
            tag.setAttribute("stroke-width", "2");
            this.SVG_DATA.appendChild(tag);
            this.REAL_SEGMENT.push(tag);
        },
        drawForecastSegment(x1, y1, x2, y2, stroke, style) {
            let tag = this.createSvgTag("line", {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: stroke,
                style: style ? style : "fill:transparent",
            });

            tag.setAttribute("cursor", "pointer");
            this.SVG_DATA.appendChild(tag);

            tag.onmouseenter = (a) => {
                a.path[0].setAttribute("stroke-width", "3");
            };
            tag.onmouseleave = (a) => {
                a.path[0].setAttribute("stroke-width", "2");
            };
            tag.setAttribute("stroke-width", "2");
            this.SVG_DATA.appendChild(tag);
            this.FORECAST_SEGMENT.push(tag);
        },
        drawCurrentTimeLine() {
            if (this.CURRENT_TIME_LINE) {
                this.CURRENT_TIME_LINE.setAttribute(
                    "x1",
                    this.maxTime * this.scaleX
                );
                this.CURRENT_TIME_LINE.setAttribute(
                    "x2",
                    this.maxTime * this.scaleX
                );
            } else {
                let diagramHeight =
                    this.diagramConfig.stationHeight * this.stations.length +
                    this.diagramConfig.bottomBlockHeight +
                    this.diagramConfig.topBlockHeight;
                let tag = this.createSvgTag("line", {
                    x1: this.maxTime * this.scaleX,
                    y1: 0,
                    x2: this.maxTime * this.scaleX,
                    y2: diagramHeight - this.diagramConfig.bottomBlockHeight,
                    stroke: "#DC143C",
                    "stroke-width": 3,
                    fill: "#DC143C",
                    "z-index": 9999,
                });
                tag.setAttribute("cursor", "pointer");
                this.SVG_DATA.appendChild(tag);
                this.CURRENT_TIME_LINE = tag;
            }

            if (
                this.maxTime * this.scaleX > 300 &&
                this.autoMode == "自动跟踪"
            ) {
                let diagram_data = this.$refs["diagram-data"];
                diagram_data.scrollLeft = this.maxTime * this.scaleX - 300;
            }
        },
        drawForcastTimeLine() {
            if (this.FORCAST_TIME_LINE) {
                this.FORCAST_TIME_LINE.setAttribute(
                    "x1",
                    this.forcastTime * this.scaleX
                );
                this.FORCAST_TIME_LINE.setAttribute(
                    "x2",
                    this.forcastTime * this.scaleX
                );
            } else {
                let diagramHeight =
                    this.diagramConfig.stationHeight * this.stations.length +
                    this.diagramConfig.bottomBlockHeight +
                    this.diagramConfig.topBlockHeight;
                let tag = this.createSvgTag("line", {
                    x1: this.forcastTime * this.scaleX,
                    y1: 0,
                    x2: this.forcastTime * this.scaleX,
                    y2: diagramHeight - this.diagramConfig.bottomBlockHeight,
                    stroke: "#DC143C",
                    "stroke-dasharray": "20 10",
                    "stroke-width": 3,
                    fill: "#DC143C",
                    "z-index": 9999,
                });
                tag.setAttribute("cursor", "pointer");
                this.SVG_DATA.appendChild(tag);
                this.FORCAST_TIME_LINE = tag;
            }
        },
        /**
         * 实际图和预测图一起画
         */
        _drawUnionData() {
            // 清除旧的实际图
            this.REAL_SEGMENT.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.REAL_SEGMENT = [];

            // 清除旧的预测图
            this.FORECAST_SEGMENT.forEach((tag) => {
                this.SVG_DATA.removeChild(tag);
            });
            this.FORECAST_SEGMENT = [];

            if (this.realData && this.realData.length > 0) {
                this.realData.forEach((tripItem) => {
                    let maxTripTime = 0; // 当前班次的最新时间，预测信息的分割线
                    let lastTripY = 0; // 当前班次最后 Y 坐标
                    if (tripItem.data.length > 0) {
                        for (let i = 0; i < tripItem.data.length - 1; i++) {
                            this.drawSegment(
                                tripItem.data[i].arrive * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                tripItem.data[i].depart * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                this.getLoadRateColor(
                                    tripItem.data[i].loadrate / 10000
                                )
                            );
                            this.drawSegment(
                                tripItem.data[i].depart * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                tripItem.data[i + 1].arrive * this.scaleX,
                                this.stationMap[tripItem.data[i + 1].sid],
                                this.getLoadRateColor(
                                    tripItem.data[i].loadrate / 10000
                                )
                            );
                        }
                        let lastI = tripItem.data.length - 1;
                        if (lastI > 0) {
                            this.drawSegment(
                                tripItem.data[lastI].arrive * this.scaleX,
                                this.stationMap[tripItem.data[lastI].sid],
                                tripItem.data[lastI].depart * this.scaleX,
                                this.stationMap[tripItem.data[lastI].sid],
                                this.getLoadRateColor(
                                    tripItem.data[lastI].loadrate / 10000
                                )
                            );
                        }
                        // 记录班次最后一个点的时间和位置
                        maxTripTime = tripItem.data[lastI].depart;
                        lastTripY = this.stationMap[tripItem.data[lastI].sid];
                    }

                    // 追加预测数据
                    if (this.forecastData) {
                        let forcastTrip = this.forecastData.find((item) => {
                            return (
                                item.serveNo == tripItem.serveNo &&
                                item.tripNo == tripItem.tripNo
                            );
                        });

                        if (forcastTrip && forcastTrip.data.length > 0) {
                            for (let i = 0; i < forcastTrip.data.length; i++) {
                                if (maxTripTime < forcastTrip.data[i].arrive) {
                                    this.drawSegment(
                                        maxTripTime * this.scaleX,
                                        lastTripY,
                                        forcastTrip.data[i].arrive *
                                            this.scaleX,
                                        this.stationMap[
                                            forcastTrip.data[i].sid
                                        ],
                                        "#1E90FF"
                                    );
                                    this.drawSegment(
                                        forcastTrip.data[i].arrive *
                                            this.scaleX,
                                        this.stationMap[
                                            forcastTrip.data[i].sid
                                        ],
                                        forcastTrip.data[i].depart *
                                            this.scaleX,
                                        this.stationMap[
                                            forcastTrip.data[i].sid
                                        ],
                                        "#1E90FF"
                                    );
                                } else if (
                                    maxTripTime >= forcastTrip.data[i].arrive &&
                                    maxTripTime < forcastTrip.data[i].depart
                                ) {
                                    this.drawSegment(
                                        maxTripTime * this.scaleX,
                                        lastTripY,
                                        forcastTrip.data[i].depart *
                                            this.scaleX,
                                        this.stationMap[
                                            forcastTrip.data[i].sid
                                        ],
                                        "#1E90FF"
                                    );
                                }
                                maxTripTime = forcastTrip.data[i].depart;
                                lastTripY =
                                    this.stationMap[forcastTrip.data[i].sid];
                            }
                        }
                    }
                });
            } else {
                this.forecastData.forEach((tripItem) => {
                    if (tripItem.data.length > 0) {
                        for (let i = 0; i < tripItem.data.length - 1; i++) {
                            this.drawForecastSegment(
                                tripItem.data[i].arrive * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                tripItem.data[i].depart * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                "#1E90FF"
                            );
                            this.drawForecastSegment(
                                tripItem.data[i].depart * this.scaleX,
                                this.stationMap[tripItem.data[i].sid],
                                tripItem.data[i + 1].arrive * this.scaleX,
                                this.stationMap[tripItem.data[i + 1].sid],
                                "#1E90FF"
                            );
                        }
                        let lastI = tripItem.data.length - 1;
                        if (lastI > 0) {
                            this.drawSegment(
                                tripItem.data[lastI].arrive * this.scaleX,
                                this.stationMap[tripItem.data[lastI].sid],
                                tripItem.data[lastI].depart * this.scaleX,
                                this.stationMap[tripItem.data[lastI].sid],
                                "#1E90FF"
                            );
                        }
                    }
                });
            }
        },
    },
    watch: {
        stations(n, o) {
            this.initDiagram();
        },
        planData(n, o) {
            this.drawPlanData();
        },
        realData(n, o) {
            // this.drawRealData();
            this._drawUnionData();
        },
        forecastData(n, o) {
            // this.drawforecastData();
            this._drawUnionData();
        },
        maxTime(n, o) {
            this.drawCurrentTimeLine();
        },
        forcastTime(n, o) {
            this.drawForcastTimeLine();
        },
        autoMode(n, o) {
            this.drawCurrentTimeLine();
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: rgb(31, 45, 61) solid;
    border-width: 0 0 2px 0;
}

.middle {
    flex: 1;
    overflow: auto;
}
.diagram {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
}

.footer {
    background-color: darkcyan;
}

#svg_station {
    margin-bottom: 20px;
}

.diagram-data {
    flex: 1;
    overflow: auto;
}

.info-panel {
    position: fixed;
    background-color: #0009;
    border-radius: 5px;
    padding: 5px;
    left: 100px;
    top: 100px;
    width: auto;
}

.info-panel div {
    background-color: rgb(190, 19, 71);
    border-radius: 3px;
    padding: 2px;
    text-align: left;
    font-size: 10px;
    margin-top: 3px;
    color: white;
}

.info-panel h3 {
    color: white;
    text-align: left;
}
</style>
