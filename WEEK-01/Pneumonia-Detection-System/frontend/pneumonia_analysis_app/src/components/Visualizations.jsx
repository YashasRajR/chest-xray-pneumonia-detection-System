function Visualizations() {
  return (
    <div>

      <h2>Dynamic Grid Visualization</h2>

      <img
        src="http://127.0.0.1:5000/api/dynamic-grid"
        alt="grid"
        width="100%"
      />

      <h2>Pixel Intensity Distribution</h2>

      <img
        src="http://127.0.0.1:5000/api/pixel-distribution"
        alt="pixel"
        width="100%"
      />

      <h2>Resolution Scatter Plot</h2>

      <img
        src="http://127.0.0.1:5000/api/resolution-plot"
        alt="resolution"
        width="100%"
      />

    </div>
  );
}

export default Visualizations;