import { useEffect, useState } from "react";
import axios from "axios";

function ResolutionAnalysis() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/resolution-analysis")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Resolution Analysis</h2>

      <p>Average Width: {data.AverageWidth}</p>
      <p>Average Height: {data.AverageHeight}</p>
      <p>Minimum Width: {data.MinWidth}</p>
      <p>Maximum Width: {data.MaxWidth}</p>
      <p>Minimum Height: {data.MinHeight}</p>
      <p>Maximum Height: {data.MaxHeight}</p>
    </div>
  );
}

export default ResolutionAnalysis;