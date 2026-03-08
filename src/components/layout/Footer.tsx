export function Footer() {
  return (
    <footer className="site-footer" id="support">
      <div className="footer-content">
        <div>
          <div className="footer-brand">
            <span className="material-symbols-outlined">directions_bus</span>
            <h3>BusScape</h3>
          </div>
          <p className="footer-description">
            Connecting cities and people with comfort and affordability. Your
            journey begins here.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Company</h4>
          <ul className="footer-links">
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#careers">Careers</a>
            </li>
            <li>
              <a href="#press">Press</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#help-center">Help Center</a>
            </li>
            <li>
              <a href="#safety">Safety</a>
            </li>
            <li>
              <a href="#refund-policy">Refund Policy</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Newsletter</h4>
          <p className="footer-description">
            Get travel tips and exclusive offers directly in your inbox.
          </p>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <input type="email" placeholder="Your email" aria-label="Your email" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BusScape Inc. All rights reserved.</p>
        <div className="social-icons" aria-label="Social links">
          <span className="material-symbols-outlined">public</span>
          <span className="material-symbols-outlined">campaign</span>
          <span className="material-symbols-outlined">chat</span>
        </div>
      </div>
    </footer>
  )
}
