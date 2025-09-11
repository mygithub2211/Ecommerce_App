import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

//const adminEmails = ['phattran13062002@gmail.com']

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  /*callbacks: {
    async signIn({ user }) {
      return adminEmails.includes(user?.email)
    },
    
    async session({ session }) {
      session.isAdmin = adminEmails.includes(session?.user?.email)
      return session
    },
  },*/
}

export default NextAuth(authOptions)

// Helper for API routes that require admin
/*export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !adminEmails.includes(session.user?.email)) {
    res.status(401).end('not an admin')
    throw new Error('not an admin')
  }
}*/
