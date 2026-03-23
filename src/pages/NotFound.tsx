import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'

export function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50">
      <Container tight className="text-center py-24">
        <p className="text-9xl font-black text-slate-100 font-heading mb-4 select-none">404</p>
        <h1 className="text-4xl font-bold font-heading text-navy mb-4">Page Not Found</h1>
        <p className="text-slate-500 mb-8 text-lg">
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
