import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ProfilePictureUploaderProps {
  userId: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  userId,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    formData.append("userId", userId); // if your backend expects this

    try {
      setUploading(true);
      setError(null);

      const response = await axios.post(
        "/api/users/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onUploadSuccess) {
        onUploadSuccess(response.data.imageUrl); // optional callback
      }

      alert("Profile picture updated!");
    } catch (err: any) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen">
      <div className="absolute inset-0 bg-black opacity-70 z-50"></div>
      <div className="relative z-1id h-160 w-150 rounded-xl bg-white flex flex-col items-center justify-start overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
