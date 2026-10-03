import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

// Visitor counter with two stores:
//  - on Vercel (or any host) with an Upstash / Vercel KV Redis attached, the
//    count lives there — set KV_REST_API_URL + KV_REST_API_TOKEN (or the
//    UPSTASH_REDIS_REST_* pair), which the Vercel integration adds for you;
//  - otherwise a local file, which is fine on your own machine / a normal
//    server but not on Vercel's read-only, ephemeral disk.
const KEY = "jyora:visitors";
const REST_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const FILE = path.join(process.cwd(), ".data", "visitors.json");

async function redis(command: string): Promise<number> {
  const res = await fetch(`${REST_URL}/${command}`, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const { result } = await res.json();
  return Number(result) || 0;
}

async function readFile(): Promise<number> {
  try {
    const { count } = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Number.isFinite(count) ? count : 0;
  } catch {
    return 0;
  }
}

async function read(): Promise<number> {
  return REST_URL && REST_TOKEN ? redis(`get/${KEY}`) : readFile();
}

async function increment(): Promise<number> {
  if (REST_URL && REST_TOKEN) return redis(`incr/${KEY}`);
  const count = (await readFile()) + 1;
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify({ count }));
  return count;
}

export async function GET() {
  try {
    return Response.json({ count: await read() });
  } catch {
    return Response.json({ count: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    return Response.json({ count: await increment() });
  } catch {
    // no writable store: report failure so the browser isn't given a number
    return Response.json({ count: 0 }, { status: 500 });
  }
}
