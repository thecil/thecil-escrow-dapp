"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewEscrowTx = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2 - Create a new Escrow Transaction</CardTitle>
        <CardDescription className="w-48 md:w-full">
          Check your token balances or mint tokens if your empty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>form here</p>
        <Button>Create new Escrow</Button>
      </CardContent>
    </Card>
  );
};

export default NewEscrowTx;
