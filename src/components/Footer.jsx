import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#2563EB] py-10 sm:py-12">
      <div className="container-center grid gap-8 px-3 sm:px-4 md:grid-cols-[1.5fr_1fr] md:items-start md:gap-12">
        <div>
          <div className="mb-4 text-2xl font-bold text-white">ONUS</div>
          <p className="max-w-md text-sm text-slate-100/90">Connecting talent with opportunity through smarter hiring and better job matching.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-white">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-100/80">
              <Link to="/about" className="hover:text-white">About Us</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
              <Link to="/about" className="hover:text-white">Careers</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-100/80">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container-center mt-10 border-t border-white/10 pt-6 text-sm text-slate-100/70">
        © {new Date().getFullYear()} ONUS. All rights reserved.
      </div>
    </footer>
  )
}
