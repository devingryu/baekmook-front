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
  type MetaFunction,
} from "@remix-run/node";
import { Form, useNavigate, useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";
import quillCss from "react-quill/dist/quill.snow.css";
import { ClientOnly } from "remix-utils/client-only";
import { TextEditor } from "~/component/TextEditor.client";
import ConstructionIcon from "@mui/icons-material/Construction";
import { commitSession, getSession } from "~/session.server";
import { formToObj, useTypographyStyles } from "~/utils/util";
import processResponse from "~/axios.server";
import {
  STRING_ERROR,
  STRING_GO_BACK,
  STRING_LACK_OF_AUTHORITY,
  STRING_POST_SUBMIT,
  STRING_TITLE,
  STRING_UNKNOWN_ERROR,
  STRING_WRITE_CONTENT_PLACEHOLDER,
  STRING_WRITE_POST,
} from "~/resources/strings";
import type { loader as lecturesLoader } from "~/routes/_sidebar.lectures_.$id/route";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: quillCss },
];

export const meta: MetaFunction<
  unknown,
  { "routes/_sidebar.lectures_.$id": typeof lecturesLoader }
> = ({ matches }) => {
  const lectureName = matches.find(
    (match) => match.id === "routes/_sidebar.lectures_.$id"
  )?.data.data?.name;
  return [
    {
      title: lectureName
        ? `${STRING_WRITE_POST} | ${lectureName}`
        : STRING_ERROR,
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const req = formToObj(body);

  if (req?.lectureId) {
    const { newSession, ...resp } = await processResponse(
      { method: "post", url: "/api/v1/lecture/write-post", data: req },
      session
    );

    if (resp.data) {
      return redirect(
        `/lectures/${req.lectureId}`,
        newSession && {
          headers: {
            "Set-Cookie": await commitSession(newSession),
          },
        }
      );
    } else {
      const targetSession = newSession ?? session;
      targetSession.flash("message", {
        text: resp.error?.messageTranslated ?? STRING_UNKNOWN_ERROR,
        type: "error",
      });
      return json(null, {
        headers: {
          "Set-Cookie": await commitSession(targetSession),
        },
      });
    }
  }
}

const Index = () => {
  const [content, setContent] = useState("");
  const theme = useTheme();
  const nav = useNavigate();
  const quillStyle = useTypographyStyles();
  const lecture = useRouteLoaderData<typeof lecturesLoader>("routes/_sidebar.lectures_.$id")?.data

  const handleMoveBack = () => nav(-1);

  return lecture?.lecturer ? (
    <Box
      sx={{
        ".ql-container .ql-editor": {
          ...quillStyle,
          minHeight: "300px",
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {STRING_WRITE_POST}
      </Typography>
      <Form method="post">
        <TextField
          name="title"
          placeholder={STRING_TITLE}
          variant="standard"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        />
        <ClientOnly fallback={null}>
          {() => (
            <TextEditor
              theme="snow"
              placeholder={STRING_WRITE_CONTENT_PLACEHOLDER}
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
            {STRING_POST_SUBMIT}
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
        {STRING_LACK_OF_AUTHORITY}
      </Typography>
      <Button
        variant="contained"
        disableElevation
        onClick={handleMoveBack}
        sx={{ mt: 2 }}
      >
        {STRING_GO_BACK}
      </Button>
    </Stack>
  );
};

export default Index;
