import { StatCard } from "./stat-card";
import { LuView } from "react-icons/lu";
import { StatCardsProps } from "@/lib/types";

export const StatCards = ({loading,statsData}:StatCardsProps) => {
  return (
    <div className="w-full gap-4 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* create a file to map through all this and fill into the component */}
<StatCard 
title='Total visits'
icon={<LuView className="text-blue-500"/>}
helperText={'All time form visits'}
value={statsData?.visits?.toLocaleString()}
loading={loading}
className='shadow-md shadow-blue-600'
/>

<StatCard 
title='Total submissions'
icon={<LuView className="text-yellow-500"/>}
helperText={'All time form submissions'}
value={statsData?.submissions?.toLocaleString()}
loading={loading}
className='shadow-md shadow-yellow-600'
/>

<StatCard 
title='Submission Rate'
icon={<LuView className="text-green-500"/>}
helperText={'Visit the form submissions'}
value={statsData?.submissionRate?.toLocaleString()+'%'}
loading={loading}
className='shadow-md shadow-green-600'
/>

<StatCard 
title='Bounce Rate'
icon={<LuView className="text-red-500"/>}
helperText={'Visits without interactions'}
value={statsData?.bounceRate?.toLocaleString() +'%'}
loading={loading}
className='shadow-md shadow-red-600'
/>

    </div>
  )
}
