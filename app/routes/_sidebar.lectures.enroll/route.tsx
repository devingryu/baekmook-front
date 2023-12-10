import { Pagination, Stack, Typography, useTheme } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import type LecturesResponse from "~/common/Lecture";
import LectureList from "~/component/LectureList";
import {
  STRING_DEFAULT_EMPTY,
  STRING_LOGIN_REQUIRED,
} from "~/resources/strings";
import processResponse from "~/axios.server";

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

  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  const { newSession, ...resp } = await processResponse<LecturesResponse>(
    { method: "get", url: `/api/v1/lecture`, params: { page } },
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
  const { data } = useLoaderData<typeof loader>();
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const lectures = data?.lectures;
  const totalPages = data?.totalPages;
  const currentPage = +(searchParams.get("page") ?? 1) || 1;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    page != 1
      ? searchParams.set("page", page.toString())
      : searchParams.delete("page");
    setSearchParams(searchParams);
  };

  return (
    <>
      {lectures && lectures.length ? (
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
            {STRING_DEFAULT_EMPTY}
          </Typography>
        </Stack>
      )}
      {totalPages && (
        <Pagination
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          count={totalPages}
          page={currentPage}
          disabled={currentPage <= 1}
          onChange={handlePageChange}
        />
      )}
    </>
  );
};

export default Index;
