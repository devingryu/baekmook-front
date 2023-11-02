import { Box, Button, Typography } from "@mui/material";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { useAuth } from "~/utils/util";
import AddIcon from "@mui/icons-material/Add";

const Index = () => {
  const auth = useAuth();
  const isStudent = auth.userInfo.role != "lecturer";
  const loc = useLocation();
  const tabs = isStudent
    ? [
        {
          label: "내 강의",
          link: "/lectures",
        },
        {
          label: "수강신청",
          link: "/lectures/enroll",
        },
      ]
    : [
        {
          label: "내 강의",
          link: "/lectures",
        },
      ];
  return (
    <>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        {tabs.map((it, index) => (
          <Typography
            variant="h4"
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
                  opacity: "0.7",
                },
              },
              index != 0 && {
                ml: 2,
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
            강의 개설
          </Button>
        )}
      </Box>
      <Outlet />
    </>
  );
};

export default Index;
