import { type LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    return ""
}
const Index = () => {
  return (
    <>
      <h1>Index!!</h1>
    </>
  );
};

export default Index;
