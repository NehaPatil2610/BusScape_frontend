import type { BusSearchQuery } from '../types/home'

export function serializeBusSearchQuery(query: BusSearchQuery): string {
  const params = new URLSearchParams()

  params.set('departureCity', query.departureCity)
  params.set('arrivalCity', query.arrivalCity)
  params.set('date', query.date)
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  if (query.seatType) {
    params.set('seatType', query.seatType)
  }

  if (query.isAC !== undefined) {
    params.set('isAC', String(query.isAC))
  }

  if (query.departureSlot) {
    params.set('departureSlot', query.departureSlot)
  }

  return params.toString()
}
