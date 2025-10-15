import './globals.css';
import { Navigation } from '../components/layout/Navigation';
// import { Footer } from '../components/Footer';
import { Footer } from '../components/layout/Footer';

export const metadata = {
  title: 'Eduvos Innovation Platform',
  description: 'Where ideas evolve into reality',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-eduvos-deep">
      <body className="min-h-screen bg-gradient-to-br from-eduvos-deep via-purple-900/20 to-eduvos-deep text-white">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}