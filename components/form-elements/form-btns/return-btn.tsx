import { ImExit } from "react-icons/im";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ReturnBtn = () => {

  return (
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
    <Button
    size='icon'
    asChild
    className="flex justify-center items-center"
    
    >
        <Link href='/dashboard'
        className="flex justify-center items-center"
        >
        <ImExit className="h-5 w-5"/>
        </Link>
    </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Click this button to return to your dashboard</p>
    </TooltipContent>
  </Tooltip>
    

          </TooltipProvider>

  )
}
