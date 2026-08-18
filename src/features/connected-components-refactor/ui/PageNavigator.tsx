"use client";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";

type PageNavigatorProp = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

export default function PageNavigator({
  currentPage,
  totalPages,
  setCurrentPage,
}: PageNavigatorProp) {
  const decrementCurrentPage = () => {
    setCurrentPage((prev: number) => prev - 1);
  };

  const incrementCurrentPage = () => {
    setCurrentPage((prev: number) => prev + 1);
  };
  return (
    <div>
      <div>
        Showing page {String(currentPage)} of {String(totalPages)}
      </div>
      <button onClick={decrementCurrentPage}>
        <ChevronLeft></ChevronLeft>
      </button>
      <button onClick={incrementCurrentPage}>
        <ChevronRight></ChevronRight>
      </button>
    </div>
  );
}
