// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dh9hbjuqo',
  uploadPreset: 'ml_default',
  folder: 'RecycleSpecsEvents'
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', CLOUDINARY_CONFIG.folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    
    if (data.secure_url) {
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
