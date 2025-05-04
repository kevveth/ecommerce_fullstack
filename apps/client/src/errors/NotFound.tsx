import { Error } from "./Error";

export const NotFound = () => {
    return (
      <>
        <Error code={404} message="Page not found" />
      </>
    );
  };