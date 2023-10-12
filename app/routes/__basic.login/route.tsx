import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { Link } from "@remix-run/react";

const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: isMobile ? "start" : "center",
      }}
    >
      {isMobile ? (
        <Box sx={{ marginTop: "4em", padding: "0 1em", width: "100%" }}>
          {cardContent()}
        </Box>
      ) : (
        <Card variant="outlined" sx={{ width: "400px", padding: "1em" }}>
          {cardContent()}
        </Card>
      )}
    </div>
  );
};

const cardContent = () => {
  return (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="column" spacing={1} alignItems="center">
        <ModeIcon sx={{ width: "2em", height: "2em" }} />
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          백묵 로그인
        </Typography>
      </Stack>

      <TextField label="이메일" variant="outlined" fullWidth />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        fullWidth
      />
      <Box sx={{ display: "flex" }}>
        <Button variant="text" component={Link} to="/register">
          회원가입
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={{ flex: 1, marginLeft: 2 }}
        >
          로그인
        </Button>
      </Box>
    </Stack>
  );
};

export default Index;
