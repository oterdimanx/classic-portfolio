import './styles/globals.css'
import './styles/learn-more.css'
import './styles/footer.css'
import { Providers } from '@/Store/Provider'
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Classic Portfolio Images Upload Device',
  description: 'Firebase Images',
  authors: [{ name: "Terdiman Olivier", url: 'https://www.reference-web.com' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="fr">
      <body className="zyy">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
