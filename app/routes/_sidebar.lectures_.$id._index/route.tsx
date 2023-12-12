import {
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type Post } from "~/apis/post";
import { commitSession, getSession } from "~/session.server";
import ModeIcon from "@mui/icons-material/Mode";
import processResponse from "~/axios.server";
import {
  STRING_ERROR,
  STRING_NOTICE,
  STRING_NOTICE_EMPTY,
} from "~/resources/strings";
import type { loader as lecturesLoader } from "~/routes/_sidebar.lectures_.$id/route";
import PostCard from "~/component/PostCard";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    return json({ data: null, error: null });
  }

  const { newSession, ...resp } = await processResponse<Post[]>(
    { method: "get", url: `/api/v1/lecture/${params.id}/posts` },
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

export const meta: MetaFunction<
  typeof loader,
  { "routes/_sidebar.lectures_.$id": typeof lecturesLoader }
> = ({ matches }) => {
  const lectureName = matches.find(
    (match) => match.id === "routes/_sidebar.lectures_.$id"
  )?.data.data?.name;
  return [
    {
      title: lectureName ? `${STRING_NOTICE} | ${lectureName}` : STRING_ERROR,
    },
  ];
};

const Index = () => {
  const theme = useTheme();
  const { data: posts, error: err } = useLoaderData<typeof loader>();
  return posts?.length ? (
    <>
      {posts.map((it) => (
        <PostCard post={it} key={it.id} />
      ))}
    </>
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
        {err?.messageTranslated ?? STRING_NOTICE_EMPTY}
      </Typography>
    </Stack>
  );
};

export default Index;
