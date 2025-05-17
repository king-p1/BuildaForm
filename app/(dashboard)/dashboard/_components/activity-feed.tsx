/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Activity, Archive, Clock, MessageSquare, Star, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormActivities } from "@/actions/form";
import Link from "next/link";
import { TbEditCircle, TbEditCircleOff, TbFolderX } from "react-icons/tb";
import { LuFolderCheck } from "react-icons/lu";

interface ActivityFeedProps {
  formIds: string[];
}

export function ActivityFeed({ formIds }: ActivityFeedProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!formIds || formIds.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch activities for all forms
        const activitiesPromises = formIds.map(formId => getFormActivities(formId));
        const activitiesResults = await Promise.all(activitiesPromises);
        
        // Merge all activities into a single array
        const allActivities = activitiesResults.flatMap(result => result.activities);
        
        // Sort activities by creation date (most recent first)
        const sortedActivities = allActivities.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 8); // Limit to 5 most recent activities
        
        setActivities(sortedActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [formIds]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <Activity className="size-4  text-green-800" />;
      case 'comment':
        return <MessageSquare className="size-4  text-blue-800" />;
      case 'visit':
        return <Users className="size-4  text-purple-800" />;
      case 'archived':
        return <Archive className="size-4  text-red-500" />;
      case 'unarchived':
        return <Archive className="size-4  text-emerald-500" />;
      case 'favorited':
        return <Star className="size-4  text-yellow-800" fill='yellow' />;
      case 'unfavorited':
        return <Star className="size-4 text-yellow-800" />;
      case 'deactivated':
        return <TbFolderX className="size-4  text-red-600" />;
      case 'activated':
        return <LuFolderCheck className="size-4  text-green-800" />;
      case 'started_editing':
        return <TbEditCircle className="size-4  text-indigo-600" />;
      case 'stopped_editing':
        return <TbEditCircleOff className="size-4  text-amber-500" />;
      default:
        return <Activity className="size-4  text-gray-800" />;
    }
  };

  if (loading) {
    return <ActivityFeedSkeleton />;
  }

  if (activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No recent activity found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full p-2 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.type === 'visit' && `New visit from ${activity.userName || 'someone'}`}
                  {activity.type === 'submission' && `${activity.userName || 'Someone'} submitted a form`}
                  {activity.type === 'comment' && `${activity.userName || 'Someone'} commented on a form`}
                  
                  {activity.type === 'archived' && `${activity.userName || 'Someone'} archived form`}
                  {activity.type === 'unarchived' && `${activity.userName || 'Someone'} unarchived form`}
           
                  {activity.type === 'favorited' && `${activity.userName || 'Someone'} favorited form`}
                  {activity.type === 'unfavorited' && `${activity.userName || 'Someone'} unfavorited form`}
                 
                  {activity.type === 'deactivated' && `${activity.userName || 'Someone'} deactivated form`}
                  {activity.type === 'activated' && `${activity.userName || 'Someone'} activated form`}
          
                  {activity.type === 'started_editing' && `${activity.userName || 'Someone'}  edited a form`}
                  {activity.type === 'stopped_editing' && `${activity.userName || 'Someone'}  stopped editing a form`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-primary cursor-pointer hover:underline">
        <Link href='/dashboard/logs'>
            View all recent activity
        </Link>
          </CardFooter>
    </Card>
  );
}

function ActivityFeedSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}