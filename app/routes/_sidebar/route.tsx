import { type LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLocation, useSubmit } from "@remix-run/react";
import sidebarCss from "app/routes/_sidebar/style.css";
import Gravatar from "react-gravatar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ModeIcon from "@mui/icons-material/Mode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  IconButton,
  Stack,
  type SvgIconTypeMap,
  useTheme,
  Box,
  Typography,
  Button,
  Popover,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { type OverridableComponent } from "@mui/material/OverridableComponent";
import { useAuth } from "~/utils/util";
import { useState } from "react";
import { STRING_BAEKMOOK, STRING_DASHBOARD, STRING_LECTURE, STRING_LOGIN, STRING_LOGOUT, STRING_MYPAGE } from "~/resources/strings";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebarCss },
];

type SidebarItemProps = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  linkTo: string;
  isSelected: boolean;
  caption: string;
};

interface TopBarProps {
  isMobile: boolean
}

const SidebarItem = ({
  Icon,
  linkTo,
  isSelected,
  caption,
}: SidebarItemProps) => {
  const theme = useTheme();
  return (
    <Stack
      component={Link}
      to={linkTo}
      direction="column"
      sx={[
        {
          width: "100%",
          transitionDuration: "0.2s",
          color: "inherit",
          textDecoration: "inherit",
        },
        !isSelected && {
          "@media (pointer: fine)": {
            ":hover .icon-box": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          ":active .icon-box": {
            backgroundColor: theme.palette.action.selected,
          },
        },
      ]}
    >
      <Box
        className="icon-box"
        sx={{
          width: "100%",
          height: "28px",
          borderRadius: "50vh",
          backgroundColor: isSelected
            ? theme.colors.m3.secondaryContainer
            : theme.colors.m3.surface,
        }}
      >
        <Icon
          sx={{
            display: "block",
            width: "24px",
            height: "24px",
            margin: "2px auto",
            color: isSelected
              ? theme.colors.m3.onSurfaceVariant
              : theme.colors.m3.onSecondaryContainer,
          }}
        />
      </Box>
      <Typography
        variant="caption"
        textAlign="center"
        sx={{ userSelect: "none", fontSize: "12px" }}
      >
        {caption}
      </Typography>
    </Stack>
  );
};

const Sidebar = () => {
  const loc = useLocation();
  const auth = useAuth();
  
  return (
    <div className="sidenav">
      <Stack
        sx={{ padding: "0 8px" }}
        alignItems="center"
        spacing={"14px"}
        direction="column"
      >
        <Box height="3px" />
        <SidebarItem
          Icon={DashboardIcon}
          linkTo="/home"
          isSelected={loc.pathname === "/home"}
          caption={STRING_DASHBOARD}
        />
        {auth && <SidebarItem
          Icon={HistoryEduIcon}
          linkTo="/lectures"
          isSelected={loc.pathname.startsWith('/lectures')}
          caption={STRING_LECTURE}
        />}
      </Stack>
    </div>
  );
};
const TopBar = ({isMobile}: TopBarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const open = Boolean(anchorEl);
  const auth = useAuth();
  const submit = useSubmit();
  const theme = useTheme();

  const handleProfileClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handlePopoverClose();
    submit(null, { method: "post", action: "/logout" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "64px",
        padding: "0 16px 0 0",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: theme.colors.m3.surface,
        opacity: 0.9,
      }}
    >
      <IconButton sx={{ width: "36px", height: "36px", margin: isMobile ? "0 8px 0 12px" : "0 18px" }}>
        <MenuIcon />
      </IconButton>
      <ModeIcon sx={{ height: "36px", width: "36px" }} />
      <Typography
        variant="subtitle1"
        sx={{
          marginLeft: 1,
          fontWeight: "bold",
          fontSize: "22px",
          userSelect: "none",
        }}
      >
        {STRING_BAEKMOOK}
      </Typography>
      {auth?.userInfo ? (
        <>
          <Gravatar
            style={{ marginLeft: "auto", borderRadius: "50%" }}
            size={40}
            email={auth?.userInfo.email}
            onClick={handleProfileClick}
          />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              backdropFilter: "blur(3px)",
            }}
          >
            <Stack
              direction="row"
              sx={{ padding: 2, minWidth: "210px" }}
              alignItems="center"
            >
              <Gravatar
                style={{ borderRadius: "50%" }}
                size={42}
                email={auth?.userInfo.email}
              />
              <Stack direction="column" marginLeft={1}>
                <Typography variant="body1" fontWeight="bold">
                  {auth?.userInfo?.name}
                </Typography>
                <Typography variant="body2">
                  {auth?.userInfo?.studentId}
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Button
              variant="text"
              startIcon={<AccountCircleIcon />}
              fullWidth
              component={Link}
              to="/mypage"
              onClick={handlePopoverClose}
              sx={{
                justifyContent: "flex-start",
                padding: "10px 0 10px 20px",
                fontSize: "15px",
              }}
            >
              {STRING_MYPAGE}
            </Button>
            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              fullWidth
              color="error"
              onClick={handleLogout}
              sx={{
                justifyContent: "flex-start",
                padding: "10px 0 10px 20px",
                fontSize: "15px",
              }}
            >
              {STRING_LOGOUT}
            </Button>
          </Popover>
        </>
      ) : (
        <Button
          component={Link}
          to="/login"
          variant="contained"
          disableElevation
          sx={{ marginLeft: "auto" }}
        >
          {STRING_LOGIN}
        </Button>
      )}
    </Box>
  );
};
const Index = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {!isMobile && <Sidebar />}
      <TopBar isMobile={isMobile}/>
      <div className="content" style={{ marginLeft: isMobile ? 0 : "72px" }}>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Outlet />
        </Box>
      </div>
    </>
  );
};
export default Index;
