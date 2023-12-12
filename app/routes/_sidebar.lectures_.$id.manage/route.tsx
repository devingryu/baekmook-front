import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouteLoaderData } from "@remix-run/react";
import { STRING_DEFAULT_EMPTY } from "~/resources/strings";
import type { loader as lecturesLoader } from "~/routes/_sidebar.lectures_.$id/route";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import Gravatar from "react-gravatar";

const Index = () => {
  const theme = useTheme();
  const lecture = useRouteLoaderData<typeof lecturesLoader>(
    "routes/_sidebar.lectures_.$id"
  )?.data;
  return lecture?.students?.length ? (
    <List sx={{ maxWidth: "300px" }}>
      {lecture.students.map((it) => (
        <ListItem
          key={it.id}
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
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
