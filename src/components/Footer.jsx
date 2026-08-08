import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 sm:py-12">
      <div className="container-center grid gap-8 px-3 sm:px-4 md:grid-cols-[1.5fr_1fr] md:items-start md:gap-12">
        <div>
          <div className="mb-4 text-2xl font-bold text-secondary">ONUS</div>
          <p className="max-w-md text-sm text-slate-600">Connecting talent with opportunity through smarter hiring and better job matching.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-secondary">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/about" className="hover:text-primary">About Us</Link>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
              <Link to="/about" className="hover:text-primary">Careers</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-secondary">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-primary">Support</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container-center mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} ONUS. All rights reserved.
      </div>
    </footer>
  )
}
