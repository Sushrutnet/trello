import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return  <div className="flex justify-center items-center h-screen">
  <div className="bg-#79155B p-8 shadow-lg rounded-xl w-full max-w-md md:max-w-xl">
    <SignIn />
  </div>
</div>
}