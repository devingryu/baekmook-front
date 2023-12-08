import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useState } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { formToObj, objToForm } from "app/utils/util";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
import { type PostRegisterRequest } from "app/apis/auth";
import { api } from "~/axios.server";
import { STRING_EMAIL, STRING_EMAIL_REQUIRED, STRING_JOB, STRING_JOB_LECTURER, STRING_JOB_STUDENT, STRING_NAME, STRING_NAME_REQUIRED, STRING_PASSWORD, STRING_PASSWORD_CHECK, STRING_PASSWORD_DOES_NOT_MATCH, STRING_PASSWORD_REQUIRED, STRING_REGISTER, STRING_REGISTER_COMPLETE, STRING_REGISTER_TITLE, STRING_STUDENT_ID, STRING_STUDENT_ID_REQUIRED, STRING_UNKNOWN_ERROR } from "~/resources/strings";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const req = formToObj(body) as PostRegisterRequest | null;
  if (req != null) {
    try {
      await api.post('/api/register', req);

      session.flash("message", {
        text: STRING_REGISTER_COMPLETE,
        type: "success",
      });
      return redirect("/login", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err: any) {
      return (
        err.response?.data?.messageTranslated ??
        STRING_UNKNOWN_ERROR
      );
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
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    passwordCheck: "",
    studentId: "",
    position: "student",
  });
  const [errFlag, setErrFlag] = useState({
    email: false,
    name: false,
    password: false,
    passwordCheck: false,
    studentId: false,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (name == "passwordCheck") {
      setErrFlag((prev) => ({
        ...prev,
        passwordCheck: inputs.password != value,
      }));
    }
  };
  const runValidation = () => {
    setErrFlag((_prev) => ({
      email: inputs.email.length <= 0,
      name: inputs.name.length <= 0,
      password: inputs.password.length <= 0,
      passwordCheck: inputs.password != inputs.passwordCheck,
      studentId: inputs.studentId.length <= 0,
    }));
    return !Object.values(errFlag).includes(true);
  };
  const onSubmit = () => {
    runValidation() &&
      submit(
        objToForm(
          (({ passwordCheck, position, ...o }) => ({
            ...o,
            isLecturer: position === "lecturer",
          }))(inputs)
        ),
        { method: "post" }
      );
  };

  return (
    <Stack direction="column" spacing={2.5}>
      <Stack direction="column" spacing={1} alignItems="center">
        <AssignmentIndIcon sx={{ width: "2em", height: "2em" }} />
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          {STRING_REGISTER_TITLE}
        </Typography>
      </Stack>

      <TextField
        error={errFlag.email}
        helperText={errFlag.email ? STRING_EMAIL_REQUIRED : null}
        label={STRING_EMAIL}
        variant="outlined"
        name="email"
        value={inputs.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        error={errFlag.name}
        helperText={errFlag.name ? STRING_NAME_REQUIRED : null}
        label={STRING_NAME}
        variant="outlined"
        name="name"
        value={inputs.name}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        error={errFlag.password}
        helperText={errFlag.password ? STRING_PASSWORD_REQUIRED : null}
        label={STRING_PASSWORD}
        type="password"
        variant="outlined"
        name="password"
        value={inputs.password}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        error={inputs.password !== inputs.passwordCheck}
        helperText={
          inputs.password !== inputs.passwordCheck
            ? STRING_PASSWORD_DOES_NOT_MATCH
            : null
        }
        label={STRING_PASSWORD_CHECK}
        type="password"
        variant="outlined"
        name="passwordCheck"
        value={inputs.passwordCheck}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        error={errFlag.studentId}
        helperText={errFlag.studentId ? STRING_STUDENT_ID_REQUIRED : null}
        label={STRING_STUDENT_ID}
        name="studentId"
        value={inputs.studentId}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
      <FormControl>
        <FormLabel>{STRING_JOB}</FormLabel>
        <RadioGroup
          name="position"
          value={inputs.position}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="student" control={<Radio />} label={STRING_JOB_STUDENT} />
          <FormControlLabel
            value="lecturer"
            control={<Radio />}
            label={STRING_JOB_LECTURER}
          />
        </RadioGroup>
      </FormControl>
      {actionData && (
        <Typography variant="body2" color="red">
          {actionData}
        </Typography>
      )}
      <Button
        variant="contained"
        disableElevation
        sx={{ flex: 1, marginLeft: 2 }}
        onClick={() => onSubmit()}
      >
        {STRING_REGISTER}
      </Button>
    </Stack>
  );
};

export default Index;
