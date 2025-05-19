import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from '@/public/buildaform-1.png'
import { ChartNoAxesCombined } from "lucide-react";
import { BiCustomize } from "react-icons/bi";



const Home = async () => {
  const user = await currentUser();

  if (user) redirect('/dashboard');
    
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full items-center justify-center">
        <div className="w-full p-2 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={logo} 
              alt="BuildAForm Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="font-bold text-xl">BuildAForm</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Create powerful forms <span className="text-primary">in minutes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
          BuildAForm helps you create, share, and analyze forms with ease. 
          No coding required, just drag and drop.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="px-8">Get Started for Free</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="px-8">See Features</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 space-y-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything you need to build amazing forms</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Powerful features that make form creation simple, efficient, and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Form Builder</h3>
            <p className="text-muted-foreground">
              Drag-and-drop interface makes creating forms simple and intuitive.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ChartNoAxesCombined className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Get instant insights with powerful analytics and response tracking.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BiCustomize className="size-6" />

            </div>
            <h3 className="text-xl font-bold mb-2">Customizable Templates</h3>
            <p className="text-muted-foreground">
              Choose from a variety of templates or create your own custom designs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 w-full flex justify-center">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
            Join thousands of users who are already creating amazing forms with BuildAForm.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="px-8">Create Your First Form</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-auto w-full flex justify-center">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Image 
              src={logo} 
              alt="BuildAForm Logo" 
              width={60} 
              height={42} 
              className="h-8 w-8"
            />
            <span className="font-medium">BuildAForm</span>
          </div>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} OPAULO.inc - BuildAForm. 
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

