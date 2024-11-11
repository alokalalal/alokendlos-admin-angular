import { InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../constants';
import { ChartType } from '../enums';
import { ChartActionSectionSetup, ChartButtonGroupSetup, ChartTypeSelector } from '../interface';
import { ChartEntity, ChartQuery, ChartService } from '../akita/chart';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Utils } from '../utils';
import { ZingData } from '../zing-data';
import { CustomZingChartAngularComponent } from '../zingchart';

export const CHART_WRAPPER_SERVICE = new InjectionToken<ChartWrapperService>('Chart Wrapper Service');

export abstract class ChartWrapperService {
    public url = `/machine/list`;
    protected _chartType: CustomZingChartAngularComponent;
    public abstract chartName: string;
    protected _total: number = 0;
    protected chartEntity: ChartEntity;
    public abstract chartStoreKey: string;
    public abstract drillDownChartType: ChartType;

    constructor(
        protected router: Router,
        protected chartService: ChartService,
        protected chartQuery: ChartQuery,
    ) {
    }
    abstract getChartButtonGroupConfig(): ChartButtonGroupSetup;
    abstract getChartActionSectionConfig(): ChartActionSectionSetup;
    abstract getInitialData(): ZingData;

    get chartType(): CustomZingChartAngularComponent {
        return this._chartType;
    }

    set chartType(chartType: CustomZingChartAngularComponent) {
        this._chartType = chartType;
    }

    get total(): number {
        return this._total;
    }

    set total(total: number) {
        this._total = total;
    }

    public setAggregateStatus(isAggregated: boolean): void {
        if (this.getChartEntity() != undefined) {
            this.chartService.update(this.getChartEntityId(), {
                id: this.getChartEntityId(),
                isAggregated,
            });
        } else {
            this.chartService.add({
                id: this.getChartEntityId(),
                isAggregated,
            });
        }
    }

    public getFileName(): string {
        return `${this.chartName}_${moment().format(Constants.dateFormats.dayMonthYearUnderScored)}`;
    }

    downloadPdf() {
        this._chartType?.saveasimage({
            filetype: 'pdf',
            filename: this.getFileName() + '.pdf',
            download: true,
        });
    }

    downloadCsv() {
        this._chartType?.downloadCSV({
            fn: this.getFileName(),
        });
    }

    downloadXls() {
        this._chartType?.downloadXLS({
            fn: this.getFileName(),
        });
    }

    onPrintChart() {
        this._chartType?.print();
    }

    /**
     * This method uses zingchart angular's get image data method which returns a base64 string of image.
     * @returns
     */
    async copyChart() {
        this._chartType?.getimagedata({
            filetype: 'png',
            callback: async function (imageURL) {
                if (imageURL == -1) {
                    //alert("Unable to generate an image.");
                    return;
                }
                // We need to trim double-quotes from the rawImageData provided from zingchart method.
                // Zingchart adds a double-quotes in string.
                try {
                    await Utils.addToClipboard(_.trim(imageURL, '"'), 'image/png');
                    alert("Chart Image copied.");
                } catch (err) {
                    //alert(err.message);
                    console.error(err.name, err.message);
                }
            },
        });
    }

    getChartEntity(): ChartEntity {
        return this.chartQuery.get(this.getChartEntityId());
    }

    getChartEntityId() {
        return `${this.chartStoreKey}`;
    }

    public setShowTotalStatus(hasPlotTotal: boolean): void {
        this.chartService.update(this.getChartEntityId(), { id: this.getChartEntityId(), hasPlotTotal });
    }

    public setChartTypeSelector(chartTypeSelector: ChartTypeSelector): void {
        this.chartService.update(this.getChartEntityId(), { id: this.getChartEntityId(), chartTypeSelector });
    }

    public getChartTypeSelectors(chartTypes: ChartType[]): ChartTypeSelector[] {
        return _.filter(Constants.chartTypeSelectors, chartTypeSelector => chartTypes.includes(chartTypeSelector.type));
    }

    public setHeight(height: number): void {
        this.chartType?.resize({
            height,
        });
    }

    public getDrillDownChartTypeSelector(): ChartTypeSelector {
        return _.find(Constants.chartTypeSelectors, (c: ChartTypeSelector) => c.type === this.drillDownChartType);
    }
}
