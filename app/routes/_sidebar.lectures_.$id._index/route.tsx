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
import axios from "axios";
import { type Post } from "~/apis/post";
import { getSession } from "~/session";
import ModeIcon from "@mui/icons-material/Mode";
import Gravatar from "react-gravatar";
import { useTypographyStyles } from "~/utils/util";
import { sanitize } from "isomorphic-dompurify";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    return json(null);
  }

  try {
    const resp = await axios.get<Post[]>(
      `${process.env.API_URL}/api/v1/lecture/${params.id}/posts`,
      {
        headers: {
          Authorization: session.get("token"),
        },
      }
    );

    return json({ posts: resp.data, err: null });
  } catch (err: any) {
    return json({
      posts: null,
      err:
        err.response?.data?.messageTranslated ??
        "알 수 없는 오류가 발생했습니다.",
    });
  }
}

const Index = () => {
  const theme = useTheme();
  const quillStyle = useTypographyStyles();
  const { posts, err } = useLoaderData<typeof loader>() ?? {
    posts: null,
    err: null,
  };
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
        {err ?? "공지사항이 없습니다."}
      </Typography>
    </Stack>
  );
};

export default Index;
