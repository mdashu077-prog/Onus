import { Search, MapPin } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr]">
      <label className="block">
        <div className="flex items-center gap-3 rounded-lg border border-transparent bg-white px-4 py-3 transition hover:shadow-sm">
          <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
          <select className="w-full cursor-pointer border-none bg-transparent text-sm font-medium text-slate-900 outline-none">
            <option>Bangalore</option>
            <option>Hyderabad</option>
            <option>Mumbai</option>
          </select>
        </div>
      </label>
      <label className="block">
        <div className="flex items-center gap-3 rounded-lg border border-transparent bg-white px-4 py-3 transition hover:shadow-sm">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
          <input type="text" placeholder="React, Java, Python..." className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder-slate-400" />
        </div>
      </label>
    </div>
  )
}
