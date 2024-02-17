const isVideoOrImage = (file) => {
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
  
    if (videoExtensions.includes(fileExtension)) {
      return "video";
    } else if (imageExtensions.includes(fileExtension)) {
      return "image";
    } else {
      return "unknown";
    }
  };
  
  export default isVideoOrImage;
  