// import { authClient } from "@/lib/auth-client";

// interface SignUpWithEmailProps {
//   email: string;
//   password: string;
//   name: string;
//   image?: string | undefined;
//   callbackURL?: string | undefined;
// }
// export default async function signUp({
//   email,
//   password,
//   name,
//   image = undefined,
//   callbackURL = "/",
// }: SignUpWithEmailProps) {
//   const { data, error } = await authClient.signUp.email({
//     email,
//     password,
//     name,
//     image,
//     callbackURL,
//     fetchOptions: {
//       onRequest: (ctx) => {
//         // show loading
//       },
//       onSuccess: (ctx) => {
//         // redirect to the dashboard or sign in page
//       },
//       onError: (ctx) => {
//         // display the error message
//         alert(ctx.error.message);
//       },
//     },
//   });
// }
