import { MapPin, Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
      <label className="block">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
          <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
          <select className="w-full cursor-pointer border-none bg-transparent text-sm font-medium text-slate-900 outline-none">
            <option>Bangalore</option>
            <option>Hyderabad</option>
            <option>Mumbai</option>
            <option>Delhi NCR</option>
          </select>
        </div>
      </label>

      <label className="block">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
          <input
            type="text"
            placeholder="React, Java, Python..."
            className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </label>
    </div>
  )
}
