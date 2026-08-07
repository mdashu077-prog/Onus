export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="container-center grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-start md:gap-12">
        <div>
          <div className="mb-4 text-2xl font-bold text-secondary">ONUS</div>
          <p className="max-w-md text-sm text-slate-600">Connecting talent with opportunity through smarter hiring and better job matching.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-secondary">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <a href="#" className="hover:text-primary">About Us</a>
              <a href="#" className="hover:text-primary">Contact</a>
              <a href="#" className="hover:text-primary">Careers</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-secondary">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms & Conditions</a>
              <a href="#" className="hover:text-primary">Support</a>
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
