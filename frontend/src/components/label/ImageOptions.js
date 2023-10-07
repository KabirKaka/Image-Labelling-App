import React, { useState } from "react";
import styles from "./ImageOptions.module.css";

const ImageOptions = (props) => {
	const [error,setError] = useState(false)
	console.log(props.optionsList)

	const formSubmitHandler = (event) => {
		setError(false)
		const labelsList = [];
		event.preventDefault();
		props.optionsList.forEach((option) => {
			const inputLabel = document.getElementById(option);
			if (inputLabel.checked) {
				labelsList.push(inputLabel.value);
			}
		});
		if(labelsList.length === 0){
			setError(true)
            return
		}
		props.onLabelProceed(labelsList);
	};

	return (
		<form onSubmit={formSubmitHandler}>
			<h2>Label The Image</h2>
			<div className={styles["labelImage-options"]}>
				{props.optionsList.map((option) => {
					return (
						<div key={Math.random()} >
							<label htmlFor={option}>
								<input id={option} type="checkbox" value={option} />
								{option}
							</label>
						</div>
					);
				})}
			</div>
			{error && <p className={styles.errText}>Please select atleast one option</p>}
			<button
				className={styles.btn}
				type="submit"
			>
				Proceed
			</button>
		</form>
	);
};

export default ImageOptions;
