import { Search, MapPin } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.5fr]">
      <label className="block">
        <div className="flex items-center gap-3 rounded-lg border border-transparent bg-white px-4 py-3 hover:shadow-sm transition">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <select className="w-full border-none bg-transparent text-sm text-slate-900 font-medium outline-none cursor-pointer">
            <option>Bangalore</option>
            <option>Hyderabad</option>
            <option>Mumbai</option>
          </select>
        </div>
      </label>
      <label className="block">
        <div className="flex items-center gap-3 rounded-lg border border-transparent bg-white px-4 py-3 hover:shadow-sm transition">
          <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <input type="text" placeholder="React, Java, Python..." className="w-full border-none bg-transparent text-sm text-slate-900 placeholder-slate-400 font-medium outline-none" />
        </div>
      </label>
    </div>
  )
}
