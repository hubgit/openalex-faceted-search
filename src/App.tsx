import { useState, useMemo, useCallback } from 'react'
import { SearchForm } from './SearchForm'
import { Facet } from './Facet'
import { Results } from './Results'

function App() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Set<string>>(new Set())

  const url = useMemo(() => {
    if (query || filters.size) {
      const url = new URL('https://api.openalex.org/works')
      url.searchParams.set('mailto', 'eaton.alf@gmail.com')
      url.searchParams.set('search', query)
      url.searchParams.set('sort', 'publication_date:desc')
      return url
    }
  }, [query, filters])

  const filteredUrl = useMemo(() => {
    if (url) {
      const filteredUrl = new URL(url)
      if (filters.size) {
        filteredUrl.searchParams.set('filter', [...filters].join(','))
      }
      return filteredUrl
    }
  }, [url, filters])

  const setFieldFilters = useCallback((field, values) => {
    setFilters((filters) => {
      for (const filter of filters) {
        if (filter.startsWith(field)) {
          filters.delete(filter)
        }
      }

      const _values = values.filter(Boolean).join('|')
      if (_values.length > 0) {
        const filter = `${field}:${_values}`
        filters.add(filter)
      }

      return new Set(filters)
    })
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <div className="bg-base-content w-full">
        <SearchForm setQuery={setQuery} />
      </div>

      {url && (
        <div className="flex-grow flex flex-row h-full overflow-hidden">
          <div className="bg-base-content h-full w-min shrink-0 overflow-y-auto flex flex-col p-b-4">
            <Facet
              url={url}
              filters={filters}
              setFieldFilters={setFieldFilters}
              field="type"
              label="Type"
              sort="count:desc"
            />

            <Facet
              url={url}
              filters={filters}
              setFieldFilters={setFieldFilters}
              field="publication_year"
              label="Year"
              sort="count:desc"
            />

            <Facet
              url={url}
              filters={filters}
              setFieldFilters={setFieldFilters}
              exclude={false}
              field="author.id"
              label="Author"
              sort="count:desc"
            />

            <Facet
              url={url}
              filters={filters}
              setFieldFilters={setFieldFilters}
              exclude={false}
              field="institutions.id"
              label="Institution"
              sort="count:desc"
            />
          </div>

          <div className="overflow-y-auto">
            <Results url={filteredUrl} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
