import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import { navigation } from "@/lib/const";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 pt-24 pb-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col mb-8">
              <span className="text-3xl font-serif tracking-[0.2em] text-foreground uppercase">
                Vantage
              </span>
              <span className="text-[7px] tracking-[0.5em] text-primary font-bold uppercase -mt-1">
                Premium Selection
              </span>
            </Link>
            <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 max-w-xs">
              Curating the world&apos;s finest goods to elevate every aspect of your daily life.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-4 w-4" aria-hidden="true" strokeWidth={1} />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-foreground">Departments</h4>
            <ul className="space-y-5">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary text-xs font-light tracking-widest uppercase transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-foreground">Our World</h4>
            <ul className="space-y-5">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary text-xs font-light tracking-widest uppercase transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-foreground">Client Care</h4>
            <ul className="space-y-5">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary text-xs font-light tracking-widest uppercase transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-muted-foreground tracking-[0.5em] uppercase">
            &copy; {new Date().getFullYear()} VANTAGE PREMIUM. GLOBAL SELECTION.
          </p>
          <div className="flex items-center space-x-10">
             <span className="text-[9px] text-muted-foreground tracking-[0.5em] uppercase hover:text-primary cursor-pointer transition-colors">Legal</span>
             <span className="text-[9px] text-muted-foreground tracking-[0.5em] uppercase hover:text-primary cursor-pointer transition-colors">Privacy</span>
             <span className="text-[9px] text-muted-foreground tracking-[0.5em] uppercase hover:text-primary cursor-pointer transition-colors">Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
