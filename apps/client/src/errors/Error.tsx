import { Link } from "react-router";

interface ErrorProps {
  code?: number;
  message?: string;
}

export function Error(error: ErrorProps) {
  return (
    <>
      <h1>{error.code ?? 500} Error</h1>
      {error.message && <p>{error.message}</p>}
      <Link to="/">
        <button>Go back to Home</button>
      </Link>
    </>
  );
}
