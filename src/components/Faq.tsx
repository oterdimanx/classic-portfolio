import React, { useState } from 'react'

export const faqData = [
    {
      question: "Combien de temps prendra la livraison ?",
      answer: "Les produits en vente sur ce site étant virtuels, la livraison sera immédiate. En tout cas tant qu'il s'agit d'images. Si vous le souhaitez, je peux vous fournir la version de l'image achetée en haute définition (le poids de telles images est trop important pour être envoyées sur un cloud sans que la facture devienne rapidement salée.)."
    },
    {
      question: "Quelle est votre politique concernant les retours ?",
      answer: "Je ne fais pas de politique. Non je plaisante. Je ne fais pas de politique de retour standard car chaque situation est unique. Si vous n'êtes pas satisfait de votre achat, veuillez me contacter dans les 14 jours suivant la réception du produit pour discuter des options disponibles. Je m'efforcerai de trouver une solution qui vous convient, que ce soit un échange, un remboursement partiel ou total. Le fait est que la vente d'images sur ce site est pûrement symbolique. Considérez que vous me faites un don pour m'encourager à continuer mon travail de création."
    },
    {
      question: "Est-ce que vous offrez les frais de port à l'international ?",
      answer: "Absolument ! Tous les produits vendus sur ce site sont virtuels, donc il n'y a pas de frais de port, que vous soyez en France ou à l'international. Vous pouvez acheter et télécharger nos images depuis n'importe où dans le monde sans frais supplémentaires."
    },
    {
      question: "Comment vérifier l'état d'une commande ou mon historique ?",
      answer: "Rien de plus simple ! Connectez-vous à votre compte, puis accédez à la section 'Mes commandes' dans votre tableau de bord utilisateur (en haut à droite dans le menu). Vous y trouverez un historique complet de vos achats, avec les détails de chaque commande, y compris les dates, les montants et les statuts de livraison."
    },
    {
      question: "Quelles sont les méthodes de paiement que vous acceptez ?",
      answer: "Nous acceptons les principales cartes de crédit et de débit, ainsi que les paiements via PayPal. Toutes les transactions sont sécurisées et cryptées pour garantir la sécurité de vos informations financières. A terme le paiement par crypto-monnaies sera également accepté, et le paiement par CB en dehors de paypal est également prévu, mais il n'est pas encore fonctionnel. Dans l'immédiat, paypal reste la meilleure option."
    },
    {
      question: "Puis-je modifier ou annuler une commande ?",
      answer: "Oui, vous pouvez modifier ou annuler une commande tant qu'elle n'a pas encore été traitée. Veuillez me contacter dès que possible après avoir passé votre commande pour discuter des modifications ou de l'annulation. Je ferai de mon mieux pour répondre à vos demandes."
    }
  ];

export default function Faq({ userData }: { userData: any }) {

    /*const [loading, setLoading] = useState(true)*/


    return (  
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                <h1 className="text-3xl font-light text-gray-900 sm:text-4xl mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Trouvez des réponses simples à vos questions concernant nos produits, nos services, et plus encore. 
                    Vous ne trouvez pas ce que vous cherchez ? Contactez moi et je serai ravi de vous renseigner.
                </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-6">
                {faqData.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                    <details className="group">
                        <summary className="flex justify-between items-center cursor-pointer list-none">
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                        </h3>
                        <span className="flex-shrink-0 ml-2">
                            <svg 
                            className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                        </summary>
                        <div className="mt-4 pl-2">
                        <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                        </p>
                        </div>
                    </details>
                    </div>
                ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                    Vous avez encore des questions ? J'ai sûrement des réponses.
                </h3>
                <p className="text-gray-600 mb-6">
                    Toute l'équipe tentera de vous renseigner du mieux qu'elle le peut :).
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Contact Support
                    </button>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    Retour
                    </button>
                </div>
                </div>
            </div>
            </div>
    )
}                     
