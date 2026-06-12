const defaultCo2Scale = {
  steps: [0, 150, 600, 800, 1100, 1500],
  colors: ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02', '#000'],
};

const colorblindCo2Scale = {
  steps: [0, 150, 600, 800, 1100, 1500],
  colors: ['#FFFFB0', '#E3BF66', '#BB833C', '#8B4D2B', '#4E241F', '#000'],
};

interface ThemeColor {
  co2Scale: {
    steps: number[];
    colors: string[];
  };
  oceanColor: string;
  strokeWidth: number;
  strokeColor: string;
  clickableFill: string;
  nonClickableFill: string;
}

interface Colors {
  colorblindDark: ThemeColor;
  dark: ThemeColor;
  colorblindBright: ThemeColor;
  bright: ThemeColor;
}
export const colors: Colors = {
  colorblindDark: {
    co2Scale: colorblindCo2Scale,
    oceanColor: '#09090B',
    strokeWidth: 0.25,
    strokeColor: '#27272A',
    clickableFill: '#18181B',
    nonClickableFill: '#18181B',
  },
  dark: {
    co2Scale: defaultCo2Scale,
    oceanColor: '#09090B',
    strokeWidth: 0.25,
    strokeColor: '#27272A',
    clickableFill: '#18181B',
    nonClickableFill: '#18181B',
  },
  colorblindBright: {
    co2Scale: colorblindCo2Scale,
    oceanColor: '#09090B',
    strokeWidth: 0.25,
    strokeColor: '#27272A',
    clickableFill: '#18181B',
    nonClickableFill: '#18181B',
  },
  bright: {
    co2Scale: defaultCo2Scale,
    oceanColor: '#09090B',
    strokeWidth: 0.25,
    strokeColor: '#27272A',
    clickableFill: '#18181B',
    nonClickableFill: '#18181B',
  },
};
