import { useEffect, useState } from "react";
import axios from "axios";

function ClassDistribution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/class-distribution")
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <div>
      <h2>Class Distribution</h2>

      {data.map((item, index) => (
        <p key={index}>
          {item.Class}: {item.Count}
        </p>
      ))}
    </div>
  );
}

export default ClassDistribution;