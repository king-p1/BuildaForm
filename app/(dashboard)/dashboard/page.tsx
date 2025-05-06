import { currentUser } from "@clerk/nextjs/server"; 
import { UserWelcomeClient } from "./_components/user-welcome";
import { DashboardFormClient } from "./_components/form-dash";
import { getUserForms } from "@/actions/form";
import { StatsDashboard } from "./_components/stats-dash";
import { SubmissionTrendsChart } from "./_components/submission-trends-chart";
import { QuickActions } from "./_components/quick-actions";
import { ActivityFeed } from "./_components/activity-feed";
import { PerformanceMetrics } from "./_components/performance-metrics";

async function DashboardPage() {
  const user = await currentUser();
  const {formData} = await getUserForms();

  // Convert single form to array if needed
  const forms = Array.isArray(formData) ? formData : [formData];
  
  // Extract form IDs from forms array
  const formIds = forms?.map(form => form?.id) || [];
  
  const userData = user ? {
    firstName: user.firstName,
    fullName: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
  } : null;

  return (
    <div className="p-2 w-full flex flex-col gap-6">
      <UserWelcomeClient userData={userData} />
      <QuickActions forms={forms} />
      
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full h-full">
            <DashboardFormClient forms={forms} />
          </div>
          <div className="w-full h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
              <StatsDashboard />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <PerformanceMetrics formIds={formIds} />
          </div>
          <div className="h-full">
            <ActivityFeed formIds={formIds} />
          </div>
        </div>

        <div className="w-full">
          <SubmissionTrendsChart />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;