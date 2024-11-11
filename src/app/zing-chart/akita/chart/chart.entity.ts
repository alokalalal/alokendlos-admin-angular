import { EntityState } from '@datorama/akita';
import { ChartFilter, ChartRangeSelector, ChartRawData, ChartTypeSelector, DrillDownStatus } from '../../interface';

export interface ChartEntity extends EntityState<ChartEntity, string> {
    id: string;
    isAggregated?: boolean;
    chartRawData?: ChartRawData;
    hasPlotTotal?: boolean;
    filter?: ChartFilter;
    hasLegend?: boolean;
    chartTypeSelector?: ChartTypeSelector;
    drillDownStatus?: DrillDownStatus;
}
