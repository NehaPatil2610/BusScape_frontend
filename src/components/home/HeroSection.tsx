interface HeroSectionProps {
  onExploreRoutes: () => void
}

export function HeroSection({ onExploreRoutes }: HeroSectionProps) {
  return (
    <section className="hero-section" aria-label="Bus search hero">
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvqGgfDpmDgE5IVw-E5yTwcfIjIIFWLPD085sxuMeIIn9HvUT-pt2yUzg2qTxyMch-rWGfuFLeAF6o7Yhb6_t3edVP2LFQdHSxT5vTMNxt8x9hgk6sJxEzO7CFhPcf0of98qzANinhE84hPmNU6hwX8zhxTiyhgh43DPJNbSPwJkqCv6Bp6mgZxRwcpLAfjfw6-ogKrrH8ScNrMTiQLVIm4GY5pl7E9Mc8Dj_EwAd5ViC0qckUpQNC-FtGUQptYIxcgZhGMN2QtiUY")',
        }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          Find Your Bus, <span>See The World.</span>
        </h1>
        <p className="hero-text">
          Discover the easiest way to book your next journey across the country
          with BusScape&apos;s premium fleet and real-time tracking.
        </p>
        <button type="button" className="primary-button" onClick={onExploreRoutes}>
          Explore Routes
        </button>
      </div>
    </section>
  )
}
