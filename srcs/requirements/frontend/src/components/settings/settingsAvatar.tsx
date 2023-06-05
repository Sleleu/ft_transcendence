import React, {useState, useRef, ChangeEvent} from "react";
import { User } from "../types";
import AvatarEditor from 'react-avatar-editor'
import './Settings.css'
import { updateAvatar } from "../Api";

interface SettingsAvatarProps {
	user: User;
}

interface Position {
	x: number;
	y: number;
  }
  
  interface State {
	image: string;
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
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [isDefaultAvatar, setIsDefaultAvatar] = useState<boolean>(currentAvatarUrl === user.avatar);
	const [isAvatarUpdated, setIsAvatarUpdated] = useState<boolean>(false);

	const initialState: State = {
	  image: currentAvatarUrl,
	  allowZoomOut: false,
	  position: { x: 0.5, y: 0.5 },
	  scale: 1,
	  rotate: 0,
	  borderRadius: 50,
	  preview: null,
	  width: 100,
	  height: 100,
	};
  
	const [state, setState] = useState<State>(initialState);
	const editorRef = useRef<AvatarEditor | null>(null);
  
	const handleNewImage = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
		  const file = event.target.files[0];
		  const imageUrl = URL.createObjectURL(file);
		  setState({ ...state, image: imageUrl });
		  setIsDefaultAvatar(false);
		}
	  };  

	  const handleScale = (event: ChangeEvent<HTMLInputElement>) => {
		const scale = parseFloat(event.target.value);
		setState({ ...state, scale });
	  };
	
	  const handlePositionChange = (position: Position) => {
		setState({ ...state, position });
	  };

	  const handleSubmit = async () => {
		setIsSubmitted(true); 
		if (isDefaultAvatar) {
		  return;
		}
		if (editorRef.current) {
		  const img = editorRef.current.getImageScaledToCanvas().toDataURL();

		  fetch(img)
			.then(res => res.blob())
			.then(async (blob) => {
			  const file = new File([blob], "user_avatar.png", { type: "image/png" });
			  try {
				await updateAvatar(file);
				setIsAvatarUpdated(true);
			  } catch (err) {
				console.error(err);
				alert('Failed to update avatar.');
			  }
			})
		}
	  };  	  
	
	  return (
		<>
		 <div>
		   <AvatarEditor
			 ref={editorRef}
			 scale={state.scale}
			 width={state.width}
			 height={state.height}
			 position={state.position}
			 onPositionChange={handlePositionChange}
			 rotate={parseFloat(state.rotate.toString())}
			 borderRadius={state.width / (100 / state.borderRadius)}
			 image={state.image}
			 color={[255, 255, 255, 0.3]}
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
		 {isSubmitted && isDefaultAvatar && (
        <p className="text bold neon-red">This is your current avatar</p>)}
		{isAvatarUpdated && <p className="text bold neon-green">Avatar updated successfully !</p>}
	   </>
	 )
}

export default SettingsAvatar;