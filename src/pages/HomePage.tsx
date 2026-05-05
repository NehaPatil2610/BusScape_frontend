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

const moreDestinations: Destination[] = [
  {
    id: 'kerala-alleppey',
    name: 'Alleppey, Kerala',
    startingPrice: 1800,
    imageAlt: 'Backwaters and houseboats in Alleppey',
    imageUrl:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'kerala-munnar',
    name: 'Munnar, Kerala',
    startingPrice: 1650,
    imageAlt: 'Tea gardens of Munnar',
    imageUrl:
      'https://images.unsplash.com/photo-1609608256000-9f9bf2cd76ba?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    startingPrice: 1100,
    imageAlt: 'Hawa Mahal in Jaipur',
    imageUrl:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    startingPrice: 1250,
    imageAlt: 'City Palace by Lake Pichola',
    imageUrl:
      'https://images.unsplash.com/photo-1599661046827-9d1be56d4043?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'manali',
    name: 'Manali',
    startingPrice: 1400,
    imageAlt: 'Snowy peaks of Manali',
    imageUrl:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'shimla',
    name: 'Shimla',
    startingPrice: 1300,
    imageAlt: 'Hill town of Shimla',
    imageUrl:
      'https://images.unsplash.com/photo-1626621331169-3c11d013ed8b?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    startingPrice: 1050,
    imageAlt: 'Ganga river at Rishikesh',
    imageUrl:
      'https://images.unsplash.com/photo-1591018533337-93cdf45ae4d3?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    startingPrice: 1150,
    imageAlt: 'Ghats of Varanasi at dawn',
    imageUrl:
      'https://images.unsplash.com/photo-1561361398-a8b7d4cdf7e1?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'ooty',
    name: 'Ooty',
    startingPrice: 1500,
    imageAlt: 'Hills of Ooty',
    imageUrl:
      'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'mysore',
    name: 'Mysore',
    startingPrice: 900,
    imageAlt: 'Mysore Palace lit up',
    imageUrl:
      'https://images.unsplash.com/photo-1600100397405-3a72fc5a3e30?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    startingPrice: 1700,
    imageAlt: 'Kanchenjunga from Darjeeling',
    imageUrl:
      'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry',
    startingPrice: 1350,
    imageAlt: 'French quarter of Pondicherry',
    imageUrl:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'agra',
    name: 'Agra',
    startingPrice: 850,
    imageAlt: 'Taj Mahal at sunrise',
    imageUrl:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'pune',
    name: 'Pune',
    startingPrice: 700,
    imageAlt: 'Pune cityscape',
    imageUrl:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    startingPrice: 1200,
    imageAlt: 'Howrah Bridge in Kolkata',
    imageUrl:
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=70',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    startingPrice: 1000,
    imageAlt: 'Charminar in Hyderabad',
    imageUrl:
      'https://images.unsplash.com/photo-1600689728239-d35a5e84ba53?auto=format&fit=crop&w=800&q=70',
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
          <DestinationsSection
            destinations={featuredDestinations}
            extraDestinations={moreDestinations}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
