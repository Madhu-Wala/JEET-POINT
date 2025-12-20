function Footer() {
  return (
    <footer className="bg-indigo-900 text-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">

        {/* JEET Point Description */}
        <div className="w-full md:w-1/3">
          <h1 className="text-2xl font-bold mb-4">JEET Point</h1>
          <p className="text-sm leading-relaxed text-gray-300">
            JEET Point is your dedicated quiz platform built for JEE and NEET aspirants.
            Take focused practice tests, analyze your progress, and build confidence — one question at a time.
            <br />
            <strong>Learn. Practice. JEET It!</strong>
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/4">
          <h1 className="text-xl font-semibold mb-4">Quick Links</h1>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-purple-300 cursor-pointer"><a href="/">Home</a></li>
            <li className="hover:text-purple-300 cursor-pointer"><a href="/#features">Features</a></li>
            <li className="hover:text-purple-300 cursor-pointer"><a href="/#about">About us</a></li>
            <li className="hover:text-purple-300 cursor-pointer"><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full md:w-1/3">
          <h1 className="text-xl font-semibold mb-4">Contact Us</h1>
          <p className="text-sm text-gray-300 mb-2">✉️ Email: support@jeetpoint.com</p>
          <p className="text-sm text-gray-300 mb-2">📍 Location: Mumbai, India</p>
          <p className="text-sm text-gray-300">🕒 Response time: Usually within 24 hours</p>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="mt-8 text-center text-sm text-indigo-200">
        © 2025 JEET Point. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
