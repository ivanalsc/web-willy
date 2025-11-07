import localFont from "next/font/local"

export const transducer = localFont({
  src: [
    {
      path: "../../public/fonts/TransducerTest-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TransducerTest-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/TransducerTest-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-transducer",
})
