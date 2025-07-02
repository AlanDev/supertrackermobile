export const SIZES = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 999,
  },
  
  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Font sizes
  font: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    title: 28,
    display: 36,
  },
  
  // Layout dimensions
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    inputHeight: 48,
    buttonHeight: 48,
    cardMinHeight: 120,
  },

  // Screen breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const;

export default SIZES; 