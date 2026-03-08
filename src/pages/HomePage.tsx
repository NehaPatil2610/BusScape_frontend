import { useNavigate } from 'react-router-dom'
import { DestinationsSection } from '../components/home/DestinationsSection'
import { FeaturesSection } from '../components/home/FeaturesSection'
import { HeroSection } from '../components/home/HeroSection'
import { SearchCard } from '../components/home/SearchCard'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useTheme } from '../hooks/useAppState'
import type { Destination, FeatureItem, HomeSearchPayload } from '../types/home'
import './HomePage.css'

const featuredDestinations: Destination[] = [
  {
    id: 'san-francisco',
    name: 'San Francisco',
    startingPrice: 32,
    imageAlt: 'San Francisco skyline during sunset',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEneXRDrG6ApzjzFRVy96nDy4xz8xSUykePcaYzvgTzZfrDlbex6MsoSfkfy-ae3sgDixPc7uYv2ST6nwdQNF_a1Aw_ggRo21D3UOlrmCsuV80Q92LT4yfWGHLSlXwVtcqYp6wFKGX3k9Ux3kQT_uOqyjeliXciH4hOdtSrHoOjDDos6qZlrLSBMHFrEHCEAoZm22aEZrxsxl46f-hxf9LMAL2f9PySmjHXV7yl7eNIu4YP1dv8bJC4Kd7-Dtgm1g-nDFwWupT7Eg',
  },
  {
    id: 'new-york',
    name: 'New York',
    startingPrice: 45,
    imageAlt: 'New York skyline with bridge in foreground',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgjGrxiOrylaMJnOkv0nK2dRuLJIj1G0X9YdY1-T3dJkzfmbmYflDyOwZIwlcMMFF1kmL88L6VkgOBlqb7igJAzmxX_v_4k8pnS8DOpc0EKbE_uk06gxKIVhgqYgPROz9MbjbVQjrjtHU1VWU1RZZ8NIqe7MQZ6c1ShXUIdSnTKGJEzCgrnP0LtdxgRSjFOU2Dz9PPIyjm6zRvAp6rJWA8yiZP94k-G_OGHVxLZdt6eJj7JeKCgGGzKYj1vstMqmHyAPdkPYLAqq35',
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    startingPrice: 35,
    imageAlt: 'Las Vegas strip lights at night',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDP3B3B1BQF5ScKog4S6NSQ0Sdze_bZki4moGAzlLMpSkT15VLqHM-GYPXfWULPzBj2CEihQb4u2hDI1B5-E3uCmaIGxVlyGmp3uM3pu9Or5YCp553-HBRCTl-dRTXgbxK3_nXcnH47RzoNwhg2fKmBScYBkILE51N2St2776CRM90wat-0ijOO3QfjwDOYZLFUmQVQy5yLKEyg4CJKY19rNJ0HNC5lwinry8fgxXa3cl3W7287EAEuWpyXPvtJ2XeMXSJ_te_MOlpr',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    startingPrice: 29,
    imageAlt: 'Palm trees with mountain view in Los Angeles',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDElO9dDbpyR3xrFOjpjHoj9EcnwvMH0Vs3-vNj9LjrFvVcR33UBkl2qzKrM2_5AMlaJkPDQgGQbk4sUzzNRXQfu_gll170HeocrTyqiFTEEgkmuhBQP_oIZT1BGHaayczR18-TC4mt24UxdG8o9vTM-vQvXofHe1a9tXI_fAM1iFrsspIsgTgaf5pS_jkFstYOgcdkdAJkRqOwp9lidP5ML-UNawa0xvKHoNoRchx4Wt5-YAHVCqj7z7-lgzUKwog6yR7BgEu2EXUR',
  },
]

const features: FeatureItem[] = [
  {
    id: 'easy-booking',
    icon: 'confirmation_number',
    title: 'Easy Booking',
    description:
      'Book your tickets in less than 2 minutes with our seamless interface.',
  },
  {
    id: 'safe-journey',
    icon: 'shield_with_heart',
    title: 'Safe Journey',
    description:
      'Verified operators and real-time tracking for your safety and peace of mind.',
  },
  {
    id: 'best-prices',
    icon: 'sell',
    title: 'Best Prices',
    description:
      'Transparent pricing with no hidden fees and exclusive member offers.',
  },
]

export function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleExploreRoutes = () => {
    const bookingsSection = document.getElementById('bookings')

    if (bookingsSection) {
      bookingsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleSearch = (payload: HomeSearchPayload) => {
    const params = new URLSearchParams({
      departureCity: payload.departureCity,
      arrivalCity: payload.arrivalCity,
      date: payload.travelDate,
      page: '1',
      pageSize: '20',
    })

    navigate(`/buses?${params.toString()}`)
  }

  return (
    <div className="home-page">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="home-main">
        <div className="page-container">
          <HeroSection onExploreRoutes={handleExploreRoutes} />
          <SearchCard onSearch={handleSearch} />
          <FeaturesSection features={features} />
          <DestinationsSection destinations={featuredDestinations} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
