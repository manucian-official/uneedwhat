import { NextResponse } from "next/server";
import { dashboardMetrics } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    totalJobs: dashboardMetrics.totalJobs,
    activeJobs: dashboardMetrics.activeJobs,
    totalCandidates: dashboardMetrics.totalCandidates,
    hireRate: dashboardMetrics.hireRate,
  });
}
