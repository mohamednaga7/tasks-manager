import dotenv from 'dotenv'
import { PrismaClient, TicketStatus, User } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { join } from 'path'
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

const ticketStatusArray = Object.keys(TicketStatus)

const seedDB = async () => {
  const prisma = new PrismaClient()

  const users: User[] = []

  await prisma.ticketHistory.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // create 10 fake users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      },
    })
    users.push(user)
  }

  for (let i = 0; i < 60; i++) {
    await prisma.ticket.create({
      data: {
        title: faker.random.words(4),
        description: faker.random.words(20),
        status: (ticketStatusArray[
          Math.floor(Math.random() * ticketStatusArray.length)
        ] || TicketStatus.TODO) as TicketStatus | undefined,
        assignedUserId: users[Math.floor(Math.random() * users.length)].id,
        createdAt: faker.date.past(30),
        updatedAt: faker.date.past(30),
        authorId: users[Math.floor(Math.random() * users.length)].id,
        lastUpdatedByUserId: users[Math.floor(Math.random() * users.length)].id,
      },
    })
  }
}

seedDB()
