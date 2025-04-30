// components/Suggesstion.jsx (Client Component)

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const Suggesstion = ({ tipData }) => {

  console.log("Suggesstion component received adaptive tipData:", tipData);

  if (!tipData) {
    return (
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle>Personalized Learning Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Take a few quizzes to generate your personalized improvement plan!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Your Personalized Learning Plan</h2>

      {tipData.analysisSummary && (
        <Card className="bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-200">{tipData.analysisSummary}</p>
          </CardContent>
        </Card>
      )}

      {tipData.finalAdvice && (
        <Card className="border border-green-500">
          <CardHeader>
            <CardTitle>Your Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tipData.finalAdvice}</p>
          </CardContent>
        </Card>
      )}

      {tipData.areasForImprovement?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Focus Areas</h3>
          <div className="space-y-6">
            {tipData.areasForImprovement.map((area, idx) => (
              <Card key={idx} className="border border-cyan-500">
                <CardHeader><CardTitle>{area.concept}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{area.details}</p>
                  {area.topicsToStudy?.length > 0 && (
                    <>
                      <p className="font-medium mt-3 mb-1">Topics to Study:</p>
                      <ul className="list-disc list-inside text-sm">
                        {area.topicsToStudy.map((topic, i) => <li key={i}>{topic}</li>)}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tipData.roadmap?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Suggested Roadmap</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tipData.roadmap.map((weekData, idx) => (
              <Card key={idx} className="border border-purple-300">
                <CardHeader>
                  <CardTitle>Week {weekData?.week}: {weekData?.focus}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm">
                    {weekData?.tasks?.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tipData.practiceExercises?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Practice Exercises</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {tipData.practiceExercises.map((exercise, idx) => (
              <Card key={idx} className="">
                <CardHeader><CardTitle>{exercise?.exercise}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm">{exercise?.instructions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tipData.resources?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Recommended Resources</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {tipData.resources.map((resource, idx) => (
              <Card key={idx} className="border ">
                <CardHeader><CardTitle>{resource?.title}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{resource?.description}</p>
                  {resource?.link && (
                    <Button asChild variant="link" className="p-0 h-auto text-sm">
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">View Resource</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Suggesstion;
