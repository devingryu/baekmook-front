import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { useAuth } from "~/utils/util";
import AddIcon from "@mui/icons-material/Add";
import { STRING_ENROLL, STRING_MY_LECTURE, STRING_OPEN_LECTURE } from "~/resources/strings";

const Index = () => {
  const auth = useAuth();
  const isStudent = auth.userInfo.role != "lecturer";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const loc = useLocation();
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
            // onClick={() => onSubmit()}
          >
            {STRING_OPEN_LECTURE}
          </Button>
        )}
      </Box>
      <Outlet />
    </>
  );
};

export default Index;
