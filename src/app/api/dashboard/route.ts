import { NextResponse } from "next/server";
import dashboardData from "@/../public/data/dashboard_data.json";

export async function GET() {
  return NextResponse.json(dashboardData);
}
