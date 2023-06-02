import React, {useState, useRef, ChangeEvent} from "react";
import { User } from "../types";
import AvatarEditor from 'react-avatar-editor'
import './Settings.css'

interface SettingsAvatarProps {
	user: User;
}

interface Position {
	x: number;
	y: number;
  }
  
  interface State {
	image: string | File;
	allowZoomOut: boolean;
	position: Position;
	scale: number;
	rotate: number;
	borderRadius: number;
	preview: null | string;
	width: number;
	height: number;
  }

const SettingsAvatar = ({user}: SettingsAvatarProps) => {

	const currentAvatarUrl = user.avatar || ''; 
  
	const initialState: State = {
	  image: currentAvatarUrl,
	  allowZoomOut: false,
	  position: { x: 0.5, y: 0.5 },
	  scale: 1,
	  rotate: 0,
	  borderRadius: 50,
	  preview: null,
	  width: 130,
	  height: 130,
	};
  
	const [state, setState] = useState<State>(initialState);
	const editorRef = useRef<AvatarEditor | null>(null);
  
	const handleNewImage = (event: ChangeEvent<HTMLInputElement>) => {
	  if (event.target.files && event.target.files.length > 0) {
		setState({ ...state, image: event.target.files[0] });
	  }
	}

	  const handleScale = (event: ChangeEvent<HTMLInputElement>) => {
		const scale = parseFloat(event.target.value);
		setState({ ...state, scale });
	  };
	
	  const handlePositionChange = (position: Position) => {
		setState({ ...state, position });
	  };
	
	  const handleSubmit = async () => {
		if (editorRef.current) {
		  const img = editorRef.current.getImageScaledToCanvas().toDataURL();
		  setState({ ...state, image: img });
		}
	  };
	
	  return (
		<>
		 <div>
		   <AvatarEditor
			 ref={editorRef}
			 scale={parseFloat(state.scale.toString())}
			 width={state.width}
			 height={state.height}
			 position={state.position}
			 onPositionChange={handlePositionChange}
			 rotate={parseFloat(state.rotate.toString())}
			 borderRadius={state.width / (100 / state.borderRadius)}
			 image={typeof state.image === 'string' ? state.image : URL.createObjectURL(state.image)}
			 color={[255, 255, 255, 0.5]}
			 className="editor-canvas"
		   />
		 </div>
		 <label className="btn-little text bold medium cyan-stroke">
			<input
				name="upload-img-input"
				type="file"
				onChange={handleNewImage}
				className="hide-input"
			/>
			Change Avatar
			</label>
		 <input
	       className="neon-range"
		   name="scale"
		   type="range"
		   onChange={handleScale}
		   min={state.allowZoomOut ? "0.1" : "1"}
		   max="2"
		   step="0.01"
		   defaultValue="1"
		 />
		 <div>
		   <button className="button" onClick={handleSubmit}>
			 SUBMIT
		   </button>
		 </div>
	   </>
	 )
}

export default SettingsAvatar;