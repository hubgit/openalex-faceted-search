const numberFormatter = new Intl.NumberFormat()

export const FacetItem = ({ item, active, toggleFilter }) => {
  return (
    <button
      key={item.key}
      className={`justify-between btn btn-xs btn-block flex-nowrap ${
        active ? 'btn-active' : ''
      }`}
      onClick={(event) => toggleFilter(event, item, active)}
    >
      <div className="mr-4 whitespace-nowrap max-w-xs min-w-xs overflow-hidden text-ellipsis">
        {item.key_display_name ?? item.key}
      </div>
      {item.count && (
        <div className="badge badge-sm font-mono font-extralight">
          {numberFormatter.format(item.count)}
        </div>
      )}
    </button>
  )
}
