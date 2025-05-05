// "use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Users, MessageSquare } from "lucide-react";
import { getFormActivities } from "@/actions/form";

interface ActivityFeedProps {
  formId: string;
}

export async function ActivityFeed({ formId }: ActivityFeedProps) {
  const { activities } = await getFormActivities(formId);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <Activity className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'visit':
        return <Users className="h-4 w-4" />;
    }
  };

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
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.type === 'submission' && `${activity.userName} submitted`}
                  {activity.type === 'comment' && `${activity.userName} commented on`}
                  {activity.type === 'visit' && 'New visit'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 