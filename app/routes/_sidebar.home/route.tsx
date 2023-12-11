import { Typography } from "@mui/material";
import { type MetaFunction } from "@remix-run/node";
import { STRING_DASHBOARD } from "~/resources/strings";

export const meta: MetaFunction = () => {
  return [
    {
      title: STRING_DASHBOARD,
    },
  ];
};

const Index = () => {
  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        {STRING_DASHBOARD}
      </Typography>
    </>
  );
};
export default Index;
