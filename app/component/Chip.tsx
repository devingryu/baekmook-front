import { Box, type SxProps, useTheme, type Theme } from "@mui/material";
import { type ReactNode } from "react";

export interface ChipProps {
  children?: ReactNode;
  sx: SxProps<Theme>;
}

const Chip = ({ children, sx }: ChipProps) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          borderRadius: "3px",
          padding: "2px 4px",
          backgroundColor: theme.colors.m3.primary,
          color: theme.colors.m3.onPrimary,
          ...sx,
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Chip;
