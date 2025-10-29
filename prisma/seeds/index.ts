import { seedAdmin } from "./seedAdmin"
import { PrismaClient } from "@prisma/client"

async function seed(){
    // Seed Function Call Goes Here
    const prisma = new PrismaClient();

    await seedAdmin(prisma)
}

seed().then(()=>{
    console.log("ALL SEEDING DONE")
})