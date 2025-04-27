
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

interface CalendarViewProps {
  events: {
    date: Date
    type: 'workout' | 'nutrition' | 'wellness'
    title: string
  }[]
  onDateSelect: (date: Date) => void
}

export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      onDateSelect(date)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          modifiers={{
            event: (date) =>
              events.some(
                (event) =>
                  format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              ),
          }}
          modifiersClassNames={{
            event: 'bg-primary/10 font-bold',
          }}
        />
      </CardContent>
    </Card>
  )
}
