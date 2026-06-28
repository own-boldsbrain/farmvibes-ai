const mockScale = (x: number) => x;
mockScale.range = () => [0, 100];
mockScale.ticks = () => [0, 50, 100];
mockScale.domain = () => [0, 100];

export const mockRowProps = {
  scale: mockScale,
  label: 'Mock Row',
  value: 50,
  maxStorageCapacity: 100,
  isStorage: false,
  formatValue: (x: any) => `${x} MW`,
};
