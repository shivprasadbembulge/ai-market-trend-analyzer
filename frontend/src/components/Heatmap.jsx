export default function Heatmap({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3>📊 Correlation Heatmap</h3>

      <table>
        <tbody>
          {data.matrix.map((row, i) => (
            <tr key={i}>
              {row.map((val, j) => (
                <td
                  key={j}
                  style={{
                    background: `rgba(99,102,241,${Math.abs(val)})`,
                    padding: "10px",
                    color: "white",
                  }}
                >
                  {val.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
