"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

const PurchaseModal = ({ isOpen, onClose, service, onConfirm }) => {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>Revise os detalhes do serviço antes de confirmar sua compra.</DialogDescription>
        </DialogHeader>

        <div className="service-details space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">{service.name}</h4>
          <p className="text-gray-600">{service.description}</p>

          <div className="service-meta grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                <strong>Localização:</strong> {service.city}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                <strong>Avaliação:</strong> {service.rating} ⭐
              </span>
            </div>
            <div>
              <strong>Preço:</strong> R$ {service.price}
            </div>
            <div>
              <strong>Período:</strong> {service.period}
            </div>
          </div>

          <div className="total-price bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-gray-800">Total: R$ {service.price}</div>
            <div className="text-sm text-gray-600">Pagamento via PIX, cartão ou boleto</div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-accent-green to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Confirmar Compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseModal
