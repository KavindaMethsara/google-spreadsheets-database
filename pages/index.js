import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [filteredData, setFilteredData] = useState([]); // Initialize with an empty array
  const [machineList, setMachineList] = useState([]); // Add machineList state
  const [isLoading, setIsLoading] = useState(true);
  const [parameterList, setParameterList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetch-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { data, headers, machineList, parameterList } = await response.json();
        setData(data);
        setHeaders(headers);
        setMachineList(machineList);
        setParameterList(parameterList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = () => {
    // Implement the logic to view the selected data here
    // You can use the selectedMachine and selectedParameter values to filter the data
    // and store it in a different variable
    // Example:
    const filteredResult = data.filter((item) => {
      return (
        (selectedMachine === '' || item['Machine'] === selectedMachine) &&
        (selectedParameter === '' || item['Parameter'] === selectedParameter)
      );
    });

    // Set the filtered data in the state
    setFilteredData(filteredResult);
  };

  return (
    <div>
      <h1>Google Sheets Data Viewer</h1>
      <div>
        <label>Select Machine:</label>
        <select
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
        >
          <option value="">All</option>
          {machineList.map((machine, index) => (
            <option key={index} value={machine}>
              {machine}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Parameter:</label>
        <select
          value={selectedParameter}
          onChange={(e) => setSelectedParameter(e.target.value)}
        >
          <option value="">All</option>
          {parameterList.map((parameter, index) => (
            <option key={index} value={parameter}>
              {parameter}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleViewClick}>View</button>
      <table>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>
                  <div dangerouslySetInnerHTML={{ __html: item[header] }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
