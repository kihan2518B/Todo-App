import prisma from "@/lib/prisma";
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
        console.log("Error while creating a todo: ", error)
        return new NextResponse(JSON.stringify({ message: "Error while creating a todo!" }), {
            status: 504,
            headers: { "Content-Type": "application/json" }
        })
    }
}