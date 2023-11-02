import { Stack, Typography, useTheme } from "@mui/material";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import type LecturesResponse from "~/common/Lecture";
import LectureList from "~/component/LectureList";
import { commitSession, getSession } from "~/session";
import ModeIcon from "@mui/icons-material/Mode";

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
        params: {
          isMine: true
        }
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
      {lectures ? (
        <LectureList lectures={lectures} />
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
            수강 중인 과목이 없습니다.
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Index;
