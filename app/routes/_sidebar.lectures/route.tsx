import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, Outlet, useLocation, useSubmit } from "@remix-run/react";
import { formToObj, objToForm, useAuth } from "~/utils/util";
import AddIcon from "@mui/icons-material/Add";
import {
  STRING_CANCEL,
  STRING_ENROLL,
  STRING_LECTURE_DESCRIPTON,
  STRING_LECTURE_NAME,
  STRING_LOGIN_REQUIRED,
  STRING_MY_LECTURE,
  STRING_OPEN_LECTURE,
  STRING_OPEN_LECTURE_COMPLETE,
  STRING_UNKNOWN_ERROR,
} from "~/resources/strings";
import { useState } from "react";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import processResponse from "~/axios.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: STRING_LOGIN_REQUIRED, type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const body = await request.formData();
  const req = formToObj(body);

  const { newSession, ...resp } = await processResponse(
    { method: "post", url: "/api/v1/lecture/create", data: req },
    session
  );

  const targetSession = newSession ?? session;
  targetSession.flash("message", {
    text: resp.data
      ? STRING_OPEN_LECTURE_COMPLETE
      : resp.error?.messageTranslated ?? STRING_UNKNOWN_ERROR,
    type: resp.data ? "success" : "error",
  });
  return json(null, {
    headers: {
      "Set-Cookie": await commitSession(targetSession),
    },
  });
}

const Index = () => {
  const auth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const loc = useLocation();
  const submit = useSubmit();

  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });
  const isStudent = auth.userInfo.role != "lecturer";

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpenLectureDialog = () => {
    setOpenLectureDialog(true);
  };
  const handleDismissLectureDialog = () => {
    setOpenLectureDialog(false);
  };
  const handleConfirmLectureDialog = () => {
    submit(objToForm(inputs), { method: "post" });
    setInputs({ name: "", description: "" });
    setOpenLectureDialog(false);
  };

  const tabs = isStudent
    ? [
        {
          label: STRING_MY_LECTURE,
          link: "/lectures",
        },
        {
          label: STRING_ENROLL,
          link: "/lectures/enroll",
        },
      ]
    : [
        {
          label: STRING_MY_LECTURE,
          link: "/lectures",
        },
      ];
  return (
    <>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        {tabs.map((it, index) => (
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            key={it.link}
            component={Link}
            to={it.link}
            sx={[
              {
                transitionDuration: "0.05s",
                color: "inherit",
                textDecoration: "inherit",
              },
              loc.pathname != it.link && {
                opacity: "0.3",
                "&:hover": {
                  opacity: "0.6",
                },
              },
              index != 0 && {
                ml: isMobile ? 1 : 2,
              },
            ]}
          >
            {it.label}
          </Typography>
        ))}
        {!isStudent && (
          <Button
            color="secondary"
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            sx={{ ml: "auto" }}
            onClick={handleOpenLectureDialog}
          >
            {STRING_OPEN_LECTURE}
          </Button>
        )}
      </Box>
      <Outlet />
      <Dialog
        fullWidth={!isMobile}
        maxWidth="sm"
        fullScreen={isMobile}
        open={openLectureDialog}
        onClose={handleDismissLectureDialog}
      >
        <DialogTitle>{STRING_OPEN_LECTURE}</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={1}>
            <TextField
              name="name"
              label={STRING_LECTURE_NAME}
              variant="standard"
              value={inputs.name}
              onChange={handleChange}
              fullWidth={isMobile}
            />
            <TextField
              name="description"
              label={STRING_LECTURE_DESCRIPTON}
              variant="standard"
              value={inputs.description}
              onChange={handleChange}
              multiline
              rows={5}
              fullWidth={isMobile}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDismissLectureDialog}
            sx={{ color: theme.colors.m3.outlineVariant }}
          >
            {STRING_CANCEL}
          </Button>
          <Button onClick={handleConfirmLectureDialog}>
            {STRING_OPEN_LECTURE}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Index;
