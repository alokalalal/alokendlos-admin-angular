import { ChartType } from "./enums";

export interface ChartButtonGroupSetup {
    hasCopyButton: boolean;
    menuButton?: ChartSelectorMenuItem;
    chartTypeSelectors?: ChartTypeSelector[];
}

export interface ChartTypeSelector {
    type: ChartType;
    name: string;
    icon: string;
}

export interface ChartActionSectionSetup {
    hasViewButton: boolean;
}

export interface ChartSelectorMenuItem {
    aggregateSection: ChartSection;
    totalSection: ChartSection;
    legendSection?: ChartSection;
    hasShowGuideButton?: boolean;
    hasDownloadPDFButton: boolean;
    hasDownloadCSVButton: boolean;
    hasDownloadXLSButton: boolean;
    hasPrintButton: boolean;
}

export interface ChartSection {
    isSelected?: boolean;
    hasButton: boolean;
}

export interface DrillDownStatus {
    legendName?: string;
    lastSelectedChartType?: ChartType;
}

export interface ChartRangeSelector {
    startDate: number;
    endDate: number;
}

export interface Legend {
    name: string;
    sequence?: number;
    url?: string;
    isSelected?: boolean;
    className?: string;
    id?: number;
    icon?: string;
    disabled?: boolean;
}

export class PieSeries {
    data: Array<number>;
    total: number;
    values?: Array<number>;

    constructor() {
        this.data = [];
        this.total = null;
    }
}

export interface ChartRawData {
    legends: Array<Legend>;
    labels: Array<Object>;
    classNames: Array<string>;
    series: Array<PieSeries>;
}

export interface ChartFilter {
    intakeYear: number[];
    intakeYearLevels: number[];
    selectedStages?: number[];
    statuses?: number[];
    title?: string;
    legendId?: number[];
    startCreatedDate?: string;
    endCreatedDate?: string;
}

export interface ChartTypeSelector {
    type: ChartType;
    name: string;
    icon: string;
}

export interface DrillDownStatus {
    legendName?: string;
    lastSelectedChartType?: ChartType;
}

export interface LineAndAreaChartCommonProperty {
    type: string;
    plotRuleText: string;
    plotRulerule: string;
    stacked: boolean;
}
