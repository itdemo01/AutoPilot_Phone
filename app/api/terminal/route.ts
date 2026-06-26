import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { command, cwd } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    // Execute the command
    // WARNING: In a real production app, this is highly insecure without authentication and authorization.
    const { stdout, stderr } = await execAsync(command, { cwd: cwd || process.cwd() });

    return NextResponse.json({ 
      output: stdout + (stderr ? "\n" + stderr : ""), 
      cwd: process.cwd() 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to execute command",
      output: error.stdout ? error.stdout + "\n" + error.stderr : error.message
    }, { status: 500 });
  }
}
