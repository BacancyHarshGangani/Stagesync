import { createServer } from "@/lib/supabase/server"

type event = {
    event_name : string,
    event_type : string,
    start_date : string,
    end_date : string,
    venue_city : string,
    headcount : number,
    budget_ceiling : number,
}

export async function create_event(data: event, userId: string) {
  const supabase = await createServer();

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      ...data,
      planner_id: userId
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return event;
}