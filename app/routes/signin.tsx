import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (name === "" || password === "") throw new Error("Vlaidation error");

    const getUser = await prisma.user.findFirst({
      where: {
        name: name,
        password: password,
      },
    });

    if (!getUser) throw new Error("No user with this name exist");

    return redirect("/dashboard");
  } catch (error) {
    return Response.json({
      status: 400,
      message: (error as Error).message,
      error: true,
    });
  }
}

export default function Signin() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex justify-center items-center h-screen">
      <Form className="flex flex-col gap-4" method="post">
        <p>Signin Form</p>
        <input
          className="border-2 border-neutral-700 outline-0 p-2 rounded-md"
          placeholder="name"
          name="name"
          type="text"
        />
        <input
          className="border-2 border-neutral-700 outline-0 p-2 rounded-md"
          placeholder="password"
          name="password"
          type="password"
        />
        <button type="submit" className="p-4 rounded-lg bg-violet-400">
          Submit
        </button>
        {actionData?.error ? (
          <p className="text-red-500 ">{actionData?.message}</p>
        ) : null}
      </Form>
    </div>
  );
}
