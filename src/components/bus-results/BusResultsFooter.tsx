export function BusResultsFooter() {
  return (
    <footer className="results-footer">
      <div className="results-footer-grid">
        <div>
          <div className="results-footer-brand">
            <span className="material-symbols-outlined">directions_bus</span>
            <h2>BusScape</h2>
          </div>
          <p>
            The easiest way to find and book bus tickets across the country.
            Reliable, fast, and always the best prices.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="#">Popular Routes</a>
            </li>
            <li>
              <a href="#">Bus Operators</a>
            </li>
            <li>
              <a href="#">Stations &amp; Stops</a>
            </li>
            <li>
              <a href="#">Mobile App</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Help &amp; Support</h4>
          <ul>
            <li>
              <a href="#">Customer Support</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Newsletter</h4>
          <p>Get the latest deals and travel tips.</p>
          <form
            className="results-newsletter"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="results-footer-bottom">
        <p>© 2026 BusScape Inc. All rights reserved.</p>
        <div>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  )
}
