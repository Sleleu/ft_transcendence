import { CSSProperties } from "styled-components";
import { User } from "../types";

interface Props {
	user: User;
  handleUserClick: (user: User, event: React.MouseEvent<HTMLSpanElement>) => void;
	key: number;
}

const WhitelistEntry:React.FC<Props> = ({user, handleUserClick}) => {

  const text: CSSProperties = {
    color:'white', fontSize: '30px', margin:'10px',
}
  return (
    <div>
      <span style={text} onClick={(event) => handleUserClick(user, event)}> {user.username} </span>
    </div>
  )
}

export default WhitelistEntry
