import { useEffect, useState } from "react";
import axios from "axios";

function DatasetSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/dataset-summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Dataset Summary</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Split</th>
            <th>Class</th>
            <th>Count</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Split}</td>
              <td>{item.Class}</td>
              <td>{item.Count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetSummary;