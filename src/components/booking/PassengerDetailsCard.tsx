import type { PassengerGender } from '../../types/home'

export interface PassengerFormValues {
  name: string
  age: string
  gender: PassengerGender | ''
}

interface PassengerDetailsCardProps {
  index: number
  seatNumber: number
  value: PassengerFormValues
  onChange: (
    index: number,
    field: keyof PassengerFormValues,
    nextValue: string,
  ) => void
}

const genderOptions: Array<{ label: string; value: PassengerGender }> = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export function PassengerDetailsCard({
  index,
  seatNumber,
  value,
  onChange,
}: PassengerDetailsCardProps) {
  return (
    <section className="booking-passenger-card">
      <div className="booking-passenger-title-row">
        <span className={`booking-passenger-index ${index === 0 ? 'primary' : ''}`}>
          {index + 1}
        </span>
        <div>
          <h3>
            Passenger {index + 1}
            {index === 0 ? ' (Primary)' : ''}
          </h3>
          <p>Seat {seatNumber}</p>
        </div>
      </div>

      <div className="booking-form-grid">
        <label className="booking-field booking-field-full">
          <span>Full Name</span>
          <input
            type="text"
            placeholder="Enter full name"
            value={value.name}
            onChange={(event) => {
              onChange(index, 'name', event.target.value)
            }}
            required
          />
        </label>

        <label className="booking-field">
          <span>Age</span>
          <input
            type="number"
            min={1}
            max={120}
            placeholder="Age"
            value={value.age}
            onChange={(event) => {
              onChange(index, 'age', event.target.value)
            }}
            required
          />
        </label>

        <div className="booking-field">
          <span>Gender</span>
          <div className="booking-radio-row">
            {genderOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={`gender-${index}`}
                  checked={value.gender === option.value}
                  onChange={() => {
                    onChange(index, 'gender', option.value)
                  }}
                  required
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
