import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";

const navigation = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Featured Collections", href: "/#collections" },
    { name: "Trending", href: "/#trending" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Store Locator", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Shipping & Returns", href: "#" },
    { name: "Track Order", href: "#" },
    { name: "FAQs", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: FacebookIcon,
    },
    {
      name: "Instagram",
      href: "#",
      icon: InstagramIcon,
    },
    {
      name: "Twitter",
      href: "#",
      icon: TwitterIcon,
    },
    {
      name: "YouTube",
      href: "#",
      icon: YoutubeIcon,
    },
  ],
};

export { navigation };
