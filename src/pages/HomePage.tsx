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
    id: 'mumbai',
    name: 'Mumbai',
    startingPrice: 1200,
    imageAlt: 'Mumbai skyline at sunset with Sea Link',
    imageUrl: '/destinations/mumbai.png',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    startingPrice: 950,
    imageAlt: 'Red Fort in Delhi',
    imageUrl: '/destinations/delhi.png',
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    startingPrice: 800,
    imageAlt: 'Vidhana Souda in Bangalore',
    imageUrl: '/destinations/bangalore.png',
  },
  {
    id: 'goa',
    name: 'Goa',
    startingPrice: 1500,
    imageAlt: 'Serene beach in Goa',
    imageUrl: '/destinations/goa.png',
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
