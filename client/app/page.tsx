'use client';
import { Search, ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OptionCalculator from "./calculator"; // ✅ Already importing OptionCalculator

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <OptionCalculator /> {/* ✅ Now includes CompanyInfo inside */}
    </div>
  );
}
