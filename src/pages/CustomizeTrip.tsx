import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/components/ui/use-toast";
import { Wand2 } from "lucide-react";

const diveActivities = [
  { id: "photography", label: "Underwater Photography" },
  { id: "tech", label: "Technical Diving" },
  { id: "freediving", label: "Freediving" },
  { id: "mermaid", label: "Mermaid Diving" },
  { id: "boat", label: "Boat Dives" },
  { id: "leisure", label: "Leisure Dives" },
];

const marineLifeWishlist = [
  { id: "sharks", label: "Sharks" },
  { id: "turtles", label: "Turtles" },
  { id: "whales", label: "Whales" },
  { id: "clownfish", label: "Clownfish (Nemo)" },
  { id: "octopus", label: "Octopus" },
  { id: "manta", label: "Manta Rays" },
];

const formSchema = z.object({
  schedule: z
    .object({
      from: z.date({
        required_error: "Please select a start date.",
        invalid_type_error: "Invalid date.",
      }),
      to: z.date().optional(),
    })
    .optional(),
  budget: z.array(z.number()).default([1500]),
  diveActivities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one activity.",
  }),
  certification: z.string({ required_error: "Please select your certification level." }),
  marineLife: z.array(z.string()).optional(),
  diveEnvironment: z.enum(["reef", "wreck", "shore", "drift", "night"], {
    required_error: "You need to select a dive environment.",
  }),
  accommodation: z.enum(["hostel", "budget", "mid-range", "luxury"], {
    required_error: "You need to select an accommodation type.",
  }),
  notes: z.string().optional(),
});

const CustomizeTrip = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule: undefined, // Always undefined so DateRangePicker gets 'undefined' or a {from: Date}
      diveActivities: ["leisure"],
      marineLife: [],
      budget: [1500],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Generating Your Dream Dive Trip... ✨",
      description:
        "Our AI is analyzing your preferences. This is a simulation, but soon it will create a real itinerary!",
    });
  }

  return (
    <div className="w-full bg-ocean-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Craft Your Perfect <span className="text-ocean-300">Dive Adventure</span>
          </h1>
          <p className="text-xl text-ocean-100 max-w-3xl mx-auto">
            Tell us your preferences, and our AI-powered planner will design a personalized diving itinerary just for you.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Trip Details */}
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle>Trip Details</CardTitle>
                    <CardDescription>
                      When are you going and what's your budget?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="schedule"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dive Schedule</FormLabel>
                          <DateRangePicker
                            date={
                              field.value && field.value.from
                                ? field.value as { from: Date; to?: Date }
                                : undefined
                            }
                            onSelect={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Budget (per person, in USD)</FormLabel>
                          <FormControl>
                            <div>
                              <Slider
                                min={100}
                                max={10000}
                                step={100}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="my-4"
                              />
                              <div className="text-center font-bold text-ocean-300 text-lg">
                                ${field.value?.[0] || 1500}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Diving Preferences */}
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle>Diving Preferences</CardTitle>
                    <CardDescription>What kind of diving are you interested in?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="diveActivities"
                      render={() => (
                        <FormItem>
                          <FormLabel>Diving Activities</FormLabel>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            {diveActivities.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="diveActivities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="diveEnvironment"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Preferred Dive Environment</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="reef" /></FormControl>
                                  <FormLabel className="font-normal">Reef Dive</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="wreck" /></FormControl>
                                  <FormLabel className="font-normal">Wreck Dive</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="shore" /></FormControl>
                                  <FormLabel className="font-normal">Shore Dive</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="drift" /></FormControl>
                                  <FormLabel className="font-normal">Drift Dive</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl><RadioGroupItem value="night" /></FormControl>
                                  <FormLabel className="font-normal">Night Dive</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                 <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle>Your Experience</CardTitle>
                    <CardDescription>What's your current certification level?</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <FormField
                          control={form.control}
                          name="certification"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your certification" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">No Certification</SelectItem>
                                  <SelectItem value="open-water">Open Water Diver</SelectItem>
                                  <SelectItem value="advanced-open-water">Advanced Open Water Diver</SelectItem>
                                  <SelectItem value="rescue-diver">Rescue Diver</SelectItem>
                                  <SelectItem value="divemaster">Divemaster</SelectItem>
                                  <SelectItem value="instructor">Instructor</SelectItem>
                                  <SelectItem value="tech-diver">Technical Diver</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                  </CardContent>
                </Card>
                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                    <CardTitle>Underwater Wishlist</CardTitle>
                    <CardDescription>What marine life are you hoping to see?</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <FormField
                      control={form.control}
                      name="marineLife"
                      render={() => (
                        <FormItem>
                           <div className="space-y-2">
                            {marineLifeWishlist.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="marineLife"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-ocean-800 border-ocean-700">
                  <CardHeader>
                      <CardTitle>Accommodation</CardTitle>
                      <CardDescription>Where do you want to stay?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="accommodation"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="hostel" /></FormControl>
                                <FormLabel className="font-normal">Bunk Bed (Hostel)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="budget" /></FormControl>
                                <FormLabel className="font-normal">Private Room (Budget)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="mid-range" /></FormControl>
                                <FormLabel className="font-normal">Mid-range Hotel</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="luxury" /></FormControl>
                                <FormLabel className="font-normal">Luxury Resort</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-ocean-800 border-ocean-700">
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Anything else we should know?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I'm a vegetarian, I'm travelling with a non-diver, I prefer small group sizes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-105 transition-transform">
                <Wand2 className="mr-2 h-5 w-5" />
                Generate My Dive Trip
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomizeTrip;
