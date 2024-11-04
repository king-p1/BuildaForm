import { StatCardProps } from '@/lib/types'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export const StatCard = ({title,helperText,className,loading,value,icon}:StatCardProps) => {
  return (
    <Card className={className}>
        <CardHeader className='flex flex-row justify-between items-center'>
 <CardTitle className='text-lg text-muted-foreground -mt-3 font-semibold'>{title}</CardTitle>
{icon}
        </CardHeader>
   <CardContent>
    <div className="text-2xl font-bold -mt-2 mb-2">
        {loading && (<Skeleton><span className='opacity-0'>0</span></Skeleton>)}
        {!loading && value}
    </div>
    <p className='text-sm text-muted-foreground pt-1'>
        {helperText}
    </p>
   </CardContent>
    </Card>
  )
}
