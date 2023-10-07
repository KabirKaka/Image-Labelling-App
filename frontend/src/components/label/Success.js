import React, { useState, useEffect } from 'react'
import styles from "./Success.module.css"
import successImage from "../../assets/success.jpg";

function Success(props) {
    const [fileURL, setFileURL] = useState()
    const downloadFile = async () => {
        try {
            const response = await fetch("http://localhost:8000/downloadable");
            const data = await response.blob();
            setFileURL(URL.createObjectURL(data));
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        downloadFile()
    }, [])

    return (
        <div className={styles["success-message"]}>
            <h1 className={styles.message}>Labelling completed successfully!</h1>
            <img
                src={successImage}
                alt="Celebration"
                className={styles["celebration-image"]}
            />

            <a href={fileURL} download="results.csv">
                <button className={styles.btn}>Download CSV File</button>
            </a>
            <button className={styles.btn} onClick={props.restart}>Restart New Labelling</button>
        </div>
    )
}

export default Success;
