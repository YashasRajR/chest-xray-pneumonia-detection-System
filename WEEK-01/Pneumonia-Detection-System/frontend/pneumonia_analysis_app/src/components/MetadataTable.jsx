import { useEffect, useState } from "react";
import axios from "axios";

function MetadataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/sample-metadata")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Sample Image Metadata</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Class</th>
            <th>Filename</th>
            <th>Width</th>
            <th>Height</th>
            <th>Format</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Class}</td>
              <td>{item.Filename}</td>
              <td>{item.Width}</td>
              <td>{item.Height}</td>
              <td>{item.Format}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MetadataTable;