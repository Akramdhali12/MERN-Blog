
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { deleteUserStart,deleteUserSuccess,deleteUserFailure } from '../redux/user/userSlice';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
// import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
// import {app} from '../firebase.js'

// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const {currentUser,error} = useSelector(state => state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  // const [imageFileUploadingProgress,setImageFileUploadingProgress] = useState(null);
  // const [imageFileUploadError,setImageFileUploadError] = useState(null);
  // const [formData,setFormData] = useState({});
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
  useEffect(() => {
    if(imageFile){
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async()=>{
    console.log('uploading Image...');
    //firebase storage use
    // const storage = getStorage(app);
    // const fileName = new Date().getTime()+imageFile.name;
    // const storageRef = ref(storage,fileName);
    // const uploadTask = uploadBytesResumable(storageRef,imageFile);
    // uploadTask.on(
    //   'state_changed',
    //   (snapshot)=>{
    //     const progress = 
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
    //     setImageFileUploadingProgress(progress.toFixed(0));//tofixed(0) for no decimel value.
    //   },
    //   (error)=>{
    //     setImageFileUploadError('Could not upload image File');
    //   },
    //   ()=>{
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    //       setImageFileUrl(downloadURL);
    //     });
    //   }
    // );
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

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/> {/*image/* means accept any type of image */}
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
        onClick={()=>filePickerRef.current.click()}>
        {/* akhane progressbar code hobe */}
        <img src={imageFileUrl || currentUser.profilePicture} alt="user" className='rounded-full object-cover w-full h-full border-8 border-[lightgray]'/>
        </div>

        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
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
