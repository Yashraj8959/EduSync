'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, FileText, Icon, PenBox, Route } from "lucide-react";
import Suggesstion from "@/components/Suggesstion";
import Link from 'next/link';
export default function DashboardPage({ latestImprovementTip }) {
  console.log("DashboardClientComponent received latestImprovementTip:", latestImprovementTip);

  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Learner!</h1>
        <p className="text-muted-foreground">Track your growth and continue your journey 🚀</p>
      </div>

      {/* Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Resume Builder */}
        <Card className="glass-card bg-white/5 border border-white/10 hover:border-purple-600  transition-all duration-300 flex flex-col items-center text-center p-6 rounded-2xl ">
        {/* <div className="rounded-full bg-gradient-to-br from-purple-600 to-purple-400 p-4 w-16 h-16 flex items-center justify-center mb-6">
          <Icon className="text-white" size={32} />
        </div> */}
          <CardHeader className={"flex items-center text-center gap-4 "}>
          <FileText className="h-8 w-8 text-red-500" />
            <CardTitle>Resume Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Create AI-powered resumes based on your skills.</p>
            <Link href="/resume">
            <Button className="mt-4 w-full">Start Building</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cover Letter Builder */}
        <Card className="glass-card bg-white/5 border border-white/10 hover:border-purple-600  transition-all duration-300 flex flex-col items-center text-center p-6 rounded-2xl ">
          <CardHeader className={"flex items-center text-center gap-4 "}>
          <PenBox className="h-8 w-8 text-blue-500" />
            <CardTitle>Cover Letter Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Instantly generate cover letters tailored to your jobs.</p>
            <Link href="/ai-cover-letter">
            <Button className="mt-4 w-full" >Write Cover Letter</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Industry Insights */}
        <Card className="glass-card bg-white/5 border border-white/10 hover:border-purple-600  transition-all duration-300 flex flex-col items-center text-center p-6 rounded-2xl ">
          <CardHeader className={"flex items-center text-center gap-4 "}>
          <Factory className="h-8 w-8 text-emerald-500" />
            <CardTitle>Industry Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Explore real-time career trends and skills in demand.</p>
            <Link href="/insights">
            <Button className="mt-4 w-full" >View Insights</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Roadmaps */}
        <Card className="glass-card bg-white/5 border border-white/10 hover:border-purple-600  transition-all duration-300 flex flex-col items-center text-center p-6 rounded-2xl ">
          <CardHeader className={"flex items-center text-center gap-4 "}>
          <Route className="h-8 w-8 text-amber-500" />
          <span><CardTitle>Learning Roadmaps</CardTitle></span>
            
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Follow customized roadmaps based on your goals.</p>
            <Link href="/road-map">
            <Button className="mt-4 w-full" >Explore Roadmaps</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Suggesstion tipData={latestImprovementTip} />

    </div>
  );
}
