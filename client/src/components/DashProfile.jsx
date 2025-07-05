
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import {Link} from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
import { 
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess } from '../redux/user/userSlice';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const {currentUser,error} = useSelector(state => state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [username, setUsername] = useState(currentUser.username);

  const [showModal,setShowModal] = useState(false);
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  const handleImageChange = (e) =>{
    if (e.target.files && e.target.files[0]) {
      const file=e.target.files[0];
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  //update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError('');
    let profilePictureUrl = currentUser.profilePicture;
    console.log(profilePictureUrl);
    

    if (imageFile) {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('profilePicture', imageFile);

      try {
        const uploadResponse = await fetch(`/api/user/upload/profile-picture`, { // Your image upload API
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          profilePictureUrl = uploadData.imageUrl; // Assuming your server returns the URL
        } else {
          const errorData = await uploadResponse.json();
          setUploadError(`Image upload failed: ${errorData.message || uploadResponse.statusText}`);
          setLoading(false);
          setIsUploadingImage(false);
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadError('Error uploading profile picture.');
        setLoading(false);
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
        setUploadProgress(0);
      }
    }

    // Now update user details (including the new profilePictureUrl if uploaded)
    const userData = {
      username,
      profilePictureUrl: imageFileUrl,
    };

    try {
      const updateResponse = await fetch(`/api/user/update/${currentUser._id}`, { // Your user update API
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (updateResponse.ok) {
        console.log('User updated successfully!');
        // Optionally, redirect or show a success message
      } else {
        const errorData = await updateResponse.json();
        setUploadError(`Update failed: ${errorData.message || updateResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setUploadError('Failed to update user information.');
    } finally {
      setLoading(false);
    }
  };

  //delete user
  const handleDeleteUser=async()=>{
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  //signout user
  const handleSignout = async()=>{
    try {
      const res = await fetch('/api/user/signout',{
        method: 'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdate}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/> {/*image/* means accept any type of image */}
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
        onClick={()=>filePickerRef.current.click()}>
        {/* akhane progressbar code hobe */}   
         {isUploadingImage && (
          <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded-full'>
            <progress value={uploadProgress} max="100" />
            {/* Or a visual progress bar component */}
            <div style={{ width: 40, height: 40 }}>
              <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} />
            </div>
          </div>
        )}     
  
        <img src={imageFileUrl || currentUser.profilePicture} alt="user" className='rounded-full object-cover w-full h-full border-8 border-[lightgray]'/>
        </div>

        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleUsernameChange}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading}>
          {loading?'loading...':'Update'}
        </Button>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
              create a post
            </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>

      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

      <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
