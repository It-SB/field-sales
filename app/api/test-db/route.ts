import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db";
import type { User } from "@/lib/types";

export async function GET() {
  try {
    const users = await readJsonFile<User[]>("users.json");

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to read users database",
      },
      {
        status: 500,
      }
    );
  }
}