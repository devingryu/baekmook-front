import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type Post } from "~/apis/post";
import { commitSession, getSession } from "~/session.server";
import ModeIcon from "@mui/icons-material/Mode";
import Gravatar from "react-gravatar";
import { useTypographyStyles } from "~/utils/util";
import { sanitize } from "isomorphic-dompurify";
import processResponse from "~/axios.server";
import { STRING_NOTICE_EMPTY } from "~/resources/strings";

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

const Index = () => {
  const theme = useTheme();
  const quillStyle = useTypographyStyles();
  const { data: posts, error: err } = useLoaderData<typeof loader>();
  return posts?.length ? (
    <>
      {posts.map((it) => (
        <Card variant="outlined" key={it.id} sx={{ mt: 2 }}>
          <CardHeader
            avatar={
              <Gravatar
                style={{ borderRadius: "50%" }}
                size={36}
                email={it.registerer.email}
              />
            }
            title={it.title}
            titleTypographyProps={{ variant: "body1", fontWeight: "bold" }}
            subheader={`${it.registerer.name} ⋅ ${it.creationTimeFormatted}`}
          />
          <CardContent sx={{ pt: 0 }}>
            <Box
              sx={{ ...quillStyle }}
              dangerouslySetInnerHTML={{
                __html: sanitize(it.content),
              }}
            />
          </CardContent>
        </Card>
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
