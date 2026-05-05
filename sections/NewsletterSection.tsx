import React from "react";

function NewsletterSection() {
  return (
    <section className="py-32 border-t border-border/40 bg-muted/5">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="text-primary tracking-[0.5em] text-[10px] font-bold uppercase mb-8 block">
          The VANTAGE Circle
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-10 leading-tight">
          Exclusive access to <br /> limited-run drops.
        </h2>
        <form className="mt-12 flex flex-col sm:flex-row items-center gap-0 border-b border-foreground/10 focus-within:border-primary transition-colors pb-4 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="YOUR PREFERRED EMAIL"
            className="w-full bg-transparent border-none px-6 py-4 text-xs font-light tracking-[0.3em] text-foreground focus:ring-0 placeholder:text-muted-foreground/40 uppercase"
          />
          <button className="w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground hover:text-primary transition-colors">
            Subscribe
          </button>
        </form>
        <p className="mt-8 text-[9px] text-muted-foreground tracking-[0.4em] uppercase opacity-50">
          Privacy is our priority. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;
