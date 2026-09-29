import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

// File-backed counter. Persists on a normal server / local machine; serverless
// hosts with a read-only or ephemeral disk (e.g. Vercel) need a real store.
const FILE = path.join(process.cwd(), ".data", "visitors.json");

async function read(): Promise<number> {
  try {
    const { count } = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Number.isFinite(count) ? count : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  return Response.json({ count: await read() });
}

export async function POST() {
  const count = (await read()) + 1;
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify({ count }));
  } catch {
    return Response.json({ count: count - 1 }, { status: 500 });
  }
  return Response.json({ count });
}
