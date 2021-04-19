import {React, useState, useEffect}  from 'react'
import './App.css';
import firebaseApp from './firebase'
import { fetchAllUsers, addUser } from './app/api'

const App = () => {

  //For API Form
  const initialUser = {
    name: '',
    image: null,
    report: null
  }
  const [apiUser, setApiUser] = useState(initialUser)
  const [apiUsers, setApiUsers] = useState([])
  const [apiNameError, setApiNameError] = useState('')
  const [apiImageError, setApiImageError] = useState('')
  const [apiReportError, setApiReportError] = useState('')
  
  //For Image Form
  const [username, setUsername] = useState('')
  const [image, setImage] = useState(null)
  const [users, setUsers] = useState([])
  const [fileError, setFileError] = useState(false)
  const [fileErrorMessage, setFileErrorMessage] = useState('sample')
  const [usernameError, setUsernameError] = useState(false)
  const [usernameErrorMessage, setusernameErrorMessage] = useState('error message')

  //For Document Form
  const [doc, setDoc] = useState(null)
  const [docsList, setDocsList] = useState([])
  const [docError, setDocError] = useState(false)
  const [docErrorMessage, setDocErrorMessage] = useState('')

  //For Image And Document Forms Storage
  const [uploadProgress, setUploadProgress] = useState(0)
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();

  //For Image Form Functions
  const handleFileChanges = (e) => {
    setImage(e.target.files[0])
    setFileError(false)
  }

  const handleNameChanges = (e) => {
    setUsername(e.target.value)
    setUsernameError(false)
  }

  const validateImageForm = (e) => {
    e.preventDefault();
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!image) {
      setFileError(true);
      setFileErrorMessage('Image Cannot Be Blank!')
      return false;
    }
    else if (!username) {
      setUsernameError(true);
      setusernameErrorMessage('Username Cannot Be Blank!');
      return false;
    }
    else if (!allowedExtensions.exec(image.name)) {
      setFileError(true)
      setFileErrorMessage('Unsupported File Extension!')
      return false;
    }
    else {
      return true;
    }

  }

  const sendImage = (e) => {
    e.preventDefault();
    const isDataValid = validateImageForm(e);
    
    if (isDataValid) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on('state_changed',
        (snapshot) => {
          var progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress)
        },
        (error) => {
          console.log('Error Uploading A File: ' + error)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
              db.collection("users").doc(username).set({
                name: username,
                avatar: downloadURL
              })
              setImage(null)
              setUsername('')
              document.getElementById('imageForm').reset();
            });
        }
      );
    }
    else {
      console.log('Image Form Is Not Valid')
    }
  }
  //Image Form Functions Ends Up Here
  
  //For Document Form Functions
  const handleDocChanges = (e) => {
    setDoc(e.target.files[0]);
    setDocError(false);
  }

  const validateDocForm = (e) => {
    e.preventDefault();
    const allowedDocFormats = /(\.pdf)$/i;

    if (!doc) {
      setDocError(true);
      setDocErrorMessage('Doc Cannot Be Blank!');
      return false;
    }
    else if (!allowedDocFormats.exec(doc.name)) {
      setDocError(true);
      setDocErrorMessage('Unsupported Document Type!');
      return false;
    }
    else {
      return true;
    }
  }

  const sendDocument = (e) => {
    e.preventDefault();
    const isDocValid = validateDocForm(e);

    if (isDocValid) {
      const uploadDoc = storage.ref(`docx/${doc.name}`).put(doc);
      uploadDoc.on('state_changed',
        (snapshot) => { },
        (error) => {
          console.log('Error Uploading A Document: ' + error)
        },
        () => {
          uploadDoc.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
              db.collection("MyDocx").doc(doc.name).set({
                name: doc.name,
                url: downloadURL
              })
              setDoc(null)
              console.log('Collection Updated')
              document.getElementById('docForm').reset();
            });
        }
      );
     }
    else {
      console.log('Doc Form Is Not Valid')
    }
  }
  //Document Form Functions Ends Up Here
  
  
  //Functions For API Module
  const handleApiForm = (e) => {
    // console.log('API Form Has Changed')
    if (e.target.name === 'name') {
      setApiUser({ ...apiUser, name: e.target.value })
      setApiNameError('')
    }
    else if (e.target.name === 'image') {
      setApiUser({ ...apiUser, image: e.target.files[0] })
      setApiImageError('')
    }
    else if (e.target.name === 'report') {
      setApiUser({ ...apiUser, report: e.target.files[0] })
      setApiReportError('')
    }
    else {
      console.log('Nothing Has Changed In  Api Form')
    }
  }

  const validateApiForm = (e) => {
    e.preventDefault();
    const allowedDocFormats = /(\.pdf)$/i;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!apiUser.name) {
      setApiNameError('Name Cannot Be Blank!')
      return false;
    }
    else if (!apiUser.image) {
      setApiImageError('Image Cannot Be Blank!')
      return false;
    }
    else if (!apiUser.report) {
      setApiReportError('Report Cannot Be Blank!')
      return false;
    }
    else if (!allowedExtensions.exec(apiUser.image.name)) {
      setApiImageError('UnSupported File Extension!')
      return false;
    }
    else if (!allowedDocFormats.exec(apiUser.report.name)) {
      setApiReportError('UnSupported Document Type!')
      return false;
    }
    else { return true;}
  }
  
  const sendApiData = async (e) => {
    e.preventDefault();
    const isApiUserValid = validateApiForm(e);
    
    if (isApiUserValid) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' } }
      console.log(apiUser)
      const formdata = new FormData();
      formdata.append('name', apiUser.name)
      formdata.append('image', apiUser.image)
      formdata.append('report', apiUser.report)
      try {
        const response = await addUser(formdata, config)
        console.log(response)
        document.getElementById('apiForm').reset();
        setApiUser(initialUser)
        // setApiUsers(response)
      } catch (err) { console.log('Error Adding User: ' + err)}
    }
    else {
      console.log('API Form Is Invalid')
    }
  }

  //Fetch Data For API Module
  const fetchApiData = async () => {
    try {
      const response = await fetchAllUsers()
      setApiUsers(response)
    } catch (err) { console.log('Error Fetching Users: ' + err)}
  }

  //Fetch data For Image Module
  const fetchUsers =  () => {
    const usersCollection = db.collection("users")
    usersCollection.onSnapshot((snapshot) => (
      setUsers(snapshot.docs.map((doc) => doc.data()))
    ))
  }
  
  //Fetch Data For Document Module
  const fetchDocuments =  () => {
    const docsCollection = db.collection("MyDocx")
    docsCollection.onSnapshot((snapshot) => (  
      setDocsList(snapshot.docs.map((doc) => doc.data()))
    ))
  }

  useEffect(() => {
    fetchUsers();
    fetchDocuments();
    fetchApiData();
  }, [])



    return (
      <div className="app">
        <div className="form-card">
          <form className="form-element" onSubmit={sendImage} id="imageForm">
            <h1>Image Form</h1>
            <input type="file" onChange={handleFileChanges} accept="image/*" />
            <span className="error-span">{fileError ? fileErrorMessage : ''} </span>
            <input
              name="username"
              type="text"
              value={username}
              placeholder="Name"
              className="name-input"
              onChange={handleNameChanges} />
              <span className="error-span">{usernameError ? usernameErrorMessage : ''} </span>
            <button type="submit">Submit</button>
          </form>

          <div className="forms-margin"></div>

          <form className="form-element" onSubmit={sendDocument} id="docForm">
            <h1>Document Form</h1>
            <input type="file" onChange={handleDocChanges} accept="application/pdf"  />
            <span className="error-span">{docError ? docErrorMessage : ''} </span>
            <button type="submit">Submit</button>
          </form>

          <div className="forms-margin"></div>

          <form className="form-element"
            onSubmit={sendApiData}
            id="apiForm"
            enctype="multipart/form-data">
            <h1>API Form</h1>
            <b>Username:</b>
            <input
              name="name"
              type="text"
              value={apiUser.name}
              placeholder="Name"
              className="name-input"
              onChange={handleApiForm} />
            <span className="error-span">{apiNameError} </span>
            <b>Image:</b>
            <input type="file" name="image" onChange={handleApiForm} accept="image/*" />
            <span className="error-span">{apiImageError} </span>
            <b>Report:</b>
            <input type="file" name="report" onChange={handleApiForm} accept="application/pdf"  />
            <span className="error-span">{apiReportError} </span>
            <button type="submit">Submit</button>
          </form>

        </div>
        <div className="users-card">
          
          <ul className="users-list">
            {users.map((user) => {
              return (
              <li key={user.name}>
                <img src={user.avatar} alt=" File" className="image-card" />
                <h3>{user.name}</h3>
              </li>)
            })}
          </ul>

          <ul className="docs-list">
            {docsList.map((doc) => {
              return (
                <li key={doc.name}>
                  {/* <p>{doc.name}</p> */}
                  <object
                    className="doc-card"
                    type="application/pdf"
                    data={doc.url}
                    width="100%"
                    height="80%"
                  >{doc.name}</object>
                  <a href={doc.url}>Download</a>
                </li>
              )
            })}
          </ul>

          <ul className="api-users-list">
            {apiUsers.map((user) => {
              return (
                <li key={user.id}>
                  <img src={user.image} alt="User Avatar" className="image-card" />
                  <h3 style={{ marginBottom: '10px' }}>{user.name}</h3> 
                  <object
                    className="doc-card"
                    type="application/pdf"
                    data={user.report}
                    width="100%"
                    height="80%"
                  >{user.name}</object>
                  <a href="#">Report Link</a>
                {/* <a href={user.report}>Report Link</a> */}
              </li>)
            })}
          </ul>

        </div>
      </div>
  )
}

export default App;