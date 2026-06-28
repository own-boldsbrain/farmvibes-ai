export const mockMetricRatioValid = {
  value: 45,
  total: 100,
  format: (v: number) => `${v}%`,
};

export const mockMetricRatioInvalid = {
  value: Number.NaN,
  total: Number.NaN,
  format: (v: number) => `${v}%`,
};
