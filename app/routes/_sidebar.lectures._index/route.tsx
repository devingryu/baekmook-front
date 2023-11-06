import { Stack, Typography, useTheme } from "@mui/material";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type LecturesResponse from "~/common/Lecture";
import LectureList from "~/component/LectureList";
import { commitSession, getSession } from "~/session";
import ModeIcon from "@mui/icons-material/Mode";
import { STRING_LOGIN_REQUIRED, STRING_MY_LECTURE_EMPTY } from "~/resources/strings";
import { processResponse } from "~/axios.server";

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

  const { newSession, ...resp } = await processResponse<LecturesResponse>(
    { method: "get", url: "/api/v1/lecture", params: { isMine: true } },
    session
  );
  return json(
    resp,
    newSession && {
      headers: {
        "Set-Cookie": await commitSession(newSession),
      },
    }
  );
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
            {STRING_MY_LECTURE_EMPTY}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Index;
