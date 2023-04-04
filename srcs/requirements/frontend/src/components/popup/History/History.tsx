import React, {useState} from 'react'
import HistoryEntry from './HistoryEntry'
import UserPic from '../UserPic'
import '../Popup.css'
import './History.css'
import { historyData } from './typeHistory'
import Neon from '../Neon'

const History:React.FC = () => {
  
  // /* MUST BE FETCHED IN DATABASE*/
  const [entryData, setEntryData] = useState<historyData[]>([
    {
      id : 1,
      victory:'DEFEAT',
      mode: 'King',
      date: '06/05/2024',
      userPoints: 1,
      advPoints: 3,
      adversary: 'qBoRnE67',
      elo: -156
    },
    {
      id : 2,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 3,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 4,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 5,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 6,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 7,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 8,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 9,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
    {
      id : 10,
      victory:'VICTORY',
      mode: 'Classic',
      date: '29/03/2023',
      userPoints: 3,
      advPoints: 0,
      adversary: 'xXGottie69',
      elo: 123
    },
  ]);

  return (
    <div className='Popup'>
      <div className='Head'>
        <span className='userName'>
          <Neon text='SleleDu93' color='#bb7dd9' stroke={true}/>
          {/* SleleDu93 */}
        </span>
        <div className='headRight'>
          <UserPic />
        </div>
      </div>
      <div className='Mid'>
        {entryData.map((entry) => (<HistoryEntry entry={entry} />))}
      </div>
    </div>      
  )
}

export default History
