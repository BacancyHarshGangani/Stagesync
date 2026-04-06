import { NextRequest } from "next/server";
import { vendorProfileController } from "@/controllers/vendorprofile.controller";

export async function POST(req: NextRequest) {
  return vendorProfileController(req);
}