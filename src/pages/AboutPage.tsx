import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useTheme } from '../hooks/useAppState'
import './AboutPage.css'

const FEATURES = [
  {
    icon: 'directions_bus',
    title: 'Wide route network',
    description: 'Search and book across thousands of routes covering tier-1 and tier-2 cities.',
  },
  {
    icon: 'event_seat',
    title: 'Live seat selection',
    description: 'Pick your preferred seats with real-time availability for every operator.',
  },
  {
    icon: 'verified_user',
    title: 'Secure checkout',
    description: 'Authenticated sessions powered by Logto and encrypted payment flows.',
  },
  {
    icon: 'support_agent',
    title: '24x7 support',
    description: 'Round-the-clock assistance for booking changes, refunds and travel queries.',
  },
]

const STATS = [
  { value: '500+', label: 'Cities covered' },
  { value: '120k+', label: 'Happy travellers' },
  { value: '4.7★', label: 'Average rating' },
  { value: '99.9%', label: 'Uptime' },
]

const FAQS = [
  {
    question: 'How do I book a bus on BusScape?',
    answer:
      'Search your route from the home page, choose a bus, pick your seats and complete payment. A confirmation appears in My Bookings instantly.',
  },
  {
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes. Open My Bookings, select the trip and choose Cancel or Reschedule. Refunds follow the operator policy listed on the bus details page.',
  },
  {
    question: 'How do I sign in?',
    answer:
      'Click the login icon in the header. Authentication is handled securely by Logto — you can use email, Google or any provider configured by us.',
  },
  {
    question: 'Where can I see my upcoming trips?',
    answer:
      'All upcoming and past trips live under the My Bookings page once you are signed in.',
  },
]

export function AboutPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="about-page">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="about-main">
        <section className="about-hero">
          <h1>About BusScape</h1>
          <p>
            BusScape is a modern bus booking platform that helps you discover routes,
            compare operators, pick seats and travel comfortably — all in a few taps.
          </p>
        </section>

        <section className="about-section">
          <h2>Our mission</h2>
          <p>
            We believe intercity travel should be simple, transparent and reliable. BusScape
            brings together operators, real-time seat data and secure checkout so every
            journey starts with confidence.
          </p>
          <p>
            Built by a small team passionate about clean design and dependable software, we
            obsess over the details that make booking effortless — from accurate ETAs to
            faster refunds.
          </p>
        </section>

        <section className="about-section">
          <h2>Why BusScape</h2>
          <div className="about-grid">
            {FEATURES.map((feature) => (
              <div className="about-card" key={feature.title}>
                <span className="material-symbols-outlined">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>By the numbers</h2>
          <div className="about-stats">
            {STATS.map((stat) => (
              <div className="about-stat" key={stat.label}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section about-faq">
          <h2>Help & FAQs</h2>
          {FAQS.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>

        <section className="about-section">
          <h2>Need more help?</h2>
          <div className="about-help-cta">
            <div>
              <strong>We're here for you.</strong>
              <p style={{ margin: '0.25rem 0 0' }}>
                Reach our support team any time — average response under 2 hours.
              </p>
            </div>
            <a href="mailto:support@busscape.app">Contact support</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
