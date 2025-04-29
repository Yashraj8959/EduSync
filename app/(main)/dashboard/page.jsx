
import Dashboard from "./_components/Dashboard";
import { generateAdaptiveSuggestion } from "@/actions/generateAdaptiveSuggestion";

const DashboardPage = async () => {
    const adaptiveTip = await generateAdaptiveSuggestion();
    console.log("page.jsx - fetched adaptiveTip:", adaptiveTip);

    return (<>
        <div className="w-full grid-background"></div>
        {/* <Dashboard insights={insights} assessments={assessments} /> */}
        <Dashboard latestImprovementTip={adaptiveTip} />
        </>

    );
};

export default DashboardPage;