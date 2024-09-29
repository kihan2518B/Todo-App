import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        //getting all todos
        const todos = await prisma.todo.findMany();

        if (!todos) {
            return new NextResponse(JSON.stringify({ message: "Todos not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            })
        }

        return new NextResponse(JSON.stringify({ message: 'Found todos', todos }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.log("error while fetching todos: ", error);
        return new NextResponse(JSON.stringify({ message: "Error while fetching todos" }), {
            status: 504,
            headers: { "Content-Type": "application/json" }
        })
    }
}