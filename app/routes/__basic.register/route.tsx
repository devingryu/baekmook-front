import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
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
        <AssignmentIndIcon sx={{ width: "2em", height: "2em" }} />
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          백묵 회원가입
        </Typography>
      </Stack>

      <TextField label="이메일" variant="outlined" fullWidth />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        variant="outlined"
        fullWidth
      />
      <TextField label="학번" type="password" variant="outlined" fullWidth />
      <FormControl>
        <FormLabel>직업</FormLabel>
        <RadioGroup row>
          <FormControlLabel value="student" control={<Radio />} label="학생" />
          <FormControlLabel
            value="instructor"
            control={<Radio />}
            label="교수자"
          />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        disableElevation
        sx={{ flex: 1, marginLeft: 2 }}
      >
        회원가입
      </Button>
    </Stack>
  );
};

export default Index;
