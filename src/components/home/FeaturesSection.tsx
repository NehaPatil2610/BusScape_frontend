import type { FeatureItem } from '../../types/home'

interface FeaturesSectionProps {
  features: FeatureItem[]
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="features-section" aria-label="Key benefits">
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.id}>
            <div className="feature-icon-wrap">
              <span className="material-symbols-outlined">{feature.icon}</span>
            </div>
            <div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
