import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { formToObj } from "~/utils/util";
import { commitSession, getSession } from "~/session.server";
import { type AuthInfo } from "~/common/User";
import { api } from "~/axios.server";
import { STRING_EMAIL, STRING_LOGIN, STRING_LOGIN_PROCESSING, STRING_LOGIN_TITLE, STRING_PASSWORD, STRING_REGISTER, STRING_UNKNOWN_ERROR, STRING_WELCOME_MESSAGE } from "~/resources/strings";

export async function loader({
  request
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  )
  if (session.has("token")) {
    return redirect("/")
  }

  return null
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  )
  const body = await request.formData()
  const req = formToObj(body)
  if (req != null) {
    try {
      const resp = await api.post(`/api/login`, req)

      session.flash("message", { text: STRING_WELCOME_MESSAGE.format(resp.data.me.name), type: 'success'})
      session.set("userInfo", resp.data.me)
      session.set("token", resp.data.token)
      session.set("authInfo", req as AuthInfo)
      return redirect('/home', {
        headers: {
          "Set-Cookie": await commitSession(session)
        }
      })
    } catch (err: any) {
      return err.response?.data?.messageTranslated ?? STRING_UNKNOWN_ERROR
    }
  }
}

const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: isMobile ? "start" : "center",
      }}
    >
      {isMobile ? (
        <Box sx={{ marginTop: "4em", padding: "0 1em", width: "100%" }}>
          {CardContent()}
        </Box>
      ) : (
        <Card variant="outlined" sx={{ width: "400px", padding: "1em" }}>
          {CardContent()}
        </Card>
      )}
    </div>
  );
};

const CardContent = () => {
  const navigation = useNavigation()
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })
  const actionData = useActionData<typeof action>()
  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="column" spacing={1} alignItems="center">
        <ModeIcon sx={{ width: "2em", height: "2em" }} />
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          {STRING_LOGIN_TITLE}
        </Typography>
      </Stack>
      <Form method="post">
        <Stack direction="column" spacing={2.5}>
          <TextField
            name="email"
            label={STRING_EMAIL}
            variant="outlined"
            value={inputs.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="password"
            label={STRING_PASSWORD}
            type="password"
            variant="outlined"
            value={inputs.password}
            onChange={handleChange}
            fullWidth
          />
          {actionData && <Typography variant="body2" color="red">{actionData}</Typography>}
          <Box sx={{ display: "flex" }}>
            <Button variant="text" component={Link} to="/register">
              {STRING_REGISTER}
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ flex: 1, marginLeft: 2 }}
              disabled={navigation.state != 'idle' || !((inputs.email.length > 0) && (inputs.password.length > 0))}
              type="submit"
            >
              {navigation.state == 'idle' ? STRING_LOGIN : STRING_LOGIN_PROCESSING}
            </Button>
          </Box>
        </Stack>
      </Form>
    </Stack>
  );
};

export default Index;
