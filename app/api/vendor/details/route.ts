import { vendordetailsController } from "@/controllers/vendorprofile.controller";

export async function GET(){
    const vendor_details = await vendordetailsController();

    return vendor_details;
}