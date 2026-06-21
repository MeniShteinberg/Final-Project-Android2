"use client";

import React from "react";
import PostStatsChart from '../../../pages/PostStatsChart.js';
import { useRouter } from "next/navigation";

export default function StatsPage() {
    const router = useRouter();

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: "url('/images/backclean.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "2rem"
            }}
        >
            <div className="max-w-4xl mx-auto px-6 py-10 bg-white bg-opacity-90 rounded-lg shadow-lg">
                <PostStatsChart />
                <div className="mt-10 text-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                        onClick={() => router.push("/admin")}
                    >
                        Back to control panel
                    </button>
                </div>
            </div>
        </div>
    );
}
