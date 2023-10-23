import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      primary: {
        0: string; // "#000000",
        10: string; // "#002203",
        20: string; // "#003907",
        25: string; // "#00460b",
        30: string; // "#0b5313",
        35: string; // "#1c5f1e",
        40: string; // "#296b29",
        50: string; // "#438540",
        60: string; // "#5da057",
        70: string; // "#76bb6f",
        80: string; // "#91d888",
        90: string; // "#acf4a2",
        95: string; // "#c9ffbe",
        98: string; // "#ecffe3",
        99: string; // "#f6ffef",
        100: string; // "#ffffff",
      };
      secondary: {
        0: string; // '#000000',
        10: string; // '#111f0f',
        20: string; // '#253423',
        25: string; // '#303f2d',
        30: string; // '#3b4b38',
        35: string; // '#475743',
        40: string; // '#53634e',
        50: string; // '#6b7c66',
        60: string; // '#85957f',
        70: string; // '#9fb098',
        80: string; // '#baccb3',
        90: string; // '#d6e8ce',
        95: string; // '#e4f6dc',
        98: string; // '#edffe4',
        99: string; // '#f6ffef',
        100: string; // '#ffffff',
      };
    };
  }
  interface ThemeOptions {
    colors?: {
      primary?: {
        0?: string; // "#000000",
        10?: string; // "#002203",
        20?: string; // "#003907",
        25?: string; // "#00460b",
        30?: string; // "#0b5313",
        35?: string; // "#1c5f1e",
        40?: string; // "#296b29",
        50?: string; // "#438540",
        60?: string; // "#5da057",
        70?: string; // "#76bb6f",
        80?: string; // "#91d888",
        90?: string; // "#acf4a2",
        95?: string; // "#c9ffbe",
        98?: string; // "#ecffe3",
        99?: string; // "#f6ffef",
        100?: string; // "#ffffff",
      };
      secondary?: {
        0?: string; // '#000000',
        10?: string; // '#111f0f',
        20?: string; // '#253423',
        25?: string; // '#303f2d',
        30?: string; // '#3b4b38',
        35?: string; // '#475743',
        40?: string; // '#53634e',
        50?: string; // '#6b7c66',
        60?: string; // '#85957f',
        70?: string; // '#9fb098',
        80?: string; // '#baccb3',
        90?: string; // '#d6e8ce',
        95?: string; // '#e4f6dc',
        98?: string; // '#edffe4',
        99?: string; // '#f6ffef',
        100?: string; // '#ffffff',
      };
    };
  }
}

export const lightTheme = createTheme({
  colors: {
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
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Pretendard Variable', 'Pretendard',\
      'Roboto', 'Noto Sans KR', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell',\
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
});
