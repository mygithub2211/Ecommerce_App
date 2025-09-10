/*import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb'

const adminEmails = ["phattran13062002@gmail.com"]

export const authOptions = {
  providers: [
   GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session:({session, token, user}) => {
      if(adminEmails.includes(session?.user?.email)) {
        return session
      } else {
        return false
      }
    }
  }
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession (req, res, authOptions)
  if(!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw 'not an admin'
  }
}*/


import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

const adminEmails = ['phattran13062002@gmail.com']

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,   // ← REQUIRED in production
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Gate sign-in to admins only
    async signIn({ user }) {
      return adminEmails.includes(user?.email)
    },
    // Keep session valid, optionally tag it
    async session({ session }) {
      session.isAdmin = adminEmails.includes(session?.user?.email)
      return session
    },
  },
}

export default NextAuth(authOptions)

// Helper for API routes that require admin
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !adminEmails.includes(session.user?.email)) {
    res.status(401).end('not an admin')
    throw new Error('not an admin')
  }
}
