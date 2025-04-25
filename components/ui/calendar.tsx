"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"


export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      classNames={{
        today: `text-secondary-foreground font-bold`,
        selected: `bg-primary border-primary text-primary-foreground rounded-full flex items-center justify-center`,
        root: `${defaultClassNames.root} bg-background shadow-lg p-5`,
        chevron: `${defaultClassNames.chevron} fill-primary`,
        day_button: `w-10 h-10 rounded-full`,
        day_today: `border-border`,
      }}
      
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 