import {
  Grid,
  Card,
  CardActionArea,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { type Lecture } from "~/common/Lecture";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface LectureListProps {
  lectures: Lecture[]
}

const LectureList = ({lectures}: LectureListProps) => {
  const theme = useTheme();
  return (
    <Grid container spacing={0.5}>
      {lectures.map((it, index) => (
        <Grid item xs={12} key={index}>
          <Card variant="outlined">
            <CardActionArea sx={{ p: 1.5 }}>
              <Box display="flex">
                <Stack direction="column">
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
                    {it.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={theme.colors.m3.onSurfaceVariant}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {it.lecturers.reduce((acc, curr) => {
                      return acc ? acc + ", " + curr.name : curr.name;
                    }, "")}
                  </Typography>
                </Stack>
                <ChevronRightIcon
                  sx={{
                    m: "auto 0 auto auto",
                    color: theme.colors.m3.onSurfaceVariant,
                  }}
                />
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LectureList;
