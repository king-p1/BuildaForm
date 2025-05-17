"use client"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Bell, Check, CheckCheck, CircleCheck, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } from "@/actions/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { RxUpdate } from "react-icons/rx"
import { TbEditCircle } from "react-icons/tb"

type NotificationType = "SUBMISSION" | "FORM_EDIT" | "FORM_UPDATE" | "RESPONSE_EDIT";

type Notification = {
    id: string
    content: string
    type: NotificationType
    isRead: boolean
    createdAt: Date
    form: {
        name: string
        shareURL: string
    }
}

export const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const fetchNotifications = async (skip = 0) => {
        setIsLoading(true)
        try {
            const result = await getUserNotifications(5, skip)
            if (!result.error) {
                if (skip === 0) {
                    setNotifications(result.notifications)
                } else {
                    setNotifications(prev => [...prev, ...result.notifications])
                }
                setUnreadCount(result.unreadCount)
                setHasMore(result.hasMore)
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchNotifications()
        }
    }, [isOpen])

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id)
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, isRead: true } 
                        : notification
                )
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id)
            const notification = notifications.find(n => n.id === id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            
            // If we're deleting an unread notification, decrement the count
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error("Failed to delete notification:", error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead()
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            )
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error)
        }
    }

    const loadMore = () => {
        fetchNotifications(notifications.length)
    }

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'SUBMISSION':
                return <CircleCheck className="size-5" />
            case 'FORM_EDIT':
                return <Pencil className="size-5" />
            case 'FORM_UPDATE':
                return <RxUpdate className="size-5" />
            case 'RESPONSE_EDIT':
                return <TbEditCircle className="size-5" />

            default:
                return   <Bell className="size-5" />

        }
    }

    return (
        <div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>
                    <Button variant="default" size="icon" className="relative rounded-full">
                        <Bell className="size-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2" align="end">
                    <div className="flex items-center justify-between p-4">
                        <h3 className="font-medium">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleMarkAllAsRead}
                                className="h-8 text-xs"
                            >
                                <CheckCheck className="mr-1 h-3 w-3" />
                                Mark all as read
                            </Button>
                        )}
                    </div>
                    <Separator />
                    
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-1">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id} 
                                            className={cn(
                                                "flex items-start gap-2 p-3 hover:bg-muted/50 ",
                                                !notification.isRead && "bg-muted/30"
                                            )}
                                        >
                                            <div className="text-lg">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm">
                                                    {notification.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        {!notification.isRead && (
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-6 w-6"
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                            >
                                                                <Check className="h-3 w-3" />
                                                                <span className="sr-only">Mark as read</span>
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(notification.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                {notification.type.includes('FORM') && (
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="h-6 p-0 text-xs"
                                                        asChild
                                                    >
                                                        <Link href={
            notification.type === "FORM_UPDATE" 
                ? `/dashboard/form/${notification.form.id}` 
                : `/submit/${notification.form.shareURL}`
        }>
            {notification.type === "FORM_UPDATE" ? "View Form Details" : "View Form"}
        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            
                            {hasMore && (
                                <div className="p-2 text-center">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={loadMore}
                                        disabled={isLoading}
                                        className="w-full text-xs"
                                    >
                                        {isLoading ? "Loading..." : "Load more"}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}
