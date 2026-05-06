"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate subscription delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setMessage("Welcome to the circle. Check your inbox soon.");
      setEmail("");

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err) {
      setStatus("error");
      setMessage("Subscription failed. Please try again later.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-32 border-t border-border/10 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="text-primary tracking-[0.5em] text-[10px] font-bold uppercase mb-8 block animate-fade-in">
          The VANTAGE Circle
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-10 leading-tight">
          Exclusive access to <br /> limited-run drops.
        </h2>

        {/* Improved Form Container */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col sm:flex-row items-stretch gap-0 bg-black/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-sm focus-within:border-primary/50 transition-all duration-500 max-w-2xl mx-auto group backdrop-blur-sm relative"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            placeholder="YOUR PREFERRED EMAIL"
            className="flex-grow bg-transparent border-none px-8 py-6 text-xs font-light tracking-[0.3em] text-foreground focus:ring-0 placeholder:text-muted-foreground/60 dark:placeholder:text-white/30 uppercase focus:border-none focus:outline-none disabled:opacity-50"
          />

          <Button
            type="submit"
            isLoading={status === "loading"}
            disabled={status === "success"}
            className="sm:w-auto cursor-pointer"
          >
            {status === "success" ? "Subscribed" : "Subscribe"}
          </Button>
        </form>

        {/* Status Message */}
        <div className="h-6 mt-6 overflow-hidden">
          {message && (
            <p
              className={`text-[10px] tracking-[0.3em] uppercase animate-slide-up ${
                status === "error"
                  ? "text-destructive"
                  : "text-primary dark:text-accent"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <p className="mt-2 text-[9px] text-muted-foreground tracking-[0.4em] uppercase opacity-60">
          Privacy is our priority. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;
