import Link from 'next/link'
import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
     <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-xl font-bold mb-4">Kareem</h4>
            <p className="text-gray-400">
              A beautiful, responsive website built with modern tools like Next.js, Tailwind CSS, and Redux Toolkit.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link href="/sign-up" className="hover:text-white transition">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white transition">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaLinkedinIn size={20} />
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} Kareem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

  )
}

export default Footer
