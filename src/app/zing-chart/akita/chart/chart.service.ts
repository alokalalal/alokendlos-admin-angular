import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Constants } from '../../constants';
import { Legend, DrillDownStatus, ChartTypeSelector, ChartRangeSelector } from '../../interface';

import { ChartEntity } from './chart.entity';
import { ChartQuery } from './chart.query';
import { ChartStore } from './chart.store';

@Injectable({ providedIn: 'root' })
export class ChartService {
    constructor(private chartStore: ChartStore, private chartQuery: ChartQuery) {}

    add(chartEntity: ChartEntity) {
        this.chartStore.add(chartEntity);
    }

    update(id: string, chartEntity: Partial<ChartEntity>) {
        this.chartStore.update(id, chartEntity);
    }

    updateLegend(id: string, legend: Legend) {
        this.chartStore.update(id, entity => {
            const legends = _.cloneDeep(entity.chartRawData.legends);
            _.forEach(legends, (temp: Legend) => {
                if (legend?.name === temp.name) {
                    temp.isSelected = !legend.isSelected;
                }
            });
            const legendIds = _.map(
                _.filter(legends, (l: Legend) => l.isSelected),
                'id'
            );
            // let intakeYearLevels = entity.filter.intakeYearLevels;
            // // Legend Ids represent a intake year level for Technical Status charts.
            // if (id.includes(Constants.enquiryByMonth)) {
            //     intakeYearLevels = legendIds;
            // }
            // if (id.includes(Constants.enquiryByMonth)) {
            //     intakeYearLevels = legendIds;
            // }
            return {
                chartRawData: {
                    ...entity.chartRawData,
                    legends,
                },
                filter: {
                    ...entity.filter,
                    legendId: legendIds,
                    // intakeYearLevels,
                },
            };
        });
    }

    updateLegendSection(id: string) {
        this.chartStore.update(id, entity => {
            const legends = _.cloneDeep(entity.chartRawData.legends);
            _.forEach(legends, (temp: Legend) => {
                temp.isSelected = true;
            });
            const legendIds = _.map(legends, 'id');
            // let intakeYearLevels = entity.filter.intakeYearLevels;
            // if (id.includes(Constants.enquiryByMonth)) {
            //     intakeYearLevels = legendIds;
            // }
            return {
                chartRawData: {
                    ...entity.chartRawData,
                    legends,
                },
                hasLegend: !entity.hasLegend,
                filter: {
                    ...entity.filter,
                    legendId: legendIds,
                    // intakeYearLevels,
                },
            };
        });
    }

    updateDrillDownStatus(id: string, drillDownStatus: DrillDownStatus, chartTypeSelector: ChartTypeSelector, isAggregated: boolean) {
        this.chartStore.update(id, entity => {
            let legendIds: number[];
            if (drillDownStatus) {
                legendIds = _.map(
                    _.filter(entity.chartRawData.legends, (l: Legend) => l.name === drillDownStatus?.legendName),
                    'id'
                );
            } else {
                legendIds = _.map(entity.chartRawData.legends, 'id');
            }
            return {
                ...entity,
                chartTypeSelector,
                drillDownStatus,
                isAggregated,
                filter: {
                    ...entity.filter,
                    legendId: legendIds,
                },
            };
        });
    }
}
