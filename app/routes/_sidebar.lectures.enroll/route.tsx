import { Stack, Typography, useTheme } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type LecturesResponse from "~/common/Lecture";
import LectureList from "~/component/LectureList";
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
      api.get<LecturesResponse>(`/api/v1/lecture`, {
        headers: {
          Authorization: session.get("token"),
        },
      }),
    session
  );

  return json(resp);
}

const Index = () => {
  const { data } = useLoaderData<typeof loader>();
  const lectures = data?.lectures;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {lectures ? (
        <LectureList
          lectures={lectures}
          showChip={true}
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
            수강 가능한 과목이 없습니다.
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default Index;
