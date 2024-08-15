import Papa, { ParseResult } from "papaparse";
import { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import "./App.css";
import UnderlineTabs from "./components/UnderlineTabs";

function App() {
  const [dataRain, setDataRain] = useState<string[][]>([]);
  const [dataTemp, setDataTemp] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const convertToISODate = (dateString: string): string => {
    if (dateString.includes("-") || dateString === "date") {
      return dateString;
    } else {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
  };

  useEffect(() => {
    const loadData = async (filePath: string): Promise<string[][]> => {
      try {
        const response = await fetch(filePath);
        const text = await response.text();

        return new Promise((resolve, reject) => {
          Papa.parse<string[]>(text, {
            header: false,
            dynamicTyping: true,
            complete: function (results: ParseResult<string[]>) {
              const cleanedData = results.data
                .filter((row) => row[0] !== null)
                .map((row) => {
                  const date = convertToISODate(String(row[0]));
                  const value = row[1];
                  return [date, value];
                });
              resolve(cleanedData);
            },
            error: function (error: any) {
              console.error("Erreur lors du parsing du CSV:", error);
            },
          });
        });
      } catch (error) {
        console.error("Erreur lors du chargement du fichier CSV:", error);
        throw error;
      }
    };

    // Load datas
    Promise.all([
      loadData("/20240730_rain-level.csv").then(setDataRain),
      loadData("/20240730_temperature.csv").then(setDataTemp),
    ]).then(() => setLoading(false));
  }, []);

  const formatChartData = (data: string[][]) => {
    return {
      labels: data.map((d) => d[0].slice(0, 4)),
      datasets: [
        {
          label: "Value",
          data: data.map((d) => d[1]),
          fill: false,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(75,192,192,1)",
          radius: 0,
        },
      ],
    };
  };

  // Prepare datas for tabs component
  const tabData = [
    { header: "Rain Level", data: formatChartData(dataRain) },
    { header: "Temperature", data: formatChartData(dataTemp) },
  ];

  return (
    <div>
      {loading ? <p>Loading data...</p> : <UnderlineTabs tabs={tabData} />}
    </div>
  );
}
export default App;
