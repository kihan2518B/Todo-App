import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { title } = await req.json();
        if (!title) {
            throw new Error("title is required")
        }

        const newTodo = await prisma.todo.create({
            data: {
                title
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