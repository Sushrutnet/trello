import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <div className="flex justify-center items-center h-screen">
  <div className="bg-violet-300 p-8 shadow-md rounded-lg w-full max-w-md md:max-w-xl">
    <SignUp />
  </div>
</div>;
}