import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData: FormData = await request.formData();
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    if (name === "" || password === "") throw new Error("Validation error");

    const isUserAlreadyThere = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    if (isUserAlreadyThere) throw new Error("user already there");

    await prisma.user.create({
      data: {
        name: name,
        password: password,
      },
    });

    return redirect("/signin");
  } catch (error) {
    return Response.json(
      { error: "true", message: (error as Error).message },
      {
        status: 400,
      }
    );
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center h-screen">
      <Form className="flex flex-col gap-4" method="post">
        <p>Signup Form</p>
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
