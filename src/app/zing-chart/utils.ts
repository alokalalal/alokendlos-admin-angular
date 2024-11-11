import * as _ from "lodash";
import { LineAndAreaChartCommonProperty } from "./interface";
import { ZingSeries } from "./zing-data";

export class Utils {
    public static async addToClipboard(url: string, mimeType = 'text/plain'): Promise<void> {
        try {
            // Safari treats user activation differently:
            // https://bugs.webkit.org/show_bug.cgi?id=222262.
            navigator.clipboard.write([
                new ClipboardItem({
                    [mimeType]: new Promise(async resolve => {
                        const data = await fetch(url);
                        const blob = await data.blob();
                        resolve(blob);
                    }) as unknown as Blob,
                }),
            ]);
        } catch {
            // Chromium
            const data = await fetch(url);
            const blob = await data.blob();
            navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
        }
    }
}

export function getChartTotal(series: ZingSeries[]): number {
    return _.sum(series.map(item => _.sum(item.values)));
}

export function getStackChartMaxValue(series: ZingSeries[], scaleXLabel: string[]): number {
    return _.max(_.map(scaleXLabel, (label, index) => _.sum(_.map(series, s => s.values[index]))));
}

/**
 * Calculate a scale Y display range so show total number
 * can be displayed properly & also avoid range to be displayed
 * in decimal.
 * @param maxValue
 * @returns
 */
export function getScaleYValues(maxValue: number) {
    const range = 10;

    if (maxValue < range) {
        return `0:${maxValue + 1}:1`;
    }

    const deducation = 1;
    const multipler = 2;

    const pow10Log = Math.pow(10, Math.ceil(Math.log10(maxValue / range) - deducation));
    const roundStep = Math.ceil(maxValue / range / pow10Log) * pow10Log;
    const newMaxValue = maxValue - (maxValue % roundStep) + roundStep * multipler;
    return `0:${newMaxValue}:${roundStep}`;
}


export const lineChartCommonProperty: LineAndAreaChartCommonProperty = {
    type: 'line',
    plotRuleText: '%v',
    plotRulerule: '%v <= 0',
    stacked: false,
};

export const lineAreaChartCommonProperty: LineAndAreaChartCommonProperty = {
    type: 'area',
    plotRuleText: '%total',
    plotRulerule: '%total <= 0',
    stacked: true,
};
