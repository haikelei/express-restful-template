// metrics.ts
import { Counter } from "prom-client";

export const businessErrorCounter = new Counter({
  name: "business_errors_total",
  help: "Total number of business errors",
  labelNames: ["api_name"],
});
