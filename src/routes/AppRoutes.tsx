import { Route, Routes } from 'react-router-dom'
import { AboutPage } from '../pages/AboutPage'
import { BusDetailsPage } from '../pages/BusDetailsPage'
import { BookingPage } from '../pages/BookingPage'
import { BookingsPage } from '../pages/BookingsPage'
import { BusResultsPage } from '../pages/BusResultsPage'
import { CallbackPage } from '../pages/CallbackPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<AboutPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/buses" element={<BusResultsPage />} />
      <Route path="/buses/:busId" element={<BusDetailsPage />} />
      <Route path="/buses/:busId/booking" element={<BookingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
