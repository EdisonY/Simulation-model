//故障注入相关设置

//故障类型选项
const faultTypeOption = [{
        label: '',
        option: [{ value: 0, label: '正常运行' }],
    },
    {
        label: '1-单车故障',
        option: [{ value: 101, label: '车辆牵引系统故障' },
            { value: 102, label: '车辆制动及风源系统故障' },
            { value: 103, label: '车辆辅助电源故障' },
            { value: 104, label: '车门故障' },
            { value: 105, label: '列车无法从接触网/接触轨取电' },
            { value: 106, label: '车辆转向架故障' },
            { value: 107, label: '车辆障碍物/脱轨检测装置故障' },
            { value: 108, label: '列车TCMS完全故障' },
            { value: 109, label: '车辆烟火报警系统故障' },
            { value: 110, label: '信号车载设备故障(考虑RRM模式)' }
        ]
    },
    {
        label: '2-区段故障',
        option: [
            { value: 201, label: '信号区域控制器完全故障' },
            { value: 202, label: '信号联锁主机完全故障' },
            { value: 203, label: '信号计轴设备受扰或故障' },
            { value: 204, label: '中心失去全线运营状态监控' },
            { value: 205, label: '车站ATS实时服务器完全故障' },
            { value: 206, label: '车站DCS设备完全故障' },
            { value: 207, label: '人员防护开关(SPKS)装置故障(点中断)' },
            { value: 208, label: '紧急停车按钮(ESB)装置故障' },
            { value: 209, label: '传输系统网络全部中断' }
        ]
    },
    {
        label: '3-单点故障',
        option: [
            { value: 301, label: '信号信标/应答器故障（考虑RRM模式）' },
            { value: 302, label: '信号道岔设备故障' },
            { value: 303, label: '站台门故障' },
            { value: 304, label: '站台间隙探测装置故障' },
        ]
    },
];

export default faultTypeOption;