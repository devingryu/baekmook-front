import { Button, Stack, Typography, useTheme } from "@mui/material";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  STRING_DASHBOARD,
  STRING_LOGIN,
  STRING_LOGIN_PROMPT,
  STRING_TIMELINE,
  STRING_WORKING_ON_LECTURER_DASHBOARD,
} from "~/resources/strings";
import { useAuth } from "~/utils/util";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ConstructionIcon from "@mui/icons-material/Construction";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { commitSession, getSession } from "~/session.server";
import { type Post } from "~/apis/post";
import processResponse from "~/axios.server";
import PostCard from "~/component/PostCard";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.data?.userInfo?.role == "student") {
    const { newSession, ...resp } = await processResponse<Post[]>(
      { method: "get", url: `/api/v1/lecture/recent-posts` },
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
  } else return json({data: undefined, error: undefined});
}

export const meta: MetaFunction = () => {
  return [
    {
      title: STRING_DASHBOARD,
    },
  ];
};

const Index = () => {
  const { data } = useLoaderData<typeof loader>();
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const handlePostClick = (post: Post) => {
    post.lecture && navigate(`/lectures/${post.lecture.id}`)
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        {STRING_DASHBOARD}
      </Typography>
      {auth == null ? (
        <Stack direction="column" alignItems="center" sx={{ mt: 3 }}>
          <VpnKeyIcon
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
            {STRING_LOGIN_PROMPT}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            component={Link}
            to="/login"
            sx={{ mt: 2 }}
          >
            {STRING_LOGIN}
          </Button>
        </Stack>
      ) : auth.userInfo.role == "student" ? (
        <>
          <Typography
            variant="h5"
            sx={{ wordBreak: "keep-all", mt: 1 }}
          >
            {STRING_TIMELINE}
          </Typography>
          { data && data?.map( it =>
            <PostCard post={it} key={it.id} onClick={handlePostClick}/>
          )}
        </>
      ) : (
        <Stack direction="column" alignItems="center" sx={{ mt: 3 }}>
          <ConstructionIcon
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
            {STRING_WORKING_ON_LECTURER_DASHBOARD}
          </Typography>
        </Stack>
      )}
    </>
  );
};
export default Index;
