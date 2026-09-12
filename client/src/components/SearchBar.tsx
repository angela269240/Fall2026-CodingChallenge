import { useState } from 'react'
import { Search } from 'lucide-react'

type SearchBarProps = {
  onSearch: (
    query: string
  ) => void

  loading?: boolean
}

function SearchBar({
  onSearch,
  loading = false
}: SearchBarProps) {
  const [query, setQuery] =
    useState('')

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    const trimmedQuery =
      query.trim()

    if (
      !trimmedQuery ||
      loading
    ) {
      return
    }

    onSearch(trimmedQuery)
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <Search
        className="search-icon"
        size={20}
        aria-hidden="true"
      />

      <input
        type="text"
        placeholder="Search photos, places, ideas..."
        value={query}
        onChange={(event) =>
          setQuery(
            event.target.value
          )
        }
        aria-label="Search images"
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? 'Searching...'
          : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar