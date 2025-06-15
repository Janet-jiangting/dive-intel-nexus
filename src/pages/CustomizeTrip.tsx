
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const certifications = [
  { value: "none", label: "No Certification" },
  { value: "open-water", label: "Open Water Diver" },
  { value: "advanced", label: "Advanced Open Water" },
  { value: "rescue", label: "Rescue Diver" },
  { value: "divemaster", label: "Divemaster" },
  { value: "instructor", label: "Instructor" },
  { value: "tech", label: "Technical Diver" },
];

const diveTypes = [
  { value: "leisure", label: "Leisure" },
  { value: "wreck", label: "Wreck" },
  { value: "reef", label: "Reef" },
  { value: "drift", label: "Drift" },
  { value: "night", label: "Night" },
];

const defaultPlan = {
  startDate: "",
  endDate: "",
  budget: "",
  certification: "none",
  diveType: "leisure",
  notes: "",
};

const CustomizeTrip = () => {
  const [form, setForm] = useState({ ...defaultPlan });
  const [trip, setTrip] = useState<typeof defaultPlan | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip(form);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-ocean-900 py-10 px-4">
      <div className="w-full max-w-5xl bg-ocean-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-center gap-8 text-white">
        <div className="md:w-1/2 w-full flex flex-col items-start md:items-start">
          <h1 className="mb-2 text-3xl md:text-4xl font-bold">Plan Your Dive Trip</h1>
          <p className="mb-4 text-ocean-100">(Just a few fields to get you started)</p>
        </div>
        <div className="md:w-1/2 w-full">
          <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
            <div>
              <label htmlFor="startDate" className="block font-semibold mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="w-full rounded-md px-3 py-2 text-black"
                value={form.startDate}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block font-semibold mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="w-full rounded-md px-3 py-2 text-black"
                value={form.endDate}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="budget" className="block font-semibold mb-1">
                Budget (USD)
              </label>
              <input
                type="number"
                min={100}
                max={10000}
                step={10}
                id="budget"
                name="budget"
                placeholder="1500"
                required
                className="w-full rounded-md px-3 py-2 text-black"
                value={form.budget}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="certification" className="block font-semibold mb-1">
                Certification Level
              </label>
              <select
                id="certification"
                name="certification"
                required
                value={form.certification}
                onChange={onChange}
                className="w-full rounded-md px-3 py-2 text-black"
              >
                {certifications.map((c) => (
                  <option value={c.value} key={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="diveType" className="block font-semibold mb-1">
                Dive Type
              </label>
              <select
                id="diveType"
                name="diveType"
                required
                value={form.diveType}
                onChange={onChange}
                className="w-full rounded-md px-3 py-2 text-black"
              >
                {diveTypes.map((d) => (
                  <option value={d.value} key={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block font-semibold mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full rounded-md px-3 py-2 text-black resize-none"
                placeholder="Any dietary restrictions? Travelling with non-divers? Write here."
                value={form.notes}
                onChange={onChange}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-cyan-600 hover:to-emerald-600 transition-all">
              Generate My Trip Plan
            </Button>
          </form>
          {trip && (
            <div className="mt-8 bg-ocean-900 rounded-md p-5 animate-fade-in">
              <h2 className="text-2xl font-bold mb-3 text-ocean-100 text-center">Your Trip Plan</h2>
              <ul className="space-y-2 text-ocean-200">
                <li>
                  <span className="font-bold">Dates:</span>{" "}
                  {trip.startDate} to {trip.endDate}
                </li>
                <li>
                  <span className="font-bold">Budget:</span> ${trip.budget}
                </li>
                <li>
                  <span className="font-bold">Certification:</span>{" "}
                  {certifications.find((c) => c.value === trip.certification)?.label}
                </li>
                <li>
                  <span className="font-bold">Dive Type:</span>{" "}
                  {diveTypes.find((d) => d.value === trip.diveType)?.label}
                </li>
                {trip.notes && (
                  <li>
                    <span className="font-bold">Notes:</span> {trip.notes}
                  </li>
                )}
              </ul>
              <div className="mt-5 text-center text-xs text-ocean-300">
                (This is a preview — AI-generated itineraries coming soon!)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeTrip;
