import { getFormStats } from '@/actions/form'
import React from 'react'
import { StatCards } from './stats-cards'

export const StatCardWrapper = async() => {
    const stats = await getFormStats()
  return (
<StatCards loading={false} statsData={stats}/>
)
}
