<template>
    <div class="container">
        <div class="header">
            <!-- <h1>{{diagramName}}</h1> -->
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
    ],
    data() {
        return {
            pointLineVisible: false,
            realInfo: { time: "00:00", data: [] },

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
            REAL_SEGMENT: [],
            stationMap: {},
        };
    },
    mounted() {
        this.SVG_STATION = this.$refs.svg_station;
        this.SVG_DATA = this.$refs.svg_data;
        this.INFO_PANEL = this.$refs["info-panel"];
        this.initDiagram();
    },
    methods: {
        initDiagram() {
            // 1. 设置svg高度
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
                let y =
                    diagramHeight -
                    (this.diagramConfig.bottomBlockHeight +
                        s.id * this.diagramConfig.stationHeight);
                this.stationMap[s.id] = y;

                this.drawStationName(s, sideWidth / 2, y);
                this.drawHorizontalBack(y);
            });

            // 4. 横轴刻度线 \ 横轴时间 \ 纵向条纹
            let y = diagramHeight - this.diagramConfig.bottomBlockHeight;
            for (let i = 0; i <= 86400; i++) {
                if (i % 3600 == 0) {
                    let time = i / 3600;
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
                } else if (i % 600 == 0) {
                    let time = (i % 3600) / 60;
                    this.drawTick(i, y, 5);
                    this.drawTickText(
                        i,
                        y + 15,
                        "font-size:15px;font-weight:bold;",
                        time
                    );
                    this.drawVerticalBack(i, y);
                } else if (i % 60 == 0) {
                    let time = (i / 60) % 60;
                    this.drawTick(i, y, 5);
                    this.drawTickText(i, y + 15, "font-size:12px;", time);
                    this.drawVerticalBack(i, y);
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
        },
        drawPlanData() {
            this.planData.forEach((tripItem) => {
                let poliLineData = "";
                tripItem.data.forEach((d) => {
                    poliLineData += ` ${d.arrive},${this.stationMap[d.sid]} `;
                    poliLineData += ` ${d.depart},${this.stationMap[d.sid]} `;
                });
                this.drawTrip(
                    poliLineData,
                    `fill:none;stroke:${this.CHART_CONFIG.Colors[5]}`
                );
                this.drawTripText(
                    tripItem.data[0].arrive + 10,
                    this.stationMap[tripItem.data[0].sid] - 10,
                    `S:${tripItem.serveNo} T:${tripItem.tripNo}`,
                    null,
                    0
                );
            });
        },
        drawRealData() {
            this.realData.forEach((tripItem) => {
                if (tripItem.data.length > 1) {
                    for (let i = 0; i < tripItem.data.length - 1; i++) {
                        this.drawSegment(
                            tripItem.data[i].arrive,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i].depart,
                            this.stationMap[tripItem.data[i].sid],
                            "orange"
                        );
                        this.drawSegment(
                            tripItem.data[i].depart,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i + 1].arrive,
                            this.stationMap[tripItem.data[i + 1].sid],
                            "orange"
                        );
                    }
                }
            });
        },
        drawforecastData() {
            this.forecastData.forEach((tripItem) => {
                if (tripItem.data.length > 1) {
                    for (let i = 0; i < tripItem.data.length - 1; i++) {
                        this.drawForecastSegment(
                            tripItem.data[i].arrive,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i].depart,
                            this.stationMap[tripItem.data[i].sid],
                            "#1E90FF"
                        );
                        this.drawForecastSegment(
                            tripItem.data[i].depart,
                            this.stationMap[tripItem.data[i].sid],
                            tripItem.data[i + 1].arrive,
                            this.stationMap[tripItem.data[i + 1].sid],
                            "#1E90FF"
                        );
                    }
                }
            });
        },
        updateInfoPanel(evt) {
            let filterData = [];

            this.realData.forEach((trip) => {
                for (let i = 0; i < trip.data.length; i++) {
                    if (
                        trip.data[i].arrive <= this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i].depart >= this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations[trip.data[i].sid],
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    } else if (
                        trip.data[i + 1] &&
                        trip.data[i].depart < this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i + 1].arrive > this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations[trip.data[i].sid],
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
                        trip.data[i].arrive <= this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i].depart >= this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations[trip.data[i].sid],
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    } else if (
                        trip.data[i + 1] &&
                        trip.data[i].depart < this.DIAGRAM_STATIC.PointLineX &&
                        trip.data[i + 1].arrive > this.DIAGRAM_STATIC.PointLineX
                    ) {
                        filterData.push({
                            serveNo: trip.serveNo,
                            tripNo: trip.tripNo,
                            station: this.stations[trip.data[i].sid],
                            dir: trip.dir,
                            late: trip.data[i].late,
                        });
                        continue;
                    }
                }
            });
            this.realInfo = {
                time: this.secondToDate(this.DIAGRAM_STATIC.PointLineX),
                data: filterData,
            };

            if (
                this.DIAGRAM_STATIC.Height -
                    this.diagramConfig.bottomBlockHeight >=
                evt.layerY + this.INFO_PANEL.offsetHeight + 10
            ) {
                this.INFO_PANEL.style.top = `${
                    evt.clientY + 10
                }px`;
            } else {
                this.INFO_PANEL.style.top = `${
                    evt.clientY -
                    this.INFO_PANEL.offsetHeight -
                    10
                }px`;
            }

            if (86400 < evt.layerX + this.INFO_PANEL.offsetWidth + 10) {
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
                x2: 86400,
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
                x2: 86400,
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

            // 这个效果不好，设置悬浮窗替代
            // let title = createSvgTag("title");
            // let text = document.createTextNode("<span style='background-color:orange'>车次号111 服务号22</span>");
            // title.appendChild(text);
            // tag.appendChild(title);

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
            this.REAL_SEGMENT.push(tag);
        },
    },
    watch: {
        planData(n, o) {
            this.drawPlanData();
        },
        realData(n, o) {
            this.drawRealData();
        },
        forecastData(n, o) {
            this.drawforecastData();
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

#svg_data {
    width: 86440px;
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
