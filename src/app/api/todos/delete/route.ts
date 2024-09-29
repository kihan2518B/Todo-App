import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const Todoid = searchParams.get("todoID");

        if (!Todoid) {
            return new NextResponse(JSON.stringify({ message: "Todo ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        console.log("Todoid: ", Number(Todoid));

        const deletedTodo = await prisma.todo.delete({ where: { id: Number(Todoid) } })
        return new NextResponse(JSON.stringify({ message: "Todo deleted", deletedTodo }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: "Error while deleting todo" }), {
            status: 504,
            headers: { "Content-Type": "application/json" }
        })

    }
}