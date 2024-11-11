import { ZingData, ZingNoData, ZingGlobals, ZingGUI, ZingSeries } from "./zing-data";


export class ChartInitData {
    public static getPieChartInitData(): ZingData {
        return {
            type: 'pie',
            title: {
                text: '',
                position: '50% 100%',
            },
            noData: ZingNoData.getNoData(),
            plotarea: {
                margin: '0px 0px 12px 0px',
            },
            series: [],
            plot: {
                detach: false,
                tooltip: {
                    alpha: 1,
                    text: '<div class="pie-chart-tooltip text-center" style="border-color:%color"><span style="color:%data-background-color">%t <br/> %v | %npv%</span</div>',
                    borderWidth: 0,
                    borderRadius: 8,
                    placement: 'node:out',
                    backgroundColor: '#FFFFFF',
                    padding: '0',
                    htmlMode: true,
                    decimals: 0,
                },
                slice: 70,
                valueBox: {
                    text: '%npv%',
                    fontSize: 14,
                    decimals: 0,
                    connector: {
                        lineColor: '#616161',
                    },
                    rules: [
                        {
                            text: '%npv',
                            rule: '%npv <= 0.0',
                            visible: false,
                        },
                    ],
                },
                rules: [
                    {
                        text: '%p',
                        rule: '%p <= 0.0',
                        visible: false,
                    },
                ],
            },
            labels: [
                {
                    fontWeight: 500,
                    anchor: 'c',
                    x: '50%',
                    y: '47%',
                    fontSize: 32,
                    text: '',
                },
            ],
            globals: ZingGlobals.getDefaultConfig(),
            gui: ZingGUI.getDefaultConfig(),
        };
    }
    
    public static getColumnChartInitData(): ZingData {
        return {
            type: 'bar',
            plotarea: {
                adjustLayout: true,
            },
            noData: ZingNoData.getNoData(),
            preview: {
                visible: false,
                mask: {},
                label: {},
            },
            plot: {
                stacked: true,
                borderRadius: 0,
                valueBox: {
                    text: '',
                    fontSize: 14,
                    rules: [
                        {
                            text: '',
                            rule: '%stack-top == 0',
                            visible: false,
                        },
                    ],
                },
                tooltip: {
                    text: '<span style="color:%data-background-color">%t: %v</span>',
                    backgroundColor: 'white',
                    visible: true,
                    rules: [
                        {
                            text: '%v',
                            rule: '%v <= 0',
                            visible: false,
                        },
                    ],
                },
            },
            scaleX: {
                labels: [],
                maxItems: 10,
                itemsOverlap: true,
                item: {
                    angle: '0',
                },
                transform: {},
            },
            scaleY: {
                label: {
                    text: '',
                },
                autoFit: true,
            },
            series: [],
            globals: ZingGlobals.getDefaultConfig(),
            gui: ZingGUI.getDefaultConfig(),
        };
    }

    public static getLineAreaChartInitData(): ZingData {
        return {
            type: 'area',
            plotarea: { adjustLayout: true },
            noData: ZingNoData.getNoData(),
            crosshairX: {
                lineStyle: 'dashed',
                lineWidth: 2,
                visible: true,
                plotLabel: {
                    fontSize: 12,
                },
                scaleLabel: {
                    backgroundColor: 'black',
                    fontColor: 'white',
                    fontSize: 12,
                },
                marker: {
                    visible: false,
                },
            },
            preview: {
                visible: false,
                mask: {},
                label: {},
            },
            plot: {
                tooltip: {
                    text: '<span style="background-color:%data-background-color;color:white">%t: %v</span>',
                    visible: false,
                },
                valueBox: {
                    text: '',
                    fontSize: 14,
                    rules: [
                        {
                            text: '',
                            rule: '%stack-top == 0',
                            visible: false,
                        },
                    ],
                },
            },
            scaleX: {
                labels: [],
                maxItems: 10,
                item: {
                    angle: '0',
                },
                transform: {},
            },
            scaleY: {
                label: {
                    text: '',
                },
                autoFit: true,
            },
            series: [],
            globals: ZingGlobals.getDefaultConfig(),
            gui: ZingGUI.getDefaultConfig(),
        };
    }
}
