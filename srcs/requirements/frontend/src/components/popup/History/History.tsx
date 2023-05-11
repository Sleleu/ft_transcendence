import React, {useState, useEffect} from 'react'
import HistoryEntry from './HistoryEntry'
import { historyData } from './typeHistory'
import { CSSProperties } from 'react'


const History:React.FC = () => {

  const Container: CSSProperties = {
    
    border: '4px solid #40DEFF',
    boxShadow: '0 0 10px #40DEFF, 0 0 60px #40DEFF, inset 0 0 40px #40DEFF',

    position: 'relative',
    flexGrow: 1,
    height: '90%',
    margin: '30px',
    marginBottom: '85px',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
}

  const Entries : CSSProperties = {    
    marginTop: '5px',
    flexGrow: '1',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    
    overflowY: 'auto'
  }

  const [entryData, setEntryData] = useState<historyData[]>([]);

  const fetchHistory = async () => {
    const data = await fetch("http://localhost:5000/history" ,{ method:"GET", credentials: "include" })
    const jsonData = await data.json();
    return jsonData;
  }

  useEffect(() => {
    const getHistory = async () => {
        const HistoryFromServer = await fetchHistory()
        setEntryData(HistoryFromServer)
    }
    getHistory();
  }, [])

  return (
    <div style={Container}>
      <div style={Entries}>
        {entryData.map((entry) => (<HistoryEntry entry={entry} />))}
        </div>
      </div>
  )
}

export default History
