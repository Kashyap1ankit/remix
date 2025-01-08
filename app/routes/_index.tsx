import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData: FormData = await request.formData();
    console.log(formData);
    if (formData.name === " " || formData.password === " ")
      throw new Error("Validation error");

    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.json({ ok: "false" });
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  console.log("actions data", actionData);
  return (
    <div className="flex justify-center items-center h-screen">
      <Form className="flex flex-col gap-4" method="post">
        <p>Signup Form</p>
        <input
          className="border-2 border-neutral-700 outline-0 p-2 rounded-md"
          placeholder="name"
          name="name"
        />
        <input
          className="border-2 border-neutral-700 outline-0 p-2 rounded-md"
          placeholder="password"
          name="password"
        />
        <button type="submit" className="p-4 rounded-lg bg-violet-400">
          Submit
        </button>
      </Form>
    </div>
  );
}
