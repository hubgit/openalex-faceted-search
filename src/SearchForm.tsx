import { useCallback } from 'react'
import { SearchButton } from './SearchButton'

export const SearchForm = ({ setQuery }) => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      setQuery(formData.get('query'))
    },
    [setQuery]
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control p-2">
        <div className="input-group">
          <input
            name="query"
            type="search"
            placeholder="Search…"
            className="input input-bordered input-sm w-full"
          />
          <SearchButton />
        </div>
      </div>
    </form>
  )
}
