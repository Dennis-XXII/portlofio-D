import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // You can add custom logic here if needed
      return !!token
    },
  },
})

export const config = { matcher: ["/admin/:path*"] }
