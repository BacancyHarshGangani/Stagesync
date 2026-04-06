import { vendordetailesService, vendorService } from "@/services/vendor.servies";
import { NextRequest, NextResponse } from "next/server";

export const vendorProfileController = async (req: NextRequest) => {
    try {

        const body = await req.json();
        const result = await vendorService(body);

        return NextResponse.json({
            message :"Vendor Profile Created Successfully",
            data: result
        });

    } catch (error :any) {
        console.log("Calling vendor service error :",error);
        return NextResponse.json(
          {
            error: error.message || "Something went wrong",
          },
          { status: 500 },
        );
    }
}

export const vendordetailsController = async () => {
    try {
        const data = await vendordetailesService();

        return NextResponse.json({
            message:"Vendor details got successfully",
            vendor : data
        })
    } catch (error:any) {
        console.log(error);
        return NextResponse.json({
            error : error.message || "Something went wrong in get vendor details"
        }, {
            status : 500
        })
    }
}