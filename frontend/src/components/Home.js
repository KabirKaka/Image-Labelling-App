import React, { Fragment, useState } from 'react'
import styles from "./Home.module.css"
import OptionsForm from './OptionsForm'

function Home(props) {
    const [files, setFiles] = useState([])
    const [showOptionsForm, setShowHomeOptionsForm] = useState(false)

    const storeImages = async (formData) => {

        await fetch("http://localhost:8000/restart", {
            method: "POST"
        });

        try {
            await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData
            })
            console.log("Images Successfully Uploaded")
            setShowHomeOptionsForm(true)
        }
        catch (error) {
            console.log(error)
        }
    }

    const fileInputChangeHandler = (event) => {
        setFiles(Array.from(event.target.files))
    }

    const submitHandler = (event) => {
        event.preventDefault()
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        storeImages(formData)
    }
    const inputLabelText = files.length === 0 ? "Upload Images" : `${files.length} images uploaded`
    return (
        <div className={styles.home}>
            {!showOptionsForm &&
                <Fragment>
                    <h1>Welcome to Image Labelling App</h1>
                    <form onSubmit={submitHandler}>
                        <input id="file" className={styles["file-input"]} type='file' multiple accept='.png , .jpg , .jpeg' onChange={fileInputChangeHandler} />
                        <label htmlFor="file">{inputLabelText}</label>

                        <button className={styles.btn} disabled={files.length === 0} type='submit'>Upload</button>
                    </form>
                    <div className={styles.orDiv}>
                        <hr className={styles.line} />
                        <span>OR</span>
                        <hr className={styles.line} />
                    </div>
                    <button className={styles.btn} disabled={props.imagesLength === 0} onClick={props.resumeLabelling}>Resume Labelling</button>
                </Fragment>
            }
            {showOptionsForm && <OptionsForm sendOptions={props.sendOptions} />}
        </div>
    )
}

export default Home
