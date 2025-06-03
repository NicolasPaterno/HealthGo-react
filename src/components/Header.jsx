"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react"

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <header className="header bg-white p-6 rounded-2xl shadow-xl mb-8 flex justify-between items-center border border-gray-200 backdrop-blur-md">
      <div className="user-greeting flex items-center">
        <User className="text-health-blue text-4xl mr-5" />
        <div className="greeting-text">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {user ? `Olá, ${user.name}!` : "Olá, Visitante!"}
          </h2>
          <p className="text-gray-600">Bem-vindo à sua plataforma de saúde</p>
        </div>
      </div>

      <div className="header-actions flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-health-blue hover:text-white hover:border-health-blue transition-all duration-300"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {user ? (
          <div className="user-profile flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-health-blue text-white">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-800 font-semibold hover:text-health-blue transition-colors"
                >
                  {user.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            onClick={onLogin}
            className="bg-gradient-to-r from-health-red to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
