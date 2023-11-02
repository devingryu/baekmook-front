import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ModeIcon from "@mui/icons-material/Mode";
import { type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";
import type LecturesResponse from "~/common/Lecture";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: "로그인이 필요합니다.", type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  try {
    const resp = await axios.get<LecturesResponse>(
      `${process.env.API_URL}/api/v1/lecture`,
      {
        headers: {
          Authorization: session.get("token"),
        },
      }
    );

    return json(
      { data: resp.data },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } catch (err: any) {
    return json(null);
  }
}

const Index = () => {
  const data = useLoaderData<typeof loader>();
  const lectures = data?.data?.lectures;
  const theme = useTheme();

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        수강신청
      </Typography>
      {lectures ? (
        <Grid container spacing={0.5} sx={{ mt: 1 }}>
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
      ) : (
        <Stack direction="column" alignItems="center" sx={{ mt: 3 }}>
          <ModeIcon
            sx={{
              width: "128px",
              height: "128px",
              color: theme.colors.m3.outlineVariant,
            }}
          />
          <Typography
            variant="h5"
            textAlign="center"
            color={theme.colors.m3.outlineVariant}
            sx={{ wordBreak: "keep-all" }}
          >
            수강 가능한 과목이 없습니다.
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Index;
