import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminBusById, createBus, updateBus } from '../api/buses.api';
import type { Bus, BusStop, BusSeat, SeatType, CreateBusPayload } from '../api/buses.api';
import { toast } from '../components/Toaster';

const SEAT_TYPES: SeatType[] = ['normal', 'sleeper', 'semi-sleeper'];

interface StopRow {
  stopName: string;
  arrivalTime: string;
  departureTime: string;
}

function buildSeats(rows: number, cols: number, type: SeatType): BusSeat[] {
  const seats: BusSeat[] = [];
  let num = 1;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({ seatNumber: num++, status: 'available', row: r, column: c, seatType: type });
    }
  }
  return seats;
}

export function BusFormPage() {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const isEdit = !!busId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isAC, setIsAC] = useState(false);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>(['normal']);
  const [stops, setStops] = useState<StopRow[]>([
    { stopName: '', arrivalTime: '', departureTime: '' },
    { stopName: '', arrivalTime: '', departureTime: '' },
  ]);
  const [seatRows, setSeatRows] = useState('5');
  const [seatCols, setSeatCols] = useState('8');
  const [primarySeatType, setPrimarySeatType] = useState<SeatType>('normal');
  const [existingSeats, setExistingSeats] = useState<BusSeat[]>([]);

  useEffect(() => {
    if (!isEdit || !busId) return;
    fetchAdminBusById(busId)
      .then((bus: Bus) => {
        setName(bus.name);
        setPrice(String(bus.price));
        setIsAC(bus.isAC);
        setSeatTypes(bus.seatTypes);
        setPrimarySeatType(bus.seatTypes[0] ?? 'normal');
        setStops(bus.stops.map((s) => ({
          stopName: s.stopName,
          arrivalTime: s.arrivalTime ?? '',
          departureTime: s.departureTime ?? '',
        })));
        setExistingSeats(bus.seats);
        const maxRow = Math.max(...bus.seats.map((s) => s.row));
        const maxCol = Math.max(...bus.seats.map((s) => s.column));
        setSeatRows(String(maxRow));
        setSeatCols(String(maxCol));
      })
      .finally(() => setLoading(false));
  }, [isEdit, busId]);

  const addStop = () =>
    setStops((prev) => [...prev, { stopName: '', arrivalTime: '', departureTime: '' }]);
  const removeStop = (i: number) => setStops((prev) => prev.filter((_, idx) => idx !== i));
  const updateStop = (i: number, field: keyof StopRow, val: string) =>
    setStops((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const toggleSeatType = (t: SeatType) => {
    setSeatTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const buildPayload = (): CreateBusPayload => {
    const builtStops: BusStop[] = stops.map((s, i) => ({
      stopName: s.stopName,
      ...(i !== 0 && s.arrivalTime ? { arrivalTime: s.arrivalTime } : {}),
      ...(i !== stops.length - 1 && s.departureTime ? { departureTime: s.departureTime } : {}),
    }));
    const seats = isEdit && existingSeats.length > 0
      ? existingSeats
      : buildSeats(Number(seatRows), Number(seatCols), primarySeatType);

    return { name, price: Number(price), isAC, seatTypes, stops: builtStops, seats };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || stops.some((s) => !s.stopName.trim())) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit && busId) {
        await updateBus(busId, payload);
        toast.success('Bus updated!');
      } else {
        await createBus(payload);
        toast.success('Bus created!');
      }
      navigate('/admin/buses');
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" />Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          </button>
          <div>
            <h1 className="admin-page-title">{isEdit ? 'Edit Bus' : 'Add New Bus'}</h1>
            <p className="admin-page-sub">{isEdit ? `Editing bus ${busId}` : 'Create a new bus on the platform'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
          {/* Basic Info */}
          <div className="admin-card">
            <div className="admin-card-header"><span className="admin-card-title">Basic Information</span></div>
            <div className="admin-card-body">
              <div className="admin-form-group">
                <label className="admin-label">Bus Name *</label>
                <input className="admin-input" placeholder="e.g. BusScape Express" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Price per Seat (₹) *</label>
                <input className="admin-input" type="number" min="1" placeholder="750" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Air Conditioning</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAC}
                    onChange={(e) => setIsAC(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#2563eb' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>This bus is air conditioned</span>
                </label>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Seat Types *</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {SEAT_TYPES.map((t) => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: 6, border: `1px solid ${seatTypes.includes(t) ? '#2563eb' : '#334155'}`, background: seatTypes.includes(t) ? 'rgba(37,99,235,0.1)' : 'transparent', fontSize: '0.8rem', color: seatTypes.includes(t) ? '#60a5fa' : '#94a3b8' }}>
                      <input type="checkbox" checked={seatTypes.includes(t)} onChange={() => toggleSeatType(t)} style={{ display: 'none' }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seat Config */}
          <div className="admin-card">
            <div className="admin-card-header"><span className="admin-card-title">Seat Configuration</span></div>
            <div className="admin-card-body">
              {isEdit ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Seat layout is set. Edit individual seat statuses directly in the database or re-create the bus.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="admin-form-group" style={{ flex: 1 }}>
                      <label className="admin-label">Rows</label>
                      <input className="admin-input" type="number" min="1" max="20" value={seatRows} onChange={(e) => setSeatRows(e.target.value)} />
                    </div>
                    <div className="admin-form-group" style={{ flex: 1 }}>
                      <label className="admin-label">Columns</label>
                      <input className="admin-input" type="number" min="1" max="10" value={seatCols} onChange={(e) => setSeatCols(e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Primary Seat Type</label>
                    <select className="admin-select" value={primarySeatType} onChange={(e) => setPrimarySeatType(e.target.value as SeatType)}>
                      {SEAT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    Will generate {Number(seatRows) * Number(seatCols)} seats
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stops */}
        <div className="admin-card" style={{ marginBottom: '1rem' }}>
          <div className="admin-card-header">
            <span className="admin-card-title">Route Stops</span>
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addStop}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span> Add Stop
            </button>
          </div>
          <div className="admin-card-body">
            {stops.map((stop, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                <div style={{ flex: '0 0 20px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', paddingBottom: 8 }}>
                  {i + 1}
                </div>
                <div className="admin-form-group" style={{ flex: 2, marginBottom: 0 }}>
                  {i === 0 && <label className="admin-label">Stop Name *</label>}
                  <input className="admin-input" placeholder="City / Stop name" value={stop.stopName} onChange={(e) => updateStop(i, 'stopName', e.target.value)} required />
                </div>
                {i !== 0 && (
                  <div className="admin-form-group" style={{ flex: 2, marginBottom: 0 }}>
                    {i === 0 && <label className="admin-label">Arrival</label>}
                    <input className="admin-input" placeholder="Arrival time" value={stop.arrivalTime} onChange={(e) => updateStop(i, 'arrivalTime', e.target.value)} />
                  </div>
                )}
                {i !== stops.length - 1 && (
                  <div className="admin-form-group" style={{ flex: 2, marginBottom: 0 }}>
                    {i === 0 && <label className="admin-label">Departure</label>}
                    <input className="admin-input" placeholder="Departure time" value={stop.departureTime} onChange={(e) => updateStop(i, 'departureTime', e.target.value)} />
                  </div>
                )}
                {stops.length > 2 && (
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginBottom: 0 }} onClick={() => removeStop(i)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving && <span className="admin-spinner" style={{ width: 14, height: 14 }} />}
            {isEdit ? 'Save Changes' : 'Create Bus'}
          </button>
        </div>
      </form>
    </div>
  );
}
