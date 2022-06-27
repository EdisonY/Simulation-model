<template>
    <HelloWorld :width="width"
        :first="first"
        :startTime="startTime"
        :endTime="endTime"
        :stations="stations"
        :diagramConfig="diagramConfig"
        :planData="planData"
        :realData="realData"
        :forecastData="forecastData"
        diagramName="实际运行图" />
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import testData from "./testData";
export default {
    data() {
        return {
            width: 1120,
            startTime: 0,
            endTime: 1020,
            diagramConfig: {
                stationHeight: 50,
                bottomBlockHeight: 30,
                topBlockHeight: 100,
                sideWidth: 100,
            },
            first: true,
            stations: [
                {
                    id: 1,
                    name: "丰台东大街站",
                },
                {
                    id: 2,
                    name: "北京西站",
                },
                {
                    id: 3,
                    name: "北京西站",
                },
                {
                    id: 4,
                    name: "北京西站",
                },
                {
                    id: 5,
                    name: "北京西站",
                },
                {
                    id: 6,
                    name: "北京西站",
                },
                {
                    id: 7,
                    name: "北京西站",
                },
                {
                    id: 8,
                    name: "北京西站",
                },
                {
                    id: 9,
                    name: "北京西站",
                },
                {
                    id: 10,
                    name: "北京西站",
                },
                {
                    id: 11,
                    name: "北京西站",
                },
                {
                    id: 12,
                    name: "北京西站",
                },
                {
                    id: 13,
                    name: "北京西站",
                },
                {
                    id: 14,
                    name: "北京西站",
                },
                {
                    id: 15,
                    name: "北京西站",
                },
                {
                    id: 16,
                    name: "北京西站",
                },
                {
                    id: 17,
                    name: "北京西站",
                },
                {
                    id: 18,
                    name: "北京西站",
                },
                {
                    id: 19,
                    name: "北京西站",
                },
                {
                    id: 20,
                    name: "北京西站",
                },
                {
                    id: 21,
                    name: "北京西站",
                },
                {
                    id: 22,
                    name: "北京西站",
                },
                {
                    id: 23,
                    name: "北京西站",
                },
                {
                    id: 24,
                    name: "北京西站",
                },
                {
                    id: 25,
                    name: "北京西站",
                },
                {
                    id: 26,
                    name: "北京西站",
                },
                {
                    id: 27,
                    name: "北京西站",
                },
                {
                    id: 28,
                    name: "北京西站",
                },
                {
                    id: 29,
                    name: "北京西站",
                },
                {
                    id: 30,
                    name: "北京西站",
                },
                {
                    id: 31,
                    name: "北京西站",
                },
                {
                    id: 32,
                    name: "北京西站",
                },
            ],
            planData: null,
            realData: null,
            forecastData: null,
        };
    },
    components: { HelloWorld },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            let planTripArr = [];
            let planServes = testData[0].serveList;
            planServes.forEach((serve) => {
                serve.tripList.forEach((tripItem) => {
                    let trip = {
                        serveNo: serve.serveNo,
                        tripNo: tripItem.tripNo,
                        data: [],
                        dir: tripItem.runDir,
                    };
                    tripItem.pathListStr.forEach((str) => {
                        let strArr = str.split(",");
                        trip.data.push({
                            sid: parseInt(strArr[0]),
                            arrive: parseInt(strArr[1]),
                            depart: parseInt(strArr[2]),
                        });
                    });
                    planTripArr.push(trip);
                });
            });

            let realTripArr = [];
            let realServes = testData[1].serveList;
            realServes.forEach((serve) => {
                serve.tripList.forEach((tripItem) => {
                    let trip = {
                        serveNo: serve.serveNo,
                        tripNo: tripItem.tripNo,
                        data: [],
                        dir: tripItem.runDir,
                    };
                    tripItem.pathListStr.forEach((str) => {
                        let strArr = str.split(",");
                        trip.data.push({
                            sid: parseInt(strArr[0]),
                            arrive: parseInt(strArr[1]),
                            depart: parseInt(strArr[2]),
                            late: parseInt(strArr[3]),
                        });
                    });
                    realTripArr.push(trip);
                });
            });

            let forecastTripArr = [];
            let forecastServes = testData[2].serveList;
            forecastServes.forEach((serve) => {
                serve.tripList.forEach((tripItem) => {
                    let trip = {
                        serveNo: serve.serveNo,
                        tripNo: tripItem.tripNo,
                        data: [],
                        dir: tripItem.runDir,
                    };
                    tripItem.pathListStr.forEach((str) => {
                        let strArr = str.split(",");
                        trip.data.push({
                            sid: parseInt(strArr[0]),
                            arrive: parseInt(strArr[1]),
                            depart: parseInt(strArr[2]),
                            late: parseInt(strArr[3]),
                        });
                    });
                    forecastTripArr.push(trip);
                });
            });

            this.planData = planTripArr;
            this.realData = realTripArr;
            this.forecastData = forecastTripArr;
        },
    },
};
</script>

<style scoped>
</style>