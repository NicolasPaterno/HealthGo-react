"use client"
import { Button } from "@/components/ui/button"
import {
  Home,
  UserCheck,
  Hotel,
  Plane,
  Brain,
  Calendar,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  Headphones,
} from "lucide-react"

const Sidebar = ({ isCollapsed, onToggle, activeTab, onTabChange, stats }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "cuidadores", label: "Cuidadores", icon: UserCheck },
    { id: "hoteis", label: "Hotéis", icon: Hotel },
    { id: "passagens", label: "Passagens Aéreas", icon: Plane },
    { id: "psicologos", label: "Psicólogos", icon: Brain },
    { id: "calendario", label: "Calendário", icon: Calendar },
    { id: "comprados", label: "Serviços Comprados", icon: ShoppingBag },
  ]

  return (
    <nav
      className={`sidebar ${isCollapsed ? "w-20" : "w-80"} bg-gradient-to-b from-sidebar-dark via-sidebar-medium to-sidebar-light text-white p-6 shadow-2xl fixed h-screen overflow-y-auto scrollbar-hide transition-all duration-400 ease-in-out z-50 border-r-2 border-gray-700`}
    >
      <Button
        onClick={onToggle}
        className="absolute top-6 -right-4 bg-gradient-to-r from-accent-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-8 h-8 rounded-full p-0 shadow-lg z-10"
        size="icon"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      <div
        className={`logo flex items-center mb-8 pb-5 border-b border-gray-700 transition-all duration-300 ease-in-out ${isCollapsed ? "justify-center" : ""}`}
      >
        <Heart className="text-accent-red text-4xl mr-4 drop-shadow-md" />
        {!isCollapsed && (
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            HealthGo
          </h1>
        )}
      </div>

      {!isCollapsed && (
        <div className="user-stats bg-white bg-opacity-10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <h4 className="text-sm mb-3 text-text-gray-dark">Resumo da Conta</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">{stats.totalServices}</div>
              <div className="text-xs text-text-gray-medium">Serviços</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">{stats.scheduledServices}</div>
              <div className="text-xs text-text-gray-medium">Agendados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">R$ {stats.totalSaved}</div>
              <div className="text-xs text-text-gray-medium">Gasto Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">98%</div>
              <div className="text-xs text-text-gray-medium">Satisfação</div>
            </div>
          </div>
        </div>
      )}

      <ul className="nav-menu list-none mb-8">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="nav-item mb-2">
              <Button
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={`nav-link w-full ${isCollapsed ? "justify-center px-3" : "justify-start px-4"} py-4 text-white hover:bg-white hover:bg-opacity-15 hover:translate-x-2 hover:shadow-lg transition-all duration-300 ease-in-out ${
                  activeTab === item.id ? "bg-white bg-opacity-20 border-l-4 border-health-blue" : ""
                }`}
              >
                <Icon className={`w-6 h-6 ${isCollapsed ? "" : "mr-4"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </li>
          )
        })}
      </ul>

      {!isCollapsed && (
        <div className="contact-info bg-black bg-opacity-20 rounded-xl p-5 mt-auto text-sm">
          <h4 className="mb-4 text-accent-blue font-semibold">Contato & Suporte</h4>
          <div className="space-y-2">
            <div className="flex items-center transition-all duration-300 ease-in-out hover:text-accent-blue hover:translate-x-1">
              <Phone className="w-4 h-4 mr-3 text-accent-blue" />
              +55 11 99999-9999
            </div>
            <div className="flex items-center transition-all duration-300 ease-in-out hover:text-accent-blue hover:translate-x-1">
              <MessageCircle className="w-4 h-4 mr-3 text-accent-blue" />
              WhatsApp 24h
            </div>
            <div className="flex items-center transition-all duration-300 ease-in-out hover:text-accent-blue hover:translate-x-1">
              <Instagram className="w-4 h-4 mr-3 text-accent-blue" />
              @healthgo
            </div>
            <div className="flex items-center transition-all duration-300 ease-in-out hover:text-accent-blue hover:translate-x-1">
              <Mail className="w-4 h-4 mr-3 text-accent-blue" />
              healthgo@gmail.com
            </div>
            <div className="flex items-center transition-all duration-300 ease-in-out hover:text-accent-blue hover:translate-x-1">
              <Headphones className="w-4 h-4 mr-3 text-accent-blue" />
              Suporte Online
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Sidebar
