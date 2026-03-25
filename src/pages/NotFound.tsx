import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'

export function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <Container tight className="text-center py-24 relative z-10">
        <p className="text-9xl font-black text-white/5 font-heading mb-4 select-none">404</p>
        <h1 className="text-4xl font-bold font-heading text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8 text-lg">
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </Container>
    </section>
  )
}
