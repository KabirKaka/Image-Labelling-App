import React, { Fragment, useState } from 'react'
import styles from "./OptionsForm.module.css"

function OptionsForm(props) {
    const [options, setOptions] = useState([])
    const [optionInputValue, setOptionInputValue] = useState("")

    const addOptionsHandler = (event) => {
        event.preventDefault()
        if(optionInputValue === ""){
            return
        }
        setOptions((prev) => (
            [...prev, optionInputValue]
        ))
        setOptionInputValue("")
    }

    const submitHandler = () => {
        localStorage.clear("options")
		localStorage.setItem("options", options)
        props.sendOptions(options)
    }


    return (
        <Fragment>
            <div className={styles.container}>
                <form onSubmit={addOptionsHandler} className={styles.optionsForm}>
                    <h2>Enter your labels</h2>
                    <input type="text" onChange={(e) => { setOptionInputValue(e.target.value) }} value={optionInputValue} className={styles.optionsInput} placeholder='Enter Option' />
                    <button type='submit' className={styles.btn} onClick={addOptionsHandler} >Add Label + </button>
                </form>
                <button onClick={submitHandler} disabled={options.length === 0} className={`${styles.btn} ${styles.submitBtn}`}>Proceed</button>
            </div>
        </Fragment>
    )
}

export default OptionsForm
