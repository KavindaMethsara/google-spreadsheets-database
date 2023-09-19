import React, { useEffect, useState } from "react"

export default function Home() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [selectedMachine, setSelectedMachine] = useState("")
  const [selectedParameter, setSelectedParameter] = useState("")
  const [filteredData, setFilteredData] = useState([]) // Initialize with an empty array
  const [machineList, setMachineList] = useState([]) // Add machineList state
  const [isLoading, setIsLoading] = useState(true)
  const [parameterList, setParameterList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fetch-data")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const { data, headers, machineList, parameterList } =
          await response.json()
        setData(data)
        setHeaders(headers)
        setMachineList(machineList)
        setParameterList(parameterList)
        setIsLoading(false)
      } catch (error) {
        console.error("Error:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewClick = () => {
    // console.log(data)
    // Implement the logic to view the selected data here
    // You can use the selectedMachine and selectedParameter values to filter the data
    // and store it in a different variable
    // Example:
    // const filteredResult = data.filter((item) => {
    //   return (
    //     (selectedMachine === "" || item["Machine"] === selectedMachine) &&
    //     (selectedParameter === "" || item["Parameter"] === selectedParameter)
    //   )
    // })
    const filteredResult = data.filter((item) => {
      if (selectedMachine === "all") return data
      return item.includes(selectedMachine) || item.includes(selectedParameter)
    })

    // Set the filtered data in the state
    setFilteredData(filteredResult)
    // console.log(filteredResult)
  }

  return (
    <div>
      <h1>Google Sheets Data Viewer</h1>
      <div>
        <label>Select Machine:</label>
        <select
          value={selectedMachine}
          onChange={(e) => {
            // console.log(selectedMachine)
            setSelectedMachine(e.target.value)
          }}
        >
          <option value="all">All</option>
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
      <table
        border={"1"}
        style={{ borderCollapse: "collapse", marginTop: 20 }}
        cellPadding={"10"}
      >
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {item.map((header) => (
                <td key={header}>
                  <div>{header}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
