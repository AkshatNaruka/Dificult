export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Background colors
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceSecondary: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textDimmed: string;
    
    // Accent colors
    primary: string;
    secondary: string;
    accent: string;
    
    // Typing colors
    correct: string;
    incorrect: string;
    current: string;
    untyped: string;
    
    // UI element colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Border and shadow
    border: string;
    shadow: string;
  };
  font?: {
    family: string;
    weight: string;
  };
}

export interface ThemeConfig {
  currentTheme: string;
  fontSize: number;
  fontFamily: string;
  smoothCaret: boolean;
  showKeyboard: boolean;
}