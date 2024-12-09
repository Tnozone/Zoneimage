import imglyRemoveBackground from "@imgly/background-removal";

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const blob = await imglyRemoveBackground(file);
    const url = URL.createObjectURL(blob);
    setImage(url);
  }