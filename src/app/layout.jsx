import "../index.css";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Kyaw Swar Hein — Full-stack Developer & Visual Designer",
  description:
    "Full-stack developer, visual designer, and editor crafting high-performance web experiences and clean digital narratives.",
  keywords:
    "Kyaw Swar Hein, Full-stack Developer, Visual Designer, Web Development, Portfolio, React Developer",
  authors: [{ name: "Kyaw Swar Hein" }],
  openGraph: {
    type: "website",
    url: "https://kyawswarhein.netlify.app/",
    title: "Kyaw Swar Hein — Full-stack Developer & Designer",
    description:
      "Engineering the stack. Designing the experience. Exploring the intersection of code and aesthetics.",
    images: [{ url: "/dennis.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyaw Swar Hein — Full-stack Developer & Designer",
    description: "Full-stack engineer by trade. Visual designer by instinct.",
    images: ["/dennis.webp"],
  },
  icons: {
    icon: "/dennis.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,200;0,300;0,500;0,600;0,800;1,400&display=swap'
        />
      </head>
      <body>
        <Providers>
          <div id='root'>{children}</div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
