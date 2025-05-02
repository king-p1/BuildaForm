// import { Navbar } from "@/components/navigation/navbar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const Home = async() => {

  const user = await currentUser()

  if (user) redirect('/dashboard')
    
  return (
    <div>
{/* <Navbar/> */}

     this is the home page

      
    </div>
  );
};

export default Home;
