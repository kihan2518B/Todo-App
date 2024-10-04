import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const Todoid = searchParams.get("todoID");
        const { title, priority, category, dueDate } = await req.json();

        if (!Todoid) {
            return new NextResponse(JSON.stringify({ message: "Todo ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        console.log("Todoid: ", Number(Todoid));

        const updatedTodo = await prisma.todo.update({
            where: { id: Number(Todoid) },
            data: {
                title, priority, category, dueDate
            }
        })

        if (!updatedTodo) {
            throw new Error("Error while updating Todo")
        }

        return new NextResponse(JSON.stringify({ message: "Todo Updated", updatedTodo }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: "Error while Updated todo" }), {
            status: 504,
            headers: { "Content-Type": "application/json" }
        })

    }
}