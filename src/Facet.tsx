import { useCallback, useEffect, useMemo, useState } from 'react'
import { FacetItem } from './FacetItem'

const collapseSize = 5

type Item = {
  key: string
}

export const Facet = ({
  url,
  filters,
  setFieldFilters,
  field,
  sort = 'count:desc',
  label,
  exclude = true,
}) => {
  const [items, setItems] = useState<Item[]>()
  const [expanded, setExpanded] = useState(false)
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFieldFilters(
      field,
      values.map((value) => value.key)
    )
  }, [field, values, setFieldFilters])

  useEffect(() => {
    setLoading(true)
    const facetURL = new URL(url)
    facetURL.searchParams.set('group_by', field)
    facetURL.searchParams.set('sort', sort)
    const _filters = [...filters].filter((item) =>
      exclude ? !item.startsWith(field) : true
    )
    if (_filters.length) {
      facetURL.searchParams.set('filter', _filters.join(','))
    }
    fetch(facetURL.toString())
      .then((response) => response.json())
      .then((data) => setItems(data.group_by))
      .finally(() => {
        setLoading(false)
      })
  }, [url, field, sort, filters, exclude])

  const toggleFilter = useCallback(
    (event, item, active) => {
      setValues((values) => {
        if (active) {
          return values.filter((value) => value.key !== item.key)
        } else {
          return event.metaKey ? [...values, item] : [item]
        }
      })
    },
    [setValues]
  )

  const toggleExpand = useCallback(() => {
    setExpanded((value) => !value)
  }, [])

  const displayItems = useMemo(() => {
    if (items) {
      return expanded ? items : items.slice(0, collapseSize)
    }
  }, [items, expanded])

  return (
    <div className={`p-2 ${loading && 'opacity-50'}`}>
      <div className="flex text-white">
        <button
          // disabled={items.length <= collapseSize}
          onClick={toggleExpand}
          className="btn btn-xs text-white text-xs pl-1 mb-1"
        >
          <span className="mr-1">{expanded ? '▼' : '▶'}</span>
          {label}
        </button>
      </div>

      {displayItems &&
        (displayItems.length === 0 ? (
          <div>
            {values.map((item) => (
              <FacetItem
                key={item.key}
                item={{ ...item, count: 0 }}
                active={true}
                toggleFilter={toggleFilter}
              />
            ))}
          </div>
        ) : (
          displayItems.map((item) => {
            return (
              <FacetItem
                key={item.key}
                item={item}
                active={values.some((value) => value.key === item.key)}
                toggleFilter={toggleFilter}
              />
            )
          })
        ))}
    </div>
  )
}
