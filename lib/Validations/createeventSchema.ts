import { z } from "zod";

export const createEventSchema = z.object({
    event_name : z.string().min(1, "Event name is required"),
    event_type : z.string().min(1, "Event type is required"),
    start_date : z.string().min(1, "Start date is required"),
    end_date : z.string().min(1, "End date is required"),
    venue_city : z.string().min(1, "Venue city is required"),
    headcount : z.number().min(1, "Headcount must be greater than 0"),
    budget_ceiling : z.number().min(1, "Budget ceiling must be greater than 0"),
    event_type_other : z.string().min(1, "Plaease specify event type").optional()
}).refine((data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return startDate <= endDate;
},{
    message : "Start date must be before end date",
    path : ["end_date"],
})