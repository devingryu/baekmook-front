import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams, useRouteLoaderData, useSubmit } from "@remix-run/react";
import {
  STRING_CANCEL,
  STRING_DEFAULT_EMPTY,
  STRING_LOGIN_REQUIRED,
  STRING_REMOVAL,
  STRING_WITHDRAWAL_COMPLETED,
  STRING_WITHDRAWAL_CONFIRM_DIALOG_SUBTITLE,
  STRING_WITHDRAWAL_CONFIRM_DIALOG_TITLE,
  STRING_UNKNOWN_ERROR,
  STRING_JOB_STUDENT,
} from "~/resources/strings";
import type { loader as lecturesLoader } from "~/routes/_sidebar.lectures_.$id/route";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import Gravatar from "react-gravatar";
import { useState } from "react";
import type User from "~/common/User";
import { formToObj, objToForm } from "~/utils/util";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
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

  if (req.lectureId) {
    const { newSession, ...resp } = await processResponse(
      { method: "post", url: "/api/v1/lecture/withdraw", data: req },
      session
    );

    const targetSession = newSession ?? session;
    targetSession.flash("message", {
      text: resp.data
        ? STRING_WITHDRAWAL_COMPLETED
        : resp.error?.messageTranslated ?? STRING_UNKNOWN_ERROR,
      type: resp.data ? "success" : "error",
    });
    return json(null, {
      headers: {
        "Set-Cookie": await commitSession(targetSession),
      },
    });
  } else {
    return null;
  }
}

const Index = () => {
  const theme = useTheme();
  const submit = useSubmit();
  const params = useParams();
  const lecture = useRouteLoaderData<typeof lecturesLoader>(
    "routes/_sidebar.lectures_.$id"
  )?.data;

  const [removalDialog, setRemovalDialog] = useState<User | null>(null);

  const handleOpenEnrollDialog = (user: User) => {
    setRemovalDialog(user);
  };
  const handleDismissEnrollDialog = () => {
    setRemovalDialog(null);
  };
  const handleConfirmEnrollDialog = () => {
    removalDialog &&
      submit(objToForm({ lectureId: params.id, userId: removalDialog.id }), {
        method: "post",
      });
    setRemovalDialog(null);
  };

  return lecture?.students?.length ? (
    <>
      <List sx={{ maxWidth: "600px", m: "0 auto" }}>
        {lecture.students.map((it) => (
          <ListItem
            key={it.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleOpenEnrollDialog(it)}>
                <DeleteIcon sx={{ color: theme.palette.error.dark }} />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Gravatar
                style={{ borderRadius: "50%" }}
                size={42}
                email={it.email}
              />
            </ListItemAvatar>
            <ListItemText primary={it.name} secondary={it.studentId} />
          </ListItem>
        ))}
      </List>
      <Dialog open={removalDialog != null} onClose={handleDismissEnrollDialog}>
        <DialogTitle>{STRING_WITHDRAWAL_CONFIRM_DIALOG_TITLE.format(removalDialog?.name ?? STRING_JOB_STUDENT)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {STRING_WITHDRAWAL_CONFIRM_DIALOG_SUBTITLE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDismissEnrollDialog}
            sx={{ color: theme.colors.m3.outlineVariant }}
          >
            {STRING_CANCEL}
          </Button>
          <Button onClick={handleConfirmEnrollDialog} autoFocus sx={{color: theme.palette.error.dark}}>
            {STRING_REMOVAL}
          </Button>
        </DialogActions>
      </Dialog>
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
        {STRING_DEFAULT_EMPTY}
      </Typography>
    </Stack>
  );
};

export default Index;
