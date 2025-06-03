"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AppointmentModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "09:00",
    title: "",
    type: "consulta",
  })

  useEffect(() => {
    if (selectedDate) {
      const now = new Date()
      const selectedDateObj = new Date(selectedDate)
      const isToday = selectedDateObj.toDateString() === now.toDateString()

      setFormData((prev) => ({
        ...prev,
        date: selectedDate,
        time: isToday
          ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
          : "09:00",
      }))
    }
  }, [selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()

    const now = new Date()
    const appointmentDateTime = new Date(formData.date + "T" + formData.time)

    if (appointmentDateTime < now) {
      alert("Por favor, selecione um horário futuro para o compromisso.")
      return
    }

    const newAppointment = {
      id: Date.now().toString(),
      time: formData.time,
      title: formData.title,
      type: formData.type,
    }

    onSave(formData.date, newAppointment)
    setFormData({ date: "", time: "09:00", title: "", type: "consulta" })
    onClose()
  }

  const handleDateChange = (date) => {
    const now = new Date()
    const selectedDateObj = new Date(date)
    const isToday = selectedDateObj.toDateString() === now.toDateString()

    setFormData((prev) => ({
      ...prev,
      date,
      time: isToday
        ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
        : prev.time,
    }))
  }

  const getMinTime = () => {
    if (!formData.date) return ""

    const now = new Date()
    const selectedDate = new Date(formData.date)
    const isToday = selectedDate.toDateString() === now.toDateString()

    if (isToday) {
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    }

    return ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Compromisso</DialogTitle>
          <DialogDescription>Adicione um novo compromisso ao seu calendário.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              min={getMinTime()}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ex: Consulta Cardiologista"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="exame">Exame</SelectItem>
                <SelectItem value="terapia">Terapia</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-health-blue to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Salvar Compromisso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentModal
