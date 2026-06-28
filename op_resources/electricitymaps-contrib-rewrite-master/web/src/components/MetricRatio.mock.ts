export const mockMetricRatioValid = {
  value: 45,
  total: 100,
  format: (v: number) => `${v}%`,
};

export const mockMetricRatioInvalid = {
  value: NaN,
  total: NaN,
  format: (v: number) => `${v}%`,
};
