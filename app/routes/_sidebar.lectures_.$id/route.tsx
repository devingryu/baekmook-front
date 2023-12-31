import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  redirect,
  type LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { type Lecture } from "~/common/Lecture";
import { getSession, commitSession } from "~/session.server";
import ConstructionIcon from "@mui/icons-material/Construction";
import Gravatar from "react-gravatar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ModeIcon from "@mui/icons-material/Mode";
import { formToObj, objToForm } from "~/utils/util";
import { useState } from "react";
import {
  STRING_CANCEL,
  STRING_ENROLL,
  STRING_ENROLL_CONFIRM_DIALOG_SUBTITLE,
  STRING_ENROLL_CONFIRM_DIALOG_TITLE,
  STRING_GO_BACK,
  STRING_LECTURE_ENROLL_COMPLETED,
  STRING_LECTURE_NON_EXISTENT,
  STRING_LOGIN_REQUIRED,
  STRING_MANAGE_STUDENTS,
  STRING_NOTICE,
  STRING_UNKNOWN_ERROR,
} from "~/resources/strings";
import processResponse from "~/axios.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: STRING_LOGIN_REQUIRED, type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const { newSession, ...resp } = await processResponse<Lecture>(
    { method: "get", url: `/api/v1/lecture/${params.id}` },
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
      { method: "post", url: "/api/v1/lecture/join", data: req },
      session
    );

    const targetSession = newSession ?? session;
    targetSession.flash("message", {
      text: resp.data
        ? STRING_LECTURE_ENROLL_COMPLETED
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
  const data = useLoaderData<typeof loader>();
  const lecture = data?.data;
  const theme = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const matches = useMatches();
  const params = useParams();
  const submit = useSubmit();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tabs = [
    { label: STRING_NOTICE, value: `/lectures/${params.id}` },
    ... (lecture?.lecturer ? [{ label: STRING_MANAGE_STUDENTS, value: `/lectures/${params.id}/manage` }] : []),
  ];

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);

  const useTab = !loc.pathname.endsWith("write");
  const useFab =
    matches[matches.length - 1]?.id == "routes/_sidebar.lectures_.$id._index";

  const handleMoveBack = () => nav(-1);
  const handleOpenEnrollDialog = () => {
    setOpenEnrollDialog(true);
  };
  const handleDismissEnrollDialog = () => {
    setOpenEnrollDialog(false);
  };
  const handleConfirmEnrollDialog = () => {
    submit(objToForm({ lectureId: params.id }), { method: "post" });
    setOpenEnrollDialog(false);
  };

  return (
    <>
      {lecture ? (
        <>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* <IconButton
              onClick={handleMoveBack}
              sx={{ width: (isMobile ? "36px" : "48px"), height: (isMobile ? "36px" : "48px") }}
            >
              <ArrowBackIosNewIcon
                sx={{ color: theme.colors.m3.onBackground }}
              />
            </IconButton> */}
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              {lecture.name}
            </Typography>
          </Stack>
          {lecture.description && !isMobile && (
            <Typography variant="body1" color={theme.colors.m3.outline}>
              {lecture.description}
            </Typography>
          )}
          <Stack direction="row" alignItems="center">
            {lecture.lecturers.map((it) => (
              <Box sx={{ display: "flex", alignItems: "center" }} key={it.id}>
                <Gravatar
                  style={{ borderRadius: "50%" }}
                  size={20}
                  email={it.email}
                />
                <Typography variant="subtitle1" sx={{ ml: 0.5, mr: 1 }}>
                  {it.name}
                </Typography>
              </Box>
            ))}
          </Stack>
          {!lecture.involved && (
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddShoppingCartIcon />}
              onClick={handleOpenEnrollDialog}
              sx={{ m: "16px 0" }}
            >
              {STRING_ENROLL}
            </Button>
          )}
          {lecture.involved && (
            <>
              {useTab ? (
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    position: "sticky",
                  }}
                >
                  <Tabs value={loc.pathname}>
                    { tabs.map(tab => (
                      <Tab {...tab} key={tab.value} component={Link} to={tab.value}/>
                    ))}
                  </Tabs>
                </Box>
              ) : (
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", m: "8px 0" }}
                ></Box>
              )}
              <Outlet />
            </>
          )}
          {lecture.lecturer && useFab && (
            <Fab
              color="secondary"
              sx={{
                m: 0,
                position: "fixed",
                right: theme.spacing(2),
                bottom: theme.spacing(2),
              }}
              component={Link}
              to={`/lectures/${params.id}/write`}
            >
              <ModeIcon />
            </Fab>
          )}
          <Dialog open={openEnrollDialog} onClose={handleDismissEnrollDialog}>
            <DialogTitle>{STRING_ENROLL_CONFIRM_DIALOG_TITLE}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {STRING_ENROLL_CONFIRM_DIALOG_SUBTITLE}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDismissEnrollDialog}
                sx={{ color: theme.colors.m3.outlineVariant }}
              >
                {STRING_CANCEL}
              </Button>
              <Button onClick={handleConfirmEnrollDialog} autoFocus>
                {STRING_ENROLL}
              </Button>
            </DialogActions>
          </Dialog>
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
            {STRING_LECTURE_NON_EXISTENT}
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
      )}
    </>
  );
};
export default Index;
