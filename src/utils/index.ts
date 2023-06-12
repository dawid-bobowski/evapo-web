import { saveAs } from 'file-saver';
import _ from 'lodash';

interface ICalculateEvapoProps {
  RH: number | null;
  R_a: number | null;
  R_s: number | null;
  T: number | null;
  V: number | null;
}

/**
 * Calculates ET_0.
 * @param {ICalculateEvapoProps} props object with required constants (RH, R_a, R_s, T, V).
 * @returns {number} calculated ET_0.
 */
export const calculateEvapo = (props: ICalculateEvapoProps): number | null => {
  const { RH, R_a, R_s, T, V } = props;

  if (RH !== null && R_a !== null && R_s !== null && T !== null && V !== null) {
    // constants
    const e_s: number = 0.6108 * Math.exp((17.27 * T) / (T + 273));
    const e_a: number = (RH * e_s) / 100;
    const VPD: number = e_s - e_a;
    const delta: number = (4098 * e_s) / (T + 273) ** 2;
    const R_s0: number = 0.75 * R_a;
    const R_NL: number =
      4.903 * 10 ** -9 * (T + 273) ** 4 * (0.34 - 0.14 * Math.sqrt(e_a)) * ((1.35 * R_s) / R_s0 - 0.35);
    const R_NS: number = 0.77 * R_s;
    const R_N: number = R_NS - R_NL;

    // calculation
    const ET_0: number = _.round(
      (0.408 * delta * R_N + (0.067 * 900 * V * VPD) / (T + 273)) / (delta + 0.067 * (1 + 0.34 * V)),
      2
    );

    return ET_0;
  } else return null;
};

/**
 * Converts string to string containing only numeric characters.
 * @param {string} text text to be converted.
 * @returns {string} converted text.
 */
export const convertToNumStr = (text: string): string => {
  let convertedText: string = text.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsedValue: number = parseFloat(convertedText);
  const convertedString: string = parsedValue.toString();
  return convertedString;
};

export const convertDate = (date: string): string => {
  let dateSplitted: string[] = date.split('-');
  dateSplitted[0] = dateSplitted[0].slice(0, 2);
  _.reverse(dateSplitted);
  return dateSplitted.join('.');
};

/**
 *
 * @param data table data.
 * @param from date from which to start calculation.
 * @param to date to which calculation should be done.
 * @param offset value of Y axis domain offset.
 * @returns array consisting of bottom and top Y axis domain values.
 */
export const getAxisYDomain = (
  data: ITableRow[] | IChartDataRow[],
  from: string,
  to: string,
  unit: string,
  offset: number
): number[] => {
  const startIndex: number = data.findIndex((item) => item.Data === from);
  const endIndex: number = data.findIndex((item) => item.Data === to);
  const refData: ITableRow[] | IChartDataRow[] = data.slice(startIndex, endIndex + 1);
  const keys: string[] = Object.keys(refData[0]).filter((key) => key !== 'Data' && _.startsWith(key, unit));

  let [bottom, top]: [bottom: number | string, top: number | string] = [
    refData[0][keys[0] as keyof IChartDataRow] || 0,
    refData[0][keys[0] as keyof IChartDataRow] || 0,
  ];

  _.forEach(refData, (rowData) => {
    _.forEach(keys, (key) => {
      const fieldValue: string | number | null = rowData[key as keyof IChartDataRow];
      if (fieldValue && fieldValue > top) top = fieldValue;
      if (fieldValue && fieldValue < bottom) bottom = fieldValue;
    });
  });

  return [_.round((bottom as number | 0) - offset, 1), _.round((top as number | 0) + offset, 1)];
};

/**
 * Calculate new date range for tables to overlap properly.
 * @param data1 first table data.
 * @param data2 second table data.
 * @returns object with start and end dates.
 */
export const calculateDateRange = (data1: ITableRow[], data2: ITableRow[]): IDateRange => {
  let from: string = data1[0].Data;
  let to: string = data1[data1.length - 1].Data;
  if (from < data2[0].Data) from = data2[0].Data;
  if (to > data2[data2.length - 1].Data) to = data2[data2.length - 1].Data;
  return { from, to };
};

const getCSVRowHeaders = (content: IChartDataRow[]): string => {
  const keys: string[] = Object.keys(content[0]).filter((key) => key !== 'Data');
  let headers: string = '"Data"';
  _.forEach(keys, (key) => {
    headers += `,"${key}"`;
  });
  headers += '\n';
  return headers;
};

const getCSVRows = (content: IChartDataRow[], left: string, right: string): string => {
  let text: string = '';
  content
    .filter((row) => row.Data >= left && row.Data <= right)
    .map((row) => {
      text += `"${row.Data}"`;
      _.forEach(
        Object.keys(row).filter((key) => key !== 'Data'),
        (key) => {
          text += `,"${row[key as keyof IChartDataRow]}"`;
        }
      );
      text += '\n';
    });
  return text;
};

const getCSVFileName = (chartNames: string[]): string => {
  let fileName: string = 'byd';
  _.forEach(chartNames, (name) => {
    fileName += `_${name.slice(4, 8)}`;
  });
  fileName += '_wdk';
  return fileName;
};

export const createTextFile = (content: IChartDataRow[], selectedChartNames: string[], left: string, right: string) => {
  let contentRows: string = getCSVRowHeaders(content) + getCSVRows(content, left, right);
  const blob = new Blob([contentRows], {
    type: 'text/csv',
  });
  saveAs(blob, getCSVFileName(selectedChartNames) + '.csv');
};
