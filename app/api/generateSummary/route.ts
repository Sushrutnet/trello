import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, welcome the user always as Mr.sushrut and say welcome to the Sushrut todos app! Limits the response to 200 characters`,
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do in progress and done, then tell the user to have a productive day! Here's the data : ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  // Check if the response structure matches your expectation
  if (response && response.choices && response.choices[0] && response.choices[0].message) {
    const responseData = response.choices[0].message;

    return NextResponse.json(responseData);
  } else {
    console.error("Invalid response structure");
    return new Response("Invalid response structure", { status: 500 });
  }
}
