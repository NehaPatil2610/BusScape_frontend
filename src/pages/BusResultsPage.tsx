import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigationType, useSearchParams } from 'react-router-dom'
import { searchBuses } from '../api/searchApi'
import { BusFiltersSidebar, type BusFiltersState } from '../components/bus-results/BusFiltersSidebar'
import { BusResultCard } from '../components/bus-results/BusResultCard'
import { BusResultsFooter } from '../components/bus-results/BusResultsFooter'
import { BusResultsHeader } from '../components/bus-results/BusResultsHeader'
import { ResultsSearchForm } from '../components/bus-results/ResultsSearchForm'
import {
  MissingSearchState,
  ResultsEmptyState,
  ResultsErrorState,
  ResultsLoadingState,
} from '../components/bus-results/ResultsStates'
import { useTheme } from '../hooks/useAppState'
import type {
  Bus,
  BusSearchQuery,
  DepartureSlot,
  PaginationMeta,
  SeatType,
} from '../types/home'
import { formatIsoDateLabel } from '../utils/formatters'
import { serializeBusSearchQuery } from '../utils/queryParams'
import './BusResultsPage.css'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const RESULTS_CACHE_STORAGE_KEY = 'bus-results-cache-v1'

interface CachedResultsEntry {
  buses: Bus[]
  pagination: PaginationMeta
}

type CachedResultsRecord = Record<string, CachedResultsEntry>

function readCachedResults(): CachedResultsRecord {
  if (typeof window === 'undefined') {
    return {}
  }

  const rawValue = window.sessionStorage.getItem(RESULTS_CACHE_STORAGE_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    const parsed = JSON.parse(rawValue) as CachedResultsRecord

    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    return parsed
  } catch {
    return {}
  }
}

function writeCachedResults(cache: CachedResultsRecord) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(RESULTS_CACHE_STORAGE_KEY, JSON.stringify(cache))
}

function parseSeatType(value: string | null): SeatType | undefined {
  if (value === 'sleeper' || value === 'seater' || value === 'semi-sleeper') {
    return value
  }

  return undefined
}

function parseDepartureSlot(value: string | null): DepartureSlot | undefined {
  if (
    value === 'morning' ||
    value === 'afternoon' ||
    value === 'evening' ||
    value === 'night'
  ) {
    return value
  }

  return undefined
}

function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback
  }

  return Math.floor(parsedValue)
}

function parseBusSearchQuery(searchParams: URLSearchParams): BusSearchQuery {
  return {
    departureCity: searchParams.get('departureCity')?.trim() ?? '',
    arrivalCity: searchParams.get('arrivalCity')?.trim() ?? '',
    date: searchParams.get('date')?.trim() ?? '',
    seatType: parseSeatType(searchParams.get('seatType')),
    isAC: parseBooleanParam(searchParams.get('isAC')),
    departureSlot: parseDepartureSlot(searchParams.get('departureSlot')),
    minRating: (() => {
      const v = Number(searchParams.get('minRating'))
      return Number.isFinite(v) && v > 0 ? v : undefined
    })(),
    page: parsePositiveNumber(searchParams.get('page'), DEFAULT_PAGE),
    pageSize: parsePositiveNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
  }
}

function mergeUniqueBuses(previousBuses: Bus[], nextBuses: Bus[]): Bus[] {
  const mergedMap = new Map<string, Bus>()

  previousBuses.forEach((bus) => {
    mergedMap.set(bus._id, bus)
  })

  nextBuses.forEach((bus) => {
    mergedMap.set(bus._id, bus)
  })

  return [...mergedMap.values()]
}

export function BusResultsPage() {
  const { theme, toggleTheme } = useTheme()
  const navigationType = useNavigationType()
  const [searchParams, setSearchParams] = useSearchParams()
  const [resultsCache, setResultsCache] = useState<CachedResultsRecord>(() =>
    readCachedResults(),
  )
  const [activeQueryKey, setActiveQueryKey] = useState('')
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  const searchQuery = useMemo(
    () => parseBusSearchQuery(searchParams),
    [searchParams],
  )

  const hasRequiredSearchFields =
    searchQuery.departureCity.length > 0 &&
    searchQuery.arrivalCity.length > 0 &&
    searchQuery.date.length > 0

  const currentQueryKey = useMemo(() => {
    if (!hasRequiredSearchFields) {
      return ''
    }

    return serializeBusSearchQuery(searchQuery)
  }, [hasRequiredSearchFields, searchQuery])

  const previousPageQueryKey = useMemo(() => {
    if (!hasRequiredSearchFields || searchQuery.page <= DEFAULT_PAGE) {
      return ''
    }

    return serializeBusSearchQuery({
      ...searchQuery,
      page: searchQuery.page - 1,
    })
  }, [hasRequiredSearchFields, searchQuery])

  const currentResults = currentQueryKey
    ? resultsCache[currentQueryKey] ??
      (previousPageQueryKey ? resultsCache[previousPageQueryKey] : undefined)
    : undefined

  const buses = currentResults?.buses ?? []
  const pagination = currentResults?.pagination ?? null
  const hasCachedCurrentQuery = currentQueryKey.length > 0 && Boolean(resultsCache[currentQueryKey])

  const shouldShowSkeleton =
    hasRequiredSearchFields &&
    !errorMessage &&
    !isFetchingMore &&
    activeQueryKey !== currentQueryKey &&
    (!hasCachedCurrentQuery || navigationType !== 'POP')

  const activeFilters = useMemo<BusFiltersState>(
    () => ({
      seatType: searchQuery.seatType,
      isAC: searchQuery.isAC,
      departureSlot: searchQuery.departureSlot,
      minRating: searchQuery.minRating,
    }),
    [searchQuery.departureSlot, searchQuery.isAC, searchQuery.seatType, searchQuery.minRating],
  )

  const updateQueryParams = useCallback(
    (
      updates: Record<string, string | undefined>,
      options: {
        resetPage?: boolean
      } = {},
    ) => {
      const nextParams = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          nextParams.delete(key)
          return
        }

        nextParams.set(key, value)
      })

      if (options.resetPage !== false) {
        nextParams.set('page', String(DEFAULT_PAGE))
      }

      if (!nextParams.get('pageSize')) {
        nextParams.set('pageSize', String(DEFAULT_PAGE_SIZE))
      }

      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    if (!hasRequiredSearchFields || !currentQueryKey) {
      return
    }

    const controller = new AbortController()
    const fetchingMore = searchQuery.page > DEFAULT_PAGE

    Promise.resolve().then(() => {
      setErrorMessage(null)

      if (fetchingMore) {
        setIsFetchingMore(true)
      }
    })

    searchBuses(searchQuery, controller.signal)
      .then((response) => {
        setResultsCache((previousCache) => {
          const baseBuses = fetchingMore
            ? previousCache[currentQueryKey]?.buses ??
              (previousPageQueryKey ? previousCache[previousPageQueryKey]?.buses ?? [] : [])
            : []

          const mergedBuses = fetchingMore
            ? mergeUniqueBuses(baseBuses, response.data.data)
            : response.data.data

          const nextCache = {
            ...previousCache,
            [currentQueryKey]: {
              buses: mergedBuses,
              pagination: response.data.pagination,
            },
          }

          writeCachedResults(nextCache)

          return nextCache
        })

        setActiveQueryKey(currentQueryKey)
      })
      .catch((error: unknown) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          error.name === 'AbortError'
        ) {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong',
        )
      })
      .finally(() => {
        setIsFetchingMore(false)
      })

    return () => {
      controller.abort()
    }
  }, [
    currentQueryKey,
    hasRequiredSearchFields,
    previousPageQueryKey,
    retryCounter,
    searchQuery,
  ])

  const handleLoadMore = () => {
    updateQueryParams(
      {
        page: String(searchQuery.page + 1),
      },
      {
        resetPage: false,
      },
    )
  }

  const handleResetFilters = () => {
    updateQueryParams({
      seatType: undefined,
      isAC: undefined,
      departureSlot: undefined,
      minRating: undefined,
    })
  }

  const hasMorePages =
    pagination !== null ? pagination.page < pagination.totalPages : false

  const detailsBaseQuery = useMemo(() => searchParams.toString(), [searchParams])

  return (
    <div className="results-page">
      <BusResultsHeader theme={theme} onToggleTheme={toggleTheme} />

      <main className="results-main">
        <div className="results-summary">
          <h1>
            {searchQuery.departureCity || '--'} to {searchQuery.arrivalCity || '--'}
          </h1>
          <p>
            <span className="material-symbols-outlined">calendar_today</span>
            {formatIsoDateLabel(searchQuery.date)} • {pagination?.total ?? buses.length} buses found
          </p>
        </div>

        <ResultsSearchForm
          key={`${searchQuery.departureCity}-${searchQuery.arrivalCity}-${searchQuery.date}`}
          departureCity={searchQuery.departureCity}
          arrivalCity={searchQuery.arrivalCity}
          date={searchQuery.date}
          onSearch={(payload) => {
            updateQueryParams({
              departureCity: payload.departureCity,
              arrivalCity: payload.arrivalCity,
              date: payload.travelDate,
            })
          }}
        />

        <div className="results-content-grid">
          <BusFiltersSidebar
            filters={activeFilters}
            onSeatTypeChange={(seatType) => {
              updateQueryParams({ seatType })
            }}
            onIsAcChange={(isAC) => {
              updateQueryParams({
                isAC: isAC === undefined ? undefined : String(isAC),
              })
            }}
            onDepartureSlotChange={(departureSlot) => {
              updateQueryParams({ departureSlot })
            }}
            onMinRatingChange={(minRating) => {
              updateQueryParams({
                minRating: minRating === undefined ? undefined : String(minRating),
              })
            }}
            onReset={handleResetFilters}
          />

          <section className="results-list-section">
            {!hasRequiredSearchFields ? <MissingSearchState /> : null}
            {hasRequiredSearchFields && shouldShowSkeleton ? <ResultsLoadingState /> : null}
            {hasRequiredSearchFields && errorMessage && !shouldShowSkeleton ? (
              <ResultsErrorState
                message={errorMessage}
                onRetry={() => {
                  setRetryCounter((previousCounter) => previousCounter + 1)
                }}
              />
            ) : null}
            {hasRequiredSearchFields && !shouldShowSkeleton && !errorMessage && buses.length === 0 ? (
              <ResultsEmptyState />
            ) : null}

            {hasRequiredSearchFields && !shouldShowSkeleton && !errorMessage && buses.length > 0 ? (
              <>
                <div className="results-list-head">
                  <h2>{pagination?.total ?? buses.length} Buses Available</h2>
                </div>

                <div className="results-cards">
                  {buses.map((bus) => (
                    <BusResultCard
                      key={bus._id}
                      bus={bus}
                      detailsUrl={`/buses/${bus._id}?${detailsBaseQuery}`}
                    />
                  ))}
                </div>

                <div className="results-pagination">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={!hasMorePages || isFetchingMore}
                  >
                    {isFetchingMore
                      ? 'Loading...'
                      : hasMorePages
                        ? 'Show More Results'
                        : 'No More Results'}
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      </main>

      <BusResultsFooter />
    </div>
  )
}
