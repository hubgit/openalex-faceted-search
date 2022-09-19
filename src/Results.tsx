import { useState, useEffect } from 'react'

type Result = {
  id: string
  doi?: string
  display_name?: string
  publication_year?: number
  cited_by_count: number
  authorships?: Array<{
    id: string
    author: {
      id: string
      display_name: string
    }
  }>
}

export const Results = ({ url }) => {
  const [results, setResults] = useState<Result[]>()

  useEffect(() => {
    const _url = new URL(url)
    _url.searchParams.set('sort', 'publication_date:desc')
    fetch(_url.toString())
      .then((response) => response.json())
      .then((data) => setResults(data.results))
  }, [url])

  if (!results) {
    return null
  }

  return (
    <div className="overflow-x-hidden w-full">
      {results.map((result) => (
        <div
          key={result.id}
          className="flex flex-row border-y border-solid border-slate-50 p-2"
        >
          <div className="opacity-50 pr-3 pl-1 shrink-0 flex flex-col items-center text-sm">
            <div>{result.publication_year}</div>
            <div className="badge badge-sm">{result.cited_by_count}</div>
          </div>

          <div className="flex flex-grow">
            <div>
              <div className="text-sm opacity-50 flex flex-wrap">
                {result.authorships?.map((author, index) => {
                  return (
                    <span className="whitespace-nowrap" key={author.id}>
                      <span>{author.author.display_name}</span>
                      {index !== result.authorships.length - 1 && (
                        <span className="whitespace-pre">, </span>
                      )}
                    </span>
                  )
                })}
              </div>

              <div className="font-bold overflow-x-auto">
                <a href={result.doi} target="_blank" rel="noopener noreferrer">
                  {result.display_name}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
