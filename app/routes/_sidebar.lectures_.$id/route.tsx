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
  ActionFunctionArgs,
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
import axios from "axios";
import { type Lecture } from "~/common/Lecture";
import { getSession, commitSession } from "~/session";
import ConstructionIcon from "@mui/icons-material/Construction";
import Gravatar from "react-gravatar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ModeIcon from "@mui/icons-material/Mode";
import { formToObj, objToForm } from "~/utils/util";
import { useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: "로그인이 필요합니다.", type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  try {
    const resp = await axios.get<Lecture>(
      `${process.env.API_URL}/api/v1/lecture/${params.id}`,
      {
        headers: {
          Authorization: session.get("token"),
        },
      }
    );

    return json({ lecture: resp.data });
  } catch (err: any) {
    return json(null);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: "로그인이 필요합니다.", type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const body = await request.formData();
  const req = formToObj(body);
  console.log(req);

  if (req.lectureId) {
  try {
    await axios.post(`${process.env.API_URL}/api/v1/lecture/join`, req, {
      headers: {
        Authorization: session.get("token"),
      },
    });

    session.flash("message", {
      text: "수강신청이 완료되었습니다!",
      type: "success",
    });
    return json(null, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err: any) {
    session.flash("message", {
      text:
        err.response?.data?.messageTranslated ??
        "알 수 없는 오류가 발생했습니다.",
      type: "error",
    });
    return json(null, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
} else {
  return null
}
}

const Index = () => {
  const data = useLoaderData<typeof loader>();
  const lecture = data?.lecture;
  const theme = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const matches = useMatches();
  const params = useParams();
  const submit = useSubmit();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              수강신청
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
                  <Tabs value={0}>
                    <Tab label="공지사항" />
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
            <DialogTitle>수강신청하시겠습니까?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                한 번 수강신청하면 취소할 수 없습니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDismissEnrollDialog}
                sx={{ color: theme.colors.m3.outlineVariant }}
              >
                취소
              </Button>
              <Button onClick={handleConfirmEnrollDialog} autoFocus>
                수강신청
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
            존재하지 않는 강의입니다.
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
      )}
    </>
  );
};
export default Index;
