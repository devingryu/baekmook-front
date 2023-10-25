import {
  Card,
  CardActionArea,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";

const Index = () => {
  const items = Array.from({ length: 10 }, () => "");
  const theme = useTheme();
  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        수강신청
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((_it, index) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
            <Card variant="outlined">
              <CardActionArea sx={{ p: 1.5 }}>
                <Typography
                  sx={{ fontSize: "12px" }}
                  color={theme.palette.text.secondary}
                >
                  COSE321
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  게임프로그래밍
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  이 강의는 쓰레기 강의입니다.이 강의는 쓰레기 강의입니다.이
                  강의는 쓰레기 강의입니다.이 강의는 쓰레기 강의입니다.이 강의는
                  쓰레기 강의입니다.이 강의는 쓰레기 강의입니다.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  박성빈, 한정현
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Index;
