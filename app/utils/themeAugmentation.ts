import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      m3: {
        primary: string;
        onPrimary: string;
        primaryContainer: string;
        onPrimaryContainer: string;
        secondary: string;
        onSecondary: string;
        secondaryContainer: string;
        onSecondaryContainer: string;
        tertiary: string;
        onTertiary: string;
        tertiaryContainer: string;
        onTertiaryContainer: string;
        error: string;
        errorContainer: string;
        onError: string;
        onErrorContainer: string;
        background: string;
        onBackground: string;
        surface: string;
        onSurface: string;
        surfaceVariant: string;
        onSurfaceVariant: string;
        outline: string;
        inverseOnSurface: string;
        inverseSurface: string;
        inversePrimary: string;
        shadow: string;
        surfaceTint: string;
        outlineVariant: string;
        scrim: string;
      }
      primary: {
        0: string;  
        10: string; 
        20: string; 
        25: string; 
        30: string; 
        35: string; 
        40: string; 
        50: string; 
        60: string; 
        70: string; 
        80: string; 
        90: string; 
        95: string; 
        98: string; 
        99: string; 
        100: string;
      };
      secondary: {
        0: string;  
        10: string; 
        20: string; 
        25: string; 
        30: string; 
        35: string; 
        40: string; 
        50: string; 
        60: string; 
        70: string; 
        80: string; 
        90: string; 
        95: string; 
        98: string; 
        99: string; 
        100: string;
      };
    };
  }
  interface ThemeOptions {
    colors?: {
      m3?: {
        primary: string;
        onPrimary: string;
        primaryContainer: string;
        onPrimaryContainer: string;
        secondary: string;
        onSecondary: string;
        secondaryContainer: string;
        onSecondaryContainer: string;
        tertiary: string;
        onTertiary: string;
        tertiaryContainer: string;
        onTertiaryContainer: string;
        error: string;
        errorContainer: string;
        onError: string;
        onErrorContainer: string;
        background: string;
        onBackground: string;
        surface: string;
        onSurface: string;
        surfaceVariant: string;
        onSurfaceVariant: string;
        outline: string;
        inverseOnSurface: string;
        inverseSurface: string;
        inversePrimary: string;
        shadow: string;
        surfaceTint: string;
        outlineVariant: string;
        scrim: string;
      }
      primary?: {
        0?: string;  
        10?: string; 
        20?: string; 
        25?: string; 
        30?: string; 
        35?: string; 
        40?: string; 
        50?: string; 
        60?: string; 
        70?: string; 
        80?: string; 
        90?: string; 
        95?: string; 
        98?: string; 
        99?: string; 
        100?: string;
      };
      secondary?: {
        0?: string;  
        10?: string; 
        20?: string; 
        25?: string; 
        30?: string; 
        35?: string; 
        40?: string; 
        50?: string; 
        60?: string; 
        70?: string; 
        80?: string; 
        90?: string; 
        95?: string; 
        98?: string; 
        99?: string; 
        100?: string;
      };
    };
  }
}

export const lightTheme = createTheme({
  colors: {
    m3: {
      primary: '#296b29',
      onPrimary: '#ffffff',
      primaryContainer: '#acf4a2',
      onPrimaryContainer: '#002203',
      secondary: '#53634e',
      onSecondary: '#ffffff',
      secondaryContainer: '#d6e8ce',
      onSecondaryContainer: '#111f0f',
      tertiary: '#38656a',
      onTertiary: '#ffffff',
      tertiaryContainer: '#bcebf0',
      onTertiaryContainer: '#002022',
      error: '#ba1a1a',
      errorContainer: '#ffdad6',
      onError: '#ffffff',
      onErrorContainer: '#410002',
      background: '#fcfdf6',
      onBackground: '#1a1c19',
      surface: '#fcfdf6',
      onSurface: '#1a1c19',
      surfaceVariant: '#dee5d8',
      onSurfaceVariant: '#42493f',
      outline: '#73796f',
      inverseOnSurface: '#f1f1eb',
      inverseSurface: '#2f312d',
      inversePrimary: '#91d888',
      shadow: '#000000',
      surfaceTint: '#296b29',
      outlineVariant: '#c2c8bd',
      scrim: '#000000',
    },
    primary: {
      0: "#000000",
      10: "#002203",
      20: "#003907",
      25: "#00460b",
      30: "#0b5313",
      35: "#1c5f1e",
      40: "#296b29",
      50: "#438540",
      60: "#5da057",
      70: "#76bb6f",
      80: "#91d888",
      90: "#acf4a2",
      95: "#c9ffbe",
      98: "#ecffe3",
      99: "#f6ffef",
      100: "#ffffff",
    },
    secondary: {
      0: "#000000",
      10: "#111f0f",
      20: "#253423",
      25: "#303f2d",
      30: "#3b4b38",
      35: "#475743",
      40: "#53634e",
      50: "#6b7c66",
      60: "#85957f",
      70: "#9fb098",
      80: "#baccb3",
      90: "#d6e8ce",
      95: "#e4f6dc",
      98: "#edffe4",
      99: "#f6ffef",
      100: "#ffffff",
    },
  },
  palette: {
    primary: {
      light: "#5da057",
      main: "#296b29",
      dark: "#0b5313",
    },
    secondary: {
      light: "#85957f",
      main: "#53634e",
      dark: "#3b4b38",
    },
    background: {
      paper: "#fcfdf6",
      default: "#fcfdf6",
    },
    text: {
      primary: "#1a1c19"
    }
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Pretendard Variable', 'Pretendard',\
      'Roboto', 'Noto Sans KR', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell',\
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
});
