/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@rankflow.com' },
    update: {},
    create: {
      email: 'admin@rankflow.com',
      name: 'Admin',
      password,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
