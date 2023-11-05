import { Stack, Typography, useTheme } from "@mui/material";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type LecturesResponse from "~/common/Lecture";
import LectureList from "~/component/LectureList";
import { commitSession, getSession } from "~/session";
import ModeIcon from "@mui/icons-material/Mode";
import { STRING_LOGIN_REQUIRED } from "~/resources/strings";
import api, { processResponse } from "~/axios.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: STRING_LOGIN_REQUIRED, type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const resp = await processResponse(
    () =>
      api.get<LecturesResponse>(`${process.env.API_URL}/api/v1/lecture`, {
        headers: {
          Authorization: session.get("token"),
        },
        params: {
          isMine: true,
        },
      }),
    session
  );
  return json(resp);
}

const Index = () => {
  const data = useLoaderData<typeof loader>();
  const lectures = data?.data?.lectures;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {lectures ? (
        <LectureList
          lectures={lectures}
          onClick={(id) => navigate(`/lectures/${id}`)}
        />
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
