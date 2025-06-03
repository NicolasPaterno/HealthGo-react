"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Trash2 } from "lucide-react"

const Calendar = ({ appointments, onAddAppointment, onDeleteAppointment, showTitle = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateString = (day) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isPastDate = (day) => {
    const today = new Date()
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return dayDate < today && !isToday(day)
  }

  const getAppointmentTypeClass = (type) => {
    const typeClasses = {
      consulta: "bg-health-blue",
      exame: "bg-accent-red",
      terapia: "bg-accent-green",
      outro: "bg-gray-500",
    }
    return typeClasses[type] || typeClasses.outro
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (day) => {
    if (isPastDate(day)) return
    const dateString = formatDateString(day)
    onAddAppointment(dateString)
  }

  const handleDeleteAppointment = (dateString, appointmentId, e) => {
    e.stopPropagation()
    if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
      onDeleteAppointment(dateString, appointmentId)
    }
  }

  return (
    <div className="calendar-container bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
      {showTitle && (
        <div className="calendar-header flex justify-between items-center mb-8 pb-5 border-b-2 border-border-light">
          <h2 className="text-xl font-semibold text-gray-800">
            <CalendarIcon className="inline w-6 h-6 mr-3 text-health-blue" />
            Calendário de Compromissos
          </h2>
          <div className="calendar-nav flex items-center gap-4">
            <Button
              onClick={previousMonth}
              size="icon"
              className="bg-accent-blue hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="calendar-title text-xl font-semibold text-gray-800">
              {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </span>
            <Button
              onClick={nextMonth}
              size="icon"
              className="bg-accent-blue hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="calendar-grid grid grid-cols-7 gap-px bg-border-light rounded-xl overflow-hidden">
        {/* Day headers */}
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="calendar-day bg-gray-100 font-semibold text-gray-700 text-center py-3">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {getCalendarDays().map((day, index) => {
          if (!day) {
            return <div key={index} className="calendar-day other-month" />
          }

          const dateString = formatDateString(day)
          const dayAppointments = appointments[dateString] || []
          const isPast = isPastDate(day)
          const today = isToday(day)

          return (
            <div
              key={day}
              className={`calendar-day ${isPast ? "past-date" : "cursor-pointer hover:bg-health-blue-light"} ${today ? "today" : ""} ${dayAppointments.length > 0 ? "has-appointment" : ""} transition-all duration-300`}
              onClick={() => handleDayClick(day)}
            >
              <div className={`day-number ${isPast ? "text-gray-400" : ""}`}>{day}</div>

              {dayAppointments.length > 0 && (
                <div className="appointments-list mt-2 space-y-1">
                  {dayAppointments.map((appointment) => {
                    const appointmentDateTime = new Date(dateString + "T" + appointment.time)
                    const isPastAppointment = appointmentDateTime < new Date()

                    return (
                      <div
                        key={appointment.id}
                        className={`appointment-item text-xs p-1 rounded text-white flex justify-between items-center group ${getAppointmentTypeClass(appointment.type)} ${isPastAppointment ? "opacity-50" : ""}`}
                      >
                        <span className="truncate">
                          {appointment.time} - {appointment.title}
                        </span>
                        {!isPastAppointment && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            onClick={(e) => handleDeleteAppointment(dateString, appointment.id, e)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
