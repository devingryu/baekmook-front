import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  json,
} from "@remix-run/node";
import { Form, useMatches, useNavigate } from "@remix-run/react";
import { useState } from "react";
import quillCss from "react-quill/dist/quill.snow.css";
import { ClientOnly } from "remix-utils/client-only";
import { type Lecture } from "~/common/Lecture";
import { TextEditor } from "~/component/TextEditor.client";
import ConstructionIcon from "@mui/icons-material/Construction";
import { commitSession, getSession } from "~/session";
import { formToObj, useTypographyStyles } from "~/utils/util";
import api, { processResponse } from "~/axios.server";
import { STRING_UNKNOWN_ERROR } from "~/resources/strings";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: quillCss },
];

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const req = formToObj(body);

  if (req?.lectureId) {
    const resp = await processResponse(
      () =>
        api.post(`${process.env.API_URL}/api/v1/lecture/write-post`, req, {
          headers: {
            Authorization: session.get("token"),
          },
        }),
      session
    );

    if (resp.data) {
      return redirect(`/lectures/${req.lectureId}`);
    } else {
      session.flash("message", {
        text: resp.error?.messageTranslated ?? STRING_UNKNOWN_ERROR,
        type: "error",
      });
      return json(null, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }
}

const Index = () => {
  const [content, setContent] = useState("");
  const matches = useMatches();
  const theme = useTheme();
  const nav = useNavigate();
  const quillStyle = useTypographyStyles();
  const lecture = (
    matches?.find((e) => e.id == "routes/_sidebar.lectures_.$id")?.data as
      | { lecture: Lecture }
      | undefined
  )?.lecture;

  const handleMoveBack = () => nav(-1);

  return lecture?.lecturer ? (
    <Box
      sx={{
        ".ql-editor": {
          ...quillStyle,
          minHeight: "300px",
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        게시글 작성
      </Typography>
      <Form method="post">
        <TextField
          name="title"
          placeholder="제목"
          variant="standard"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        />
        <ClientOnly fallback={null}>
          {() => (
            <TextEditor
              theme="snow"
              placeholder="본문 작성..."
              onChange={setContent}
              value={content}
            />
          )}
        </ClientOnly>
        <input type="hidden" name="lectureId" value={lecture.id}></input>
        <input type="hidden" name="content" value={content} />
        <Box sx={{ display: "flex" }} mt={2}>
          <Button
            variant="contained"
            disableElevation
            sx={{ marginLeft: "auto" }}
            type="submit"
          >
            작성
          </Button>
        </Box>
      </Form>
    </Box>
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
        권한이 없습니다.
      </Typography>
      <Button
        variant="contained"
        disableElevation
        onClick={handleMoveBack}
        sx={{ mt: 2 }}
      >
        돌아가기
      </Button>
    </Stack>
  );
};

export default Index;
