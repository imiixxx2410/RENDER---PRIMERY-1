"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="mb-2 text-center text-3xl font-semibold">Pricing</h1>
        <p className="mb-12 text-center text-text-secondary">
          Choose the plan that fits your workflow.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlighted ? "border-accent" : undefined}
            >
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold">
                ${plan.price}
                <span className="text-base font-normal text-text-secondary">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              {session ? (
                <Button
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  onClick={() =>
                    alert("Stripe checkout not connected yet — coming soon.")
                  }
                >
                  Subscribe
                </Button>
              ) : (
                <Link href="/signup" className="mt-6 block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "primary" : "secondary"}
                  >
                    Get started
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
