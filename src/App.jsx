"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Calendar from "./components/Calendar"
import ServiceCard from "./components/ServiceCard"
import PurchaseModal from "./components/PurchaseModal"
import AppointmentModal from "./components/AppointmentModal"
import LoginModal from "./components/LoginModal"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { servicesDatabase } from "./data/services"
import { UserCheck, Hotel, Plane, Brain, PieChart, CalendarIcon, ShoppingBag, Trash2 } from "lucide-react"

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMore, setShowMore] = useState({})
  const [selectedServices, setSelectedServices] = useLocalStorage("healthgo_selected_services", {})
  const [appointments, setAppointments] = useLocalStorage("healthgo_appointments", {
    "2024-12-28": [
      { id: "1", time: "14:30", title: "Cardiologista", type: "consulta" },
      { id: "2", time: "16:00", title: "Fisioterapia", type: "terapia" },
    ],
    "2024-12-29": [{ id: "3", time: "09:00", title: "Fisioterapia", type: "terapia" }],
    "2024-12-30": [{ id: "4", time: "07:30", title: "Exame de Sangue", type: "exame" }],
    "2025-01-02": [{ id: "5", time: "16:00", title: "Neurologista", type: "consulta" }],
    "2025-01-03": [{ id: "6", time: "10:30", title: "Terapia Ocupacional", type: "terapia" }],
  })
  const [user, setUser] = useLocalStorage("healthgo_user", null)

  // Modal states
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, service: null })
  const [appointmentModal, setAppointmentModal] = useState({ isOpen: false, selectedDate: null })
  const [loginModal, setLoginModal] = useState(false)

  const stats = {
    totalServices: Object.keys(selectedServices).length,
    scheduledServices: Object.values(selectedServices).filter((s) => s.status === "agendado").length,
    totalSaved: Object.values(selectedServices)
      .reduce((sum, service) => sum + service.price, 0)
      .toFixed(0),
  }

  const handlePurchase = (service, category) => {
    setPurchaseModal({
      isOpen: true,
      service: { ...service, category },
    })
  }

  const confirmPurchase = () => {
    if (!purchaseModal.service) return

    const newService = {
      ...purchaseModal.service,
      purchaseDate: new Date().toISOString(),
      status: "ativo",
    }

    setSelectedServices((prev) => ({
      ...prev,
      [purchaseModal.service.id]: newService,
    }))

    setPurchaseModal({ isOpen: false, service: null })
    alert("Serviço comprado com sucesso!")
  }

  const removeService = (serviceId) => {
    setSelectedServices((prev) => {
      const newServices = { ...prev }
      delete newServices[serviceId]
      return newServices
    })
  }

  const isServiceSelected = (serviceId) => {
    return !!selectedServices[serviceId]
  }

  const toggleShowMore = (category) => {
    setShowMore((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleAddAppointment = (dateString) => {
    setAppointmentModal({ isOpen: true, selectedDate: dateString })
  }

  const saveAppointment = (dateString, appointment) => {
    setAppointments((prev) => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), appointment].sort((a, b) => a.time.localeCompare(b.time)),
    }))
  }

  const deleteAppointment = (dateString, appointmentId) => {
    setAppointments((prev) => {
      const newAppointments = { ...prev }
      if (newAppointments[dateString]) {
        newAppointments[dateString] = newAppointments[dateString].filter(
          (appointment) => appointment.id !== appointmentId,
        )
        if (newAppointments[dateString].length === 0) {
          delete newAppointments[dateString]
        }
      }
      return newAppointments
    })
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const getUpcomingAppointments = () => {
    const today = new Date()
    const upcoming = []

    Object.keys(appointments).forEach((dateString) => {
      appointments[dateString].forEach((appointment) => {
        const appointmentDateTime = new Date(dateString + "T" + appointment.time)
        if (appointmentDateTime >= today) {
          upcoming.push({
            ...appointment,
            date: dateString,
          })
        }
      })
    })

    return upcoming
      .sort((a, b) => {
        const dateA = new Date(a.date + "T" + a.time)
        const dateB = new Date(b.date + "T" + b.time)
        return dateA - dateB
      })
      .slice(0, 5)
  }

  const getSummaryByCategory = () => {
    const categories = ["cuidadores", "hoteis", "passagens", "psicologos"]
    const summary = {}
    let totalSpent = 0

    categories.forEach((category) => {
      let categoryTotal = 0
      let categoryCount = 0

      Object.values(selectedServices).forEach((service) => {
        if (service.category === category) {
          categoryTotal += service.price
          categoryCount++
        }
      })

      totalSpent += categoryTotal
      summary[category] = { total: categoryTotal, count: categoryCount }
    })

    return { summary, totalSpent }
  }

  const renderDashboard = () => {
    const { summary, totalSpent } = getSummaryByCategory()
    const upcomingAppointments = getUpcomingAppointments()

    return (
      <div className="space-y-8">
        <Calendar
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onDeleteAppointment={deleteAppointment}
        />

        <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
          <CardHeader className="pb-5 border-b-2 border-border-light">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                <PieChart className="w-6 h-6 mr-3 text-health-blue" />
                Resumo de Gastos
              </CardTitle>
              <div className="text-4xl font-bold text-accent-green">R$ {totalSpent.toFixed(2)}</div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="summary-item bg-gray-50 p-5 rounded-xl text-center transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5">
                <UserCheck className="w-8 h-8 text-health-blue mx-auto mb-3" />
                <h4 className="text-lg text-gray-800 mb-1">Cuidadores</h4>
                <div className="text-xl font-semibold text-accent-green">R$ {summary.cuidadores.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{summary.cuidadores.count} serviços</div>
              </div>

              <div className="summary-item bg-gray-50 p-5 rounded-xl text-center transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5">
                <Hotel className="w-8 h-8 text-health-blue mx-auto mb-3" />
                <h4 className="text-lg text-gray-800 mb-1">Hotéis</h4>
                <div className="text-xl font-semibold text-accent-green">R$ {summary.hoteis.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{summary.hoteis.count} serviços</div>
              </div>

              <div className="summary-item bg-gray-50 p-5 rounded-xl text-center transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5">
                <Plane className="w-8 h-8 text-health-blue mx-auto mb-3" />
                <h4 className="text-lg text-gray-800 mb-1">Passagens Aéreas</h4>
                <div className="text-xl font-semibold text-accent-green">R$ {summary.passagens.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{summary.passagens.count} serviços</div>
              </div>

              <div className="summary-item bg-gray-50 p-5 rounded-xl text-center transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5">
                <Brain className="w-8 h-8 text-health-blue mx-auto mb-3" />
                <h4 className="text-lg text-gray-800 mb-1">Psicólogos</h4>
                <div className="text-xl font-semibold text-accent-green">R$ {summary.psicologos.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{summary.psicologos.count} serviços</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCalendar = () => (
    <div className="space-y-8">
      <Calendar
        appointments={appointments}
        onAddAppointment={handleAddAppointment}
        onDeleteAppointment={deleteAppointment}
        showTitle={true}
      />

      <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Próximos Compromissos</CardTitle>
        </CardHeader>
        <CardContent>
          {getUpcomingAppointments().length === 0 ? (
            <p className="text-gray-600">Nenhum compromisso agendado.</p>
          ) : (
            <div className="space-y-2">
              {getUpcomingAppointments().map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                  <div>
                    <div className="font-semibold text-gray-800">{appointment.title}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded text-white ${
                        appointment.type === "consulta"
                          ? "bg-health-blue"
                          : appointment.type === "exame"
                            ? "bg-accent-red"
                            : appointment.type === "terapia"
                              ? "bg-accent-green"
                              : "bg-gray-500"
                      }`}
                    >
                      {appointment.type}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
                          deleteAppointment(appointment.date, appointment.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPurchasedServices = () => {
    const purchased = Object.values(selectedServices)
    const { totalSpent } = getSummaryByCategory()

    return (
      <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <CardHeader className="pb-5 border-b-2 border-border-light">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
              <ShoppingBag className="w-6 h-6 mr-3 text-health-blue" />
              Serviços Comprados
            </CardTitle>
            <div className="text-4xl font-bold text-accent-green">R$ {totalSpent.toFixed(2)}</div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {purchased.length === 0 ? (
            <p className="text-center text-gray-600 py-10">
              Nenhum serviço comprado ainda. Navegue pelas categorias e adicione serviços para vê-los aqui.
            </p>
          ) : (
            <div className="space-y-4">
              {purchased.map((service) => (
                <div key={service.id} className="service-card bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h4>
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      <div className="service-meta flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          Comprado em {new Date(service.purchaseDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <span className="inline-block bg-accent-green text-white px-3 py-1 rounded-full text-sm">
                        {service.status === "ativo" ? "Ativo" : "Agendado"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="price text-xl font-bold text-accent-green mb-2">R$ {service.price}</div>
                      <Button onClick={() => removeService(service.id)} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "calendario":
        return renderCalendar()
      case "comprados":
        return renderPurchasedServices()
      case "cuidadores":
      case "hoteis":
      case "passagens":
      case "psicologos":
        return (
          <ServiceCard
            service={servicesDatabase[activeTab]}
            category={activeTab}
            isSelected={isServiceSelected}
            onPurchase={handlePurchase}
            onRemove={removeService}
            showMore={showMore[activeTab]}
            onToggleShowMore={() => toggleShowMore(activeTab)}
          />
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="bg-health-gray font-sans min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        <main
          className={`main-content flex-1 ${sidebarCollapsed ? "ml-20" : "ml-80"} p-6 transition-all duration-400 ease-in-out`}
        >
          <Header user={user} onLogin={() => setLoginModal(true)} onLogout={handleLogout} />

          {renderContent()}
        </main>
      </div>

      <PurchaseModal
        isOpen={purchaseModal.isOpen}
        onClose={() => setPurchaseModal({ isOpen: false, service: null })}
        service={purchaseModal.service}
        onConfirm={confirmPurchase}
      />

      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={() => setAppointmentModal({ isOpen: false, selectedDate: null })}
        selectedDate={appointmentModal.selectedDate}
        onSave={saveAppointment}
      />

      <LoginModal isOpen={loginModal} onClose={() => setLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}

export default App
