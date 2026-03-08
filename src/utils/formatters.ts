export const usdCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const inrCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatIsoDateLabel(value: string): string {
  if (!value) {
    return '--'
  }

  const parsedDate = new Date(`${value}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatStopTimeLabel(value?: string): string {
  if (!value) {
    return '--'
  }

  const commaParts = value.split(',')

  if (commaParts.length > 1) {
    return commaParts[1].trim().toUpperCase()
  }

  return value
}
