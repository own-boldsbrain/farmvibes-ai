export enum TimeAverages {
  HOURLY = 'hourly',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export const mockTimeAverageToggleHourly = {
  timeAverage: TimeAverages.HOURLY,
};

export const mockTimeAverageToggleDaily = {
  timeAverage: TimeAverages.DAILY,
};
