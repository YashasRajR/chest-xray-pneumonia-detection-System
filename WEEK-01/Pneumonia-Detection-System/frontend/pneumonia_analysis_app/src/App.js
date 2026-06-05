import ClassDistribution from "./components/ClassDistribution";
import DatasetSummary from "./components/DatasetSummary";
import MetadataTable from "./components/MetadataTable";
import ResolutionAnalysis from "./components/ResolutionAnalysis";
import Visualizations from "./components/Visualizations";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Pneumonia Detection Dashboard</h1>

      <ClassDistribution />
      <hr />

      <DatasetSummary />
      <hr />

      <MetadataTable />
      <hr />

      <ResolutionAnalysis />
      <hr />

      <Visualizations />
    </div>
  );
}

export default App;