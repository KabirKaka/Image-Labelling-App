import React, { useState } from "react";
import LabelImage from "./components/label/LabelImage";
import Home from "./components/Home";

function App() {
	const [error, setError] = useState(null);
	const [showHome, setShowHome] = useState(true);
	const [options, setOptions] = useState();
	const [unlabelledImageslength, setUnlabelledImages] = useState()

	const storeListinDB = async (formData) => {
		setError(null);
		try {
			const response = await fetch("http://localhost:8000/send-data", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				console.log("Data sent successfully.");
			}
		} catch (error) {
			console.error("Error sending data:", error);
			setError(error);
		}
	};

	const labelDataHandler = (data) => {
		storeListinDB(data);
	};

	const getOptionsFromUser = (options) => {
		setShowHome(false)
		setOptions(options)
	}

	const restart = () => {
		setShowHome(true)
	}

	const resumeLabelling = ()=>{
		if(options === undefined){
			setOptions(localStorage.getItem('options').split(','));
		}
		console.log(options)
		setShowHome(false)
	}

	const getImagesLength = (val) =>{
		setUnlabelledImages(val)
		console.log(val)
	}

	return (
		<React.Fragment>
			{showHome && <Home onLabel={labelDataHandler} sendOptions={getOptionsFromUser} resumeLabelling={resumeLabelling} imagesLength={unlabelledImageslength} />}
			{error && !showHome && (
				<p>
					Unable to Submit User Response!! <br />
					Error: {error}
					<button onClick={storeListinDB}>Try Again</button>
				</p>
			)}
			{!error && !showHome && <LabelImage onLabel={labelDataHandler} optionsList={options} restart={restart}  sendTotalImagesLength={getImagesLength} />}
		</React.Fragment>
	);
}

export default App;
