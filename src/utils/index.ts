import _ from 'lodash';

interface ICalculateEvapoProps {
  RH: number;
  R_a: number;
  R_s: number;
  T: number;
  V: number;
}

/**
 * Calculates ET_0.
 * @param {ICalculateEvapoProps} props object with required constants (RH, R_a, R_sW, T, V).
 * @returns {number} calculated ET_0.
 */
export const calculateEvapo = (props: ICalculateEvapoProps): number => {
  const { RH, R_a, R_s, T, V } = props;

  // constants
  const e_s: number = 0.6108 * Math.exp((17.27 * T) / (T + 273));
  const e_a: number = (RH * e_s) / 100;
  const VPD: number = e_s - e_a;
  const delta: number = (4098 * e_s) / ((T + 273) ^ 2);
  const R_s0: number = 0.75 * R_a;
  const R_NL: number = 4.903 * (10 ^ -9) * ((T + 273) ^ 4) * (0.34 - 0.14 * Math.sqrt(e_a)) * 1.35 * (R_s / R_s0);
  const R_NS: number = 0.77 * R_s;
  const R_N: number = R_NS - R_NL;

  // calculation
  const ET_0: number = (0.408 * delta * R_N + 0.067 * V * ((900 * VPD) / (T + 273))) / (delta + 0.067 * (1 + 0.34 * V));

  return ET_0;
};

/**
 * Converts string to string containing only numeric characters.
 * TO BE FIXED
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
