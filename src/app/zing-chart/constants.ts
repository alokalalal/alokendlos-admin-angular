import { ChartType } from "./enums";

export class Constants {

    public static readonly fullnessStatus = 'fullnessStatus';

    public static readonly technicalStatus = 'technicalStatus';

    public static chartTypeSelectors = [
        {
            type: ChartType.Pie,
            name: 'Pie',
            icon: 'pie_chart',
        },
        {
            type: ChartType.StackedColumn,
            name: 'Stacked Column Chart',
            icon: 'stacked_bar_chart',
        },
        {
            type: ChartType.Column,
            name: 'Column Chart',
            icon: 'bar_chart',
        },
        {
            type: ChartType.LineArea,
            name: 'Line Area Chart',
            icon: 'area_chart',
        },
        {
            type: ChartType.Line,
            name: 'Line Chart',
            icon: 'multiline_chart',
        },
        {
            type: ChartType.HeatMap,
            name: 'Heat Map Chart',
            icon: 'widgets',
        },
    ];

    public static dateFormats = {
        dayMonthYearUnderScored: 'yy_MM_DD',
        dateTimeUTC: 'YYYY-MM-DDTHH:mm:ssZ'
    };
}