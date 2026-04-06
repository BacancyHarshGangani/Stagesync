'use client'

import { createEventSchema } from "@/lib/Validations/createeventSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

export default function newEvent() {
  const { register, handleSubmit, formState, watch } = useForm<
    z.input<typeof createEventSchema>
  >({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      event_name: "",
      event_type: "",
      start_date: "",
      end_date: "",
      venue_city: "",
      headcount: 0,
      budget_ceiling: 0,
      event_type_other: "",
    },
  });

  const event_type = watch('event_type');

  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const creteevent = async () => {
    console.log("Submit");
  };

  return (
    <div>
      <div className="text-2xl font-bold flex flex-col mt-6 items-center">
        Create New Event
      </div>
      <form
        onSubmit={handleSubmit(creteevent)}
        className="flex flex-col items-center"
      >
        <div className="flex flex-col ">
          <label htmlFor="event_name" className="mt-4">
            Event Name
          </label>
          <input
            type="text"
            {...register("event_name")}
            placeholder="Event Name"
            className=" p-2 rounded w-64 border-2 border-gray-400"
          />

          {formState.errors.event_name && (
            <span className="text-red-600">
              {formState.errors.event_name.message}
            </span>
          )}
          
          <div className="mt-4">
            <label htmlFor="category">Event type</label>
            <select
              {...register("event_type")}
              className="w-full border rounded-lg px-3 py-2  focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select a category</option>
              <option value="corporate">corporate</option>
              <option value="wedding">wedding</option>
              <option value="conference">conference</option>
              <option value="social">social</option>
              <option value="party">party</option>
              <option value="Other">Other</option>
            </select>

            {formState.errors.event_type && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.event_type.message}
              </p>
            )}
          </div>

          {event_type === "Other" && (
            <div className="flex flex-col mt-4">
              <label htmlFor="event_type_other">Please Specify</label>
              <input
                type="text"
                placeholder="Enter your event type"
                {...register("event_type_other")}
                className="p-2 rounded w-64 border-2 border-gray-400"
              />
            </div>
          )}

          <label htmlFor="start_date" className="mt-4">
            Start Date
          </label>
          <input
            type="date"
            min={formattedToday}
            {...register("start_date")}
            placeholder="Start Date"
            className="p-2 rounded w-64 border-2 border-gray-400"
          />
          {formState.errors.start_date && (
            <span className="text-red-600">
              {formState.errors.start_date.message}
            </span>
          )}

          <label htmlFor="end_date" className="mt-4">
            End Date
          </label>
          <input
            type="date"
            {...register("end_date")}
            placeholder="End Date"
            className="p-2 rounded w-64 border-2 border-gray-400"
          />
          {formState.errors.end_date && (
            <span className="text-red-600">
              {formState.errors.end_date.message}
            </span>
          )}

          <label htmlFor="venue_city" className="mt-4">
            Venue City
          </label>
          <input
            type="text"
            {...register("venue_city")}
            placeholder="Venue City"
            className="p-2 rounded w-64 border-2 border-gray-400"
          />
          {formState.errors.venue_city && (
            <span className="text-red-600">
              {formState.errors.venue_city.message}
            </span>
          )}

          <label htmlFor="headcount" className="mt-4">
            headcount
          </label>
          <input
            type="number"
            {...register("headcount", { valueAsNumber: true })}
            placeholder="Headcount"
            className="p-2 rounded w-64 border-2 border-gray-400"
          />
          {formState.errors.headcount && (
            <span className="text-red-600">
              {formState.errors.headcount.message}
            </span>
          )}

          <label htmlFor="budget_ceiling" className="mt-4">
            Event Name
          </label>
          <input
            type="number"
            {...register("budget_ceiling", { valueAsNumber: true })}
            placeholder="Budget Ceiling"
            className="p-2 rounded w-64 border-2 border-gray-400"
          />
          {formState.errors.budget_ceiling && (
            <span className="text-red-600">
              {formState.errors.budget_ceiling.message}
            </span>
          )}
        </div>
        <button type="submit" className=" mt-10 p-2 rounded-2xl bg-blue-600">
          Create Event
        </button>
      </form>
    </div>
  );
}