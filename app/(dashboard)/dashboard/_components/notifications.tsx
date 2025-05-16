import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Bell } from "lucide-react"
  

export const Notifications = () => {
  return (
    <div>
        <Popover>
  <PopoverTrigger>
    <Button variant="outline" size="icon">
      <Bell className="size-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>

    </div>
  )
}
