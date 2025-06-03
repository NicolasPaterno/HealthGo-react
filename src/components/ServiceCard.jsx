"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, MessageCircle, ShoppingCart, Check } from "lucide-react"

const ServiceCard = ({ service, category, isSelected, onPurchase, onRemove, showMore, onToggleShowMore }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      cuidadores: "👩‍⚕️",
      hoteis: "🏨",
      passagens: "✈️",
      psicologos: "🧠",
    }
    return icons[category] || "🏥"
  }

  const getCategoryGradient = (category) => {
    const gradients = {
      cuidadores: "from-blue-500 to-blue-700",
      hoteis: "from-orange-500 to-orange-700",
      passagens: "from-purple-500 to-purple-700",
      psicologos: "from-teal-500 to-teal-700",
    }
    return gradients[category] || "from-gray-500 to-gray-700"
  }

  return (
    <Card className="category-card bg-white rounded-2xl shadow-xl border border-gray-200">
      <CardHeader className="pb-5 border-b-2 border-border-light">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-semibold text-gray-800">
            <div
              className={`text-white text-3xl p-4 rounded-xl mr-5 shadow-md bg-gradient-to-r ${getCategoryGradient(category)}`}
            >
              {getCategoryIcon(category)}
            </div>
            {category === "cuidadores" && "Cuidadores Especializados"}
            {category === "hoteis" && "Hotéis & Hospedagem Médica"}
            {category === "passagens" && "Passagens Aéreas Médicas"}
            {category === "psicologos" && "Psicólogos & Terapeutas"}
          </CardTitle>
          <Button
            onClick={onToggleShowMore}
            className="bg-gradient-to-r from-health-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 hover:shadow-lg"
          >
            {showMore ? "Ver menos" : "Ver mais"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ul className="service-list space-y-3">
          {service.map((item, index) => {
            const isHidden = index >= 3 && !showMore
            const selected = isSelected(item.id)

            if (isHidden) return null

            return (
              <li
                key={item.id}
                className="service-item flex justify-between items-center p-4 bg-gray-50 rounded-xl transition-all duration-300 ease-in-out border border-gray-200 hover:bg-health-blue-light hover:translate-x-2 hover:border-health-blue hover:shadow-md"
              >
                <div className="service-info flex-1">
                  <h4 className="service-name text-lg font-semibold text-gray-800 mb-2">{item.name}</h4>
                  <p className="service-description text-gray-600 mb-2">{item.description}</p>
                  <div className="service-meta flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.city}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.rating}
                    </span>
                    {item.reviews > 0 && (
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {item.reviews} avaliações
                      </span>
                    )}
                  </div>
                </div>

                <div className="service-actions flex items-center gap-3">
                  <div className="service-price text-right">
                    <div className="price text-2xl font-bold text-accent-green">R$ {item.price}</div>
                    <div className="period text-sm text-gray-500">por {item.period}</div>
                  </div>
                  <Button
                    onClick={() => (selected ? onRemove(item.id) : onPurchase(item, category))}
                    className={`${
                      selected
                        ? "bg-accent-green hover:bg-green-700"
                        : "bg-gradient-to-r from-health-blue to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    } text-white font-medium transition-all duration-300 hover:shadow-lg`}
                  >
                    {selected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Comprado
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
