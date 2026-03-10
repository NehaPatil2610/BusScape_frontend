import { useState, type FormEvent } from 'react'
import type { HomeSearchPayload } from '../../types/home'

interface ResultsSearchFormProps {
  departureCity: string
  arrivalCity: string
  date: string
  onSearch: (payload: HomeSearchPayload) => void
}

export function ResultsSearchForm({
  departureCity,
  arrivalCity,
  date,
  onSearch,
}: ResultsSearchFormProps) {
  const [departureInput, setDepartureInput] = useState(departureCity)
  const [arrivalInput, setArrivalInput] = useState(arrivalCity)
  const [dateInput, setDateInput] = useState(date)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSearch({
      departureCity: departureInput.trim(),
      arrivalCity: arrivalInput.trim(),
      travelDate: dateInput,
    })
  }

  return (
    <form className="results-search-form" onSubmit={handleSubmit}>
      <label>
        <span>Departure</span>
        <input
          value={departureInput}
          onChange={(event) => {
            setDepartureInput(event.target.value)
          }}
          placeholder="From city"
          required
        />
      </label>

      <label>
        <span>Arrival</span>
        <input
          value={arrivalInput}
          onChange={(event) => {
            setArrivalInput(event.target.value)
          }}
          placeholder="To city"
          required
        />
      </label>

      <label>
        <span>Travel Date</span>
        <input
          type="date"
          value={dateInput}
          onChange={(event) => {
            setDateInput(event.target.value)
          }}
          required
        />
      </label>

      <button type="submit">
        <span className="material-symbols-outlined">search</span>
        Search Buses
      </button>
    </form>
  )
}
