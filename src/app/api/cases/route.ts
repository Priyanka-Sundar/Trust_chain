import { NextResponse } from "next/server";
import casesData from "@/../public/data/cases.json";

export async function GET() {
  return NextResponse.json(casesData);
}
