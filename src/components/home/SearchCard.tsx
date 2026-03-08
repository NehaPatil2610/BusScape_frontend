import { useState, type FormEvent } from 'react'
import type { HomeSearchPayload } from '../../types/home'

interface SearchCardProps {
  onSearch: (payload: HomeSearchPayload) => void
}

const todayDate = new Date().toISOString().slice(0, 10)

export function SearchCard({ onSearch }: SearchCardProps) {
  const [departureCity, setDepartureCity] = useState('')
  const [arrivalCity, setArrivalCity] = useState('')
  const [travelDate, setTravelDate] = useState(todayDate)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSearch({
      departureCity: departureCity.trim(),
      arrivalCity: arrivalCity.trim(),
      travelDate,
    })
  }

  return (
    <section className="search-card-wrapper" id="bookings">
      <form className="search-card" onSubmit={handleSubmit}>
        <h2 className="search-title">
          <span className="material-symbols-outlined">search</span>
          Book Your Trip
        </h2>

        <div className="search-grid">
          <div className="field-group">
            <label className="field-label" htmlFor="departure-city">
              Departure City
            </label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">directions_bus</span>
              <input
                id="departure-city"
                className="input-field"
                placeholder="From where?"
                value={departureCity}
                onChange={(event) => {
                  setDepartureCity(event.target.value)
                }}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="arrival-city">
              Arrival City
            </label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">location_on</span>
              <input
                id="arrival-city"
                className="input-field"
                placeholder="To where?"
                value={arrivalCity}
                onChange={(event) => {
                  setArrivalCity(event.target.value)
                }}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="travel-date">
              Travel Date
            </label>
            <div className="input-wrap">
              <span className="material-symbols-outlined">calendar_today</span>
              <input
                id="travel-date"
                className="input-field"
                type="date"
                value={travelDate}
                min={todayDate}
                onChange={(event) => {
                  setTravelDate(event.target.value)
                }}
                required
              />
            </div>
          </div>

          <button className="search-submit" type="submit">
            <span className="material-symbols-outlined">search</span>
            Search Buses
          </button>
        </div>
      </form>
    </section>
  )
}
