import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  ChevronRight,
  RefreshCw,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";
import { calculateInvestment } from "@/lib/calculator";
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "@/components/PdfDocument";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Form validation schema
const formSchema = z.object({
  monthlyInvestment: z
    .string()
    .min(1, "Monthly investment is required")
    .regex(/^\d+$/, "Must be a valid number")
    .transform((val) => parseInt(val)),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+$/, "Must be a valid number")
    .transform((val) => parseInt(val)),
  returnRate: z
    .string()
    .min(1, "Return rate is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .transform((val) => parseFloat(val)),
  inflationRate: z
    .string()
    .min(1, "Inflation rate is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .transform((val) => parseFloat(val)),
});

type FormValues = z.infer<typeof formSchema>;

interface Scenario {
  id: string;
  name: string;
  monthlyInvestment: number;
  duration: number;
  returnRate: number;
  inflationRate: number;
  results: {
    investedAmount: number;
    totalWealth: number;
    totalWealthReal: number;
    totalEarnings: number;
    totalEarningsReal: number;
    yearlyData: Array<{
      year: number;
      investment: number;
      wealth: number;
      earnings: number;
    }>;
  };
}

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyInvestment: "15000",
      duration: "15",
      returnRate: "15",
      inflationRate: "9",
    },
  });

  function onSubmit(data: FormValues) {
    const calculated = calculateInvestment({
      monthlyInvestment: data.monthlyInvestment,
      years: data.duration,
      returnRate: data.returnRate,
      inflationRate: data.inflationRate,
    });

    const newScenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Scenario ${scenarios.length + 1}`,
      monthlyInvestment: data.monthlyInvestment,
      duration: data.duration,
      returnRate: data.returnRate,
      inflationRate: data.inflationRate,
      results: calculated,
    };

    setScenarios([...scenarios, newScenario]);
  }

  function resetForm() {
    form.reset();
    setScenarios([]);
  }

  function removeScenario(id: string) {
    setScenarios(scenarios.filter((s) => s.id !== id));
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      // 1 crore
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      // 1 lakh
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Generate random colors for scenarios
  const colors = [
    "#1e40af",
    "#15803d",
    "#047857",
    "#b91c1c",
    "#c2410c",
    "#a16207",
    "#854d0e",
    "#0f766e",
    "#0369a1",
    "#7e22ce",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              <CardTitle>15 x 15 x 15 Investment Calculator</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="monthlyInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Investment (₹)</FormLabel>
                      <FormControl>
                        <Input placeholder="15000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Duration (Years)</FormLabel>
                      <FormControl>
                        <Input placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Return Rate (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField  
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Scenario
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </form>
            </Form>

            {scenarios.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Scenarios Comparison
                    </h3>
                    <div className="pdf-download">
                      <PDFDownloadLink
                        document={
                          <PdfDocument
                            monthlyInvestment={parseInt(
                              form.getValues("monthlyInvestment")
                            )}
                            duration={parseInt(form.getValues("duration"))}
                            returnRate={parseFloat(
                              form.getValues("returnRate")
                            )}
                            inflationRate={parseFloat(
                              form.getValues("inflationRate")
                            )}
                            investedAmount={
                              scenarios[scenarios.length - 1].results
                                .investedAmount
                            }
                            totalWealth={
                              scenarios[scenarios.length - 1].results
                                .totalWealth
                            }
                            totalEarnings={
                              scenarios[scenarios.length - 1].results
                                .totalEarnings
                            }
                            totalWealthReal={
                              scenarios[scenarios.length - 1].results
                                .totalWealthReal
                            }
                            totalEarningsReal={
                              scenarios[scenarios.length - 1].results
                                .totalEarningsReal
                            }
                          />
                        }
                        fileName="investment-calculation.pdf"
                        className="inline-block"
                      >
                        {({ loading }) => (
                          <Button variant="outline" disabled={loading}>
                            <FileDown className="mr-2 h-4 w-4" />
                            {loading ? "Generating PDF..." : "Export PDF"}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {scenarios.map((scenario, index) => (
                      <Card key={scenario.id} className="bg-white">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-primary">
                              {scenario.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeScenario(scenario.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Monthly Investment
                              </p>
                              <p className="font-semibold">
                                {formatCurrency(scenario.monthlyInvestment)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-semibold">
                                {scenario.duration} years
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Return Rate
                              </p>
                              <p className="font-semibold">
                                {scenario.returnRate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Inflation Rate
                              </p>
                              <p className="font-semibold">
                                {scenario.inflationRate}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Wealth
                              </p>
                              <p className="font-semibold text-green-700">
                                {formatCurrency(scenario.results.totalWealth)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Wealth (Real)
                              </p>
                              <p className="font-semibold text-green-700">
                                {formatCurrency(
                                  scenario.results.totalWealthReal
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Earnings (Real)
                              </p>
                              <p className="font-semibold text-green-700">
                                {formatCurrency(
                                  scenario.results.totalEarningsReal
                                )}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="mt-6">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-semibold mb-4">
                        Wealth Growth Comparison
                      </h4>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="year"
                              allowDuplicatedCategory={false}
                            />
                            <YAxis
                              tickFormatter={(value) => {
                                if (value >= 10000000)
                                  return `${(value / 10000000).toFixed(1)}Cr`;
                                if (value >= 100000)
                                  return `${(value / 100000).toFixed(1)}L`;
                                return value;
                              }}
                            />
                            <Tooltip
                              formatter={(value: number) => [
                                formatCurrency(value),
                                "",
                              ]}
                              labelFormatter={(year) => `Year ${year}`}
                            />
                            <Legend />
                            {scenarios.map((scenario, index) => (
                              <Line
                                key={scenario.id}
                                data={scenario.results.yearlyData}
                                type="monotone"
                                dataKey="wealth"
                                name={scenario.name}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
