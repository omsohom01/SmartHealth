import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Activity,
  Zap,
  ArrowRight,
  Send,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-gray-800/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="group relative flex items-center transition-all duration-500 mb-6">
              <div className="flex items-center space-x-3">
                {/* Logo Icon with sophisticated design */}
                <div className="relative">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-100 to-white rounded-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500 animate-logo-pulse border border-gray-200/20">
                    <div className="relative">
                      <Activity className="w-6 h-6 lg:w-7 lg:h-7 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                      <Zap className="absolute -top-1 -right-1 w-3 h-3 text-gray-700 animate-scale-pulse" />
                    </div>
                  </div>
                  {/* Floating particles around logo */}
                  <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full animate-float"></div>
                    <div
                      className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-float"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full animate-float"
                      style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                      className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full animate-float"
                      style={{ animationDelay: "3s" }}
                    ></div>
                  </div>
                </div>

                {/* Logo Text with enhanced typography */}
                <div className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-bold tracking-[0.15em] text-white group-hover:text-gray-200 transition-colors duration-300">
                    SYNAPTIX
                  </span>
                  <span className="text-xs text-gray-500 tracking-[0.3em] font-light -mt-1">HEALTHCARE</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 max-w-md font-light">
              Revolutionizing healthcare through AI-powered solutions and seamless doctor-patient connections.
            </p>

            {/* Newsletter signup with enhanced styling */}
            <div className="space-y-4">
              <h3 className="text-white font-medium text-base lg:text-lg tracking-wider flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-400 animate-pulse" />
                STAY UPDATED
              </h3>
              <div className="flex gap-3">
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-900/30 border border-gray-700/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600/50 transition-all duration-300 font-light text-sm lg:text-base group-hover:bg-gray-900/50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                </div>
                <Button className="group relative overflow-hidden bg-white text-black hover:bg-gray-100 px-4 lg:px-6 py-3 rounded-xl font-medium tracking-wider transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105">
                  <span className="relative z-10 flex items-center">
                    <Send className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                    <span className="ml-2 hidden sm:inline">SUBSCRIBE</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium text-base lg:text-lg mb-6 tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-3 lg:space-y-4">
              {["Home", "About Us", "Services", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="group text-gray-400 hover:text-white transition-all duration-300 text-sm lg:text-base font-light flex items-center"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium text-base lg:text-lg mb-6 tracking-wider">CONTACT</h3>
            <div className="space-y-4 lg:space-y-6">
              <div className="group flex items-start gap-3 text-gray-400 transition-all duration-300 hover:text-white">
                <div className="w-10 h-10 bg-gray-800/30 rounded-lg flex items-center justify-center group-hover:bg-gray-700/50 transition-colors duration-300">
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <a
                    href="mailto:hello@synaptix.com"
                    className="text-sm lg:text-base hover:text-white transition-colors font-medium"
                  >
                    hello@synaptix.com
                  </a>
                  <p className="text-xs lg:text-sm text-gray-500">24/7 Support</p>
                </div>
              </div>

              <div className="group flex items-start gap-3 text-gray-400 transition-all duration-300 hover:text-white">
                <div className="w-10 h-10 bg-gray-800/30 rounded-lg flex items-center justify-center group-hover:bg-gray-700/50 transition-colors duration-300">
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <a
                    href="tel:+1234567890"
                    className="text-sm lg:text-base hover:text-white transition-colors font-medium"
                  >
                    +1 (234) 567-890
                  </a>
                  <p className="text-xs lg:text-sm text-gray-500">Emergency Line</p>
                </div>
              </div>

              <div className="group flex items-start gap-3 text-gray-400 transition-all duration-300 hover:text-white">
                <div className="w-10 h-10 bg-gray-800/30 rounded-lg flex items-center justify-center group-hover:bg-gray-700/50 transition-colors duration-300">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-sm lg:text-base font-medium">123 Health Street</p>
                  <p className="text-xs lg:text-sm text-gray-500">Medical District, HC 98765</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800/30 mt-12 lg:mt-16 pt-8 lg:pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-8">
            {/* Copyright */}
            <div className="text-gray-500 text-xs lg:text-sm font-light">
              &copy; {new Date().getFullYear()} Synaptix. All rights reserved. Made with{" "}
              <Heart className="inline w-3 h-3 text-red-400 animate-pulse" /> for better healthcare.
            </div>

            {/* Enhanced Social Links */}
            <div className="flex items-center gap-3 lg:gap-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600/20 hover:text-blue-400" },
                { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-600/20 hover:text-sky-400" },
                { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700/20 hover:text-blue-300" },
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600/20 hover:text-pink-400" },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "group relative w-10 h-10 lg:w-12 lg:h-12 bg-gray-800/50 text-gray-400 rounded-xl flex items-center justify-center transition-all duration-500 magnetic-hover overflow-hidden",
                    color,
                  )}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
