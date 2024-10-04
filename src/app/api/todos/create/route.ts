import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { title, priority, category, dueDate } = await req.json();
        console.log("title, priority, category, dueDate: ", title, priority, category, dueDate)
        if (!title || !priority || !category || !dueDate) {
            throw new Error("all fields are required")
        }

        // Convert dueDate to Date object if it's a string
        const dueDateObject = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

        const newTodo = await prisma.todo.create({
            data: {
                title,
                priority,
                category,
                dueDate: dueDateObject
            }
        })

        return new NextResponse(JSON.stringify({ message: "Todo created succesfully", todo: newTodo }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.error("Error while creating a todo: ", error);

        // Log more details if it's a known Prisma error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma error code:", error.code);
            console.error("Prisma meta:", error.meta);
        } else {
            console.error("Error message:", error);
        }

        return new NextResponse(JSON.stringify({ message: "Error while creating a todo!", error: error }), {
            status: 500, // Use 500 (internal server error) instead of 504
            headers: { "Content-Type": "application/json" }
        });
    }
}