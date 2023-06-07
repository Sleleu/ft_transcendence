import React, { ChangeEvent, useRef, useState } from 'react';
import './Login.css';
import { User } from '../types';
import AvatarEditor from 'react-avatar-editor';
import { updateAvatar } from '../Api';

interface SelectLoginProps {
  user: User;
  onAvatarSelected: () => void; 
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

const SelectAvatar: React.FC<SelectLoginProps> = ({user, onAvatarSelected}) => {
	const [isDefaultAvatar, setIsDefaultAvatar] = useState<boolean>(false);
	const editorRef = useRef<AvatarEditor | null>(null);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [isAvatarUpdated, setIsAvatarUpdated] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const initialState: State = {
	  image: '',
	  allowZoomOut: false,
	  position: { x: 0.5, y: 0.5 },
	  scale: 1,
	  rotate: 0,
	  borderRadius: 50,
	  preview: null,
	  width: 100,
	  height: 100,
	}
	const [state, setState] = useState<State>(initialState);

  const handleScale = (event: ChangeEvent<HTMLInputElement>) => {
		const scale = parseFloat(event.target.value);
		setState({ ...state, scale });
    resetMessages();
    setIsAvatarUpdated(true);
	  };
	
	  const handlePositionChange = (position: Position) => {
		setState({ ...state, position });
    resetMessages();
    setIsAvatarUpdated(true);
	  };

    const resetMessages = () => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }

    const handleNewImage = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
  
        if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file.');
        return;
        }
  
        const imageUrl = URL.createObjectURL(file);
        setState({ ...state, image: imageUrl });
        setIsDefaultAvatar(false);
        setIsAvatarUpdated(true);
        resetMessages();
      }
      };  

      const handleSubmit = async () => {
        setIsSubmitted(true); 
        if (isDefaultAvatar) {
          return;
        }
        if (!isAvatarUpdated) {
          resetMessages();
          setErrorMessage('Avatar already updated !');
          return ;
        }
        if (editorRef.current) {
          const img = editorRef.current.getImageScaledToCanvas().toDataURL();
    
          fetch(img)
          .then(res => res.blob())
          .then(async (blob) => {
            const file = new File([blob], "user_avatar.png", { type: "image/png" });
            try {
            await updateAvatar(file);
            setIsAvatarUpdated(false);
            setSuccessMessage('Avatar updated successfully !');
            onAvatarSelected();
            } catch (err) {
            if (err instanceof Error)
              setErrorMessage(err.message);
            }
          })
        }
        };

  return (
    <div className="baground">
      <div className='containerFullPage'>
        <div className='container'>
          <div className='selectAvatar-container'>
            <h4>You can set your 42 profile image as avatar</h4>
            <img className='avatar-login' src={user.avatar} />
            <h4>Or upload a new avatar</h4>
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
            <label className="btn-little text bold medium cyan-stroke">
                  <input
                    name="upload-img-input"
                    type="file"
                    onChange={handleNewImage}
                    className="hide-input"
                  />
                  Upload Avatar
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
              <button className='button' onClick={handleSubmit}>Submit avatar</button>
              {isSubmitted && isDefaultAvatar && (
              <p className="text bold neon-red">This is your current avatar</p>)}
  		        {errorMessage && <p className="text bold neon-red">{errorMessage}</p>}
		          {successMessage && <p className="text bold neon-green">{successMessage}</p>}
              <button className='button' type="submit">Skip this step</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectAvatar;
