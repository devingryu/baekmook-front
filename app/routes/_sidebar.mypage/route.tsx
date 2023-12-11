import { Grid, Typography } from "@mui/material";
import { type LoaderFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import {
  STRING_EMAIL,
  STRING_JOB,
  STRING_LOGIN_REQUIRED,
  STRING_MYPAGE,
  STRING_NAME,
  STRING_STUDENT_ID,
  STRING_UNKNOWN,
} from "~/resources/strings";
import { commitSession, getSession } from "~/session.server";
import { useAuth } from "~/utils/util";

export const meta: MetaFunction = () => {
  return [
    {
      title: STRING_MYPAGE,
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    session.flash("message", { text: STRING_LOGIN_REQUIRED, type: "error" });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return null;
}

interface GridItemProps {
  title: string;
  content: string;
}

const GridItem = ({ title, content }: GridItemProps) => (
  <>
    <Grid item xs={4} sm={2}>
      <Typography variant="body1" fontWeight="bold">
        {title}
      </Typography>
    </Grid>
    <Grid item xs={8} sm={10}>
      <Typography variant="body1">{content}</Typography>
    </Grid>
  </>
);

const Index = () => {
  const auth = useAuth();
  const userInfo = auth?.userInfo;
  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        {STRING_MYPAGE}
      </Typography>
      {userInfo && (
        <Grid container alignItems="center" rowSpacing={1.5} sx={{mt: 2}}>
          <GridItem title={STRING_EMAIL} content={userInfo.email} />
          <GridItem title={STRING_NAME} content={userInfo.name} />
          <GridItem title={STRING_STUDENT_ID} content={userInfo.studentId} />
          <GridItem title={STRING_JOB} content={userInfo.roleTranslated ?? STRING_UNKNOWN} />
        </Grid>
      )}
    </>
  );
};

export default Index;
