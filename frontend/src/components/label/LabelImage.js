import React, { useCallback, useEffect, useState } from "react";
import styles from "./LabelImage.module.css";
import ImageOptions from "../label/ImageOptions";
import Loader from "../../UI/Loader";
import Success from "./Success";

const LabelImage = ({ onLabel, optionsList, restart, sendTotalImagesLength }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [currentImagePath, setCurrentImagePath] = useState();
	const [allImagesPaths, setAllImagesPaths] = useState([]);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [isImageFetchLoading, setIsImageFetchLoading] = useState(true);



	const fetchImages = async () => {
		const response = await fetch("http://localhost:8000/images/");
		if (!response.ok) {
			setError(response.status);
		}
		const data = await response.json();
		setAllImagesPaths(data.images);
	};


	// fetch a set of images names from the server once when starting application
	useEffect(() => {
		fetchImages()
	}, [])

	const fetchImage = useCallback(async () => {
		try {
			const response = await fetch(
				`http://localhost:8000/images/${allImagesPaths[currentImageIndex]}`
			);
			const data = await response.blob();
			setIsImageFetchLoading(false);
			setCurrentImagePath(URL.createObjectURL(data));
			setError(null)
		}
		catch (error) {
			setError(error);
		}
	}, [allImagesPaths, currentImageIndex]);

	// get one by one image from server
	useEffect(() => {
		const identfier = setTimeout(() => {
			fetchImage();
		}, 500);

		return () => {
			clearTimeout(identfier);
		};
	}, [currentImageIndex, allImagesPaths, fetchImage]);

	const labelSubmitHandler = (imageLabels) => {
		setIsImageFetchLoading(true);
		const userData = { image: allImagesPaths[currentImageIndex], selected: imageLabels, options: optionsList }
		onLabel(userData);
		console.log()
		sendTotalImagesLength(allImagesPaths.length - (currentImageIndex + 1))
		if (currentImageIndex < allImagesPaths.length - 1) {
			setCurrentImageIndex((prevIndex) => {
				return prevIndex + 1;
			});
		}
		if (currentImageIndex === allImagesPaths.length - 1) {
			setSuccess(true);
		}
		setCurrentImagePath(allImagesPaths[currentImageIndex]);
	};

	return (
		<React.Fragment>
			{error && !success && (
				<div className={styles.errorDiv}>
					<p >
						Images not found <br /> ErrorCode: {error}
					</p>
					<button onClick={fetchImages} className={styles.btn}>Try Again</button>
				</div>
			)}
			{isImageFetchLoading && !success && <Loader />}
			{!isImageFetchLoading && !error && !success && (
				<div className={styles["label-container"]}>
					<div className={styles["image-container"]}>
						<img
							id="eye-img"
							src={currentImagePath}
							alt="Not found!!"
							className={styles.image}
						/>
					</div>
					<div className={styles["options-container"]}>
						<ImageOptions onLabelProceed={labelSubmitHandler} optionsList={optionsList} />
					</div>
				</div>
			)}

			{success && <Success restart={restart} />}
		</React.Fragment>
	);
};

export default LabelImage;
