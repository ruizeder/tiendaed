import React, { useState } from 'react';
import { X, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

export default function FaqModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "¿Cómo y dónde se entregan los pedidos?", /* en Chilapa */
      answer: "Realizamos entregas personales y rápidas en puntos céntricos y seguros (Centro, Zócalo, o punto acordado) /* de Chilapa de Álvarez */. Una vez que envías tu pedido por WhatsApp, nos ponemos de acuerdo en el horario y lugar que más te acomode."
    },
    {
      question: "¿Cuáles son las formas de pago disponibles?",
      answer: "Puedes pagar en efectivo al momento de recibir tu prenda (pago contra entrega), por transferencia electrónica bancaria (SPEI), o mediante depósito en cualquier tienda OXXO."
    },
    {
      question: "¿Las prendas son 100% nuevas?",
      answer: "Sí, absolutamente todas las prendas de nuestro catálogo son 100% nuevas, de importación con calidad SHEIN garantizada, vienen en sus empaques originales y con sus etiquetas intactas."
    },
    {
      question: "¿Puedo apartar una prenda si me interesa?",
      answer: "¡Sí! Puedes escribirnos por WhatsApp con la captura o el nombre de la prenda que te gustó para apartarla y acordar el día de tu entrega."
    },
    {
      question: "¿Cómo sé cuál es mi talla correcta?",
      answer: "En cada producto dentro de la tienda puedes ver las tallas disponibles (XS, S, M, L, XL). Si tienes dudas con respecto a las medidas de cintura, pecho o cadera, contáctanos por WhatsApp y con gusto te asesoramos antes de tu entrega."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl p-4 sm:p-6 md:p-8 z-10 max-h-[90dvh] overflow-y-auto flex flex-col border border-neutral-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[10px] font-bold text-[#E60012] tracking-widest uppercase block mb-1">
              PREGUNTAS FRECUENTES
            </span>
            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-900">
              Dudas y Preguntas Frecuentes
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Todo lo que necesitas saber sobre entregas y pagos.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Cerrar dudas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-neutral-200 my-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-2.5 sm:py-3">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer py-1.5 min-h-[40px]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 pl-4 sm:pl-6 pr-2 text-xs text-neutral-600 leading-relaxed animate-fadeIn">
                    <p className="p-3 bg-[#FAFAFA] border border-neutral-100 rounded-xs">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Contact Card */}
        <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-0.5">
              ¿Tienes otra pregunta?
            </h4>
            <p className="text-[11px] text-emerald-800">
              Escríbenos directamente y te responderemos de inmediato.
            </p>
          </div>
          <a
            href="https://wa.me/527561319459?text=Hola,%20tengo%20una%20duda%20sobre%20las%20prendas%20de%20RAYED"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 min-h-[40px] text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Preguntar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
