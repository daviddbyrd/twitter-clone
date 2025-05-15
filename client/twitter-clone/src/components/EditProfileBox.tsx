import { useState } from "react";
import { SubmitProfileChangeParams } from "../views/MainPage";
import { AiOutlineCamera, AiOutlineClose } from "react-icons/ai";

interface EditProfileBoxProps {
  close: () => void;
  id: string;
  displayName: string;
  description: string;
  profilePicURL: string;
  backgroundPicURL: string;
  submitProfileChange: (params: SubmitProfileChangeParams) => Promise<void>;
}

interface ProfileInfoModel {
  displayName: string;
  description: string;
  newProfilePic: File | null;
  newBackgroundPic: File | null;
}

const EditProfileBox = ({
  close,
  id,
  displayName,
  description,
  profilePicURL,
  backgroundPicURL,
  submitProfileChange,
}: EditProfileBoxProps) => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfoModel>({
    displayName: displayName,
    description: description,
    newProfilePic: null,
    newBackgroundPic: null,
  });
  console.log("profile url: ", profilePicURL);
  console.log("background url: ", backgroundPicURL);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, type } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;

      setProfileInfo((prev) => ({ ...prev, [name]: file }));
    } else {
      const value = e.target.value;
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      submitProfileChange({
        id: id,
        displayName: profileInfo.displayName,
        description: profileInfo.description,
        profilePicture: profileInfo.newProfilePic,
        backgroundPicture: profileInfo.newBackgroundPic,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen z-10">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative h-160 w-150 rounded-xl bg-white flex flex-col items-center justify-start overflow-y-auto">
        <div className="flex flex-col h-full w-full items-center relative">
          <div className="flex flex-row w-150 h-16 items-center justify-start absolute top-0 left-0 ">
            <button onClick={close} className="w-10 h-15 cursor-pointer ml-5">
              <AiOutlineClose size={20} />
            </button>
            <div className="font-bold text-lg ml-5">Edit profile</div>
            <button
              className="text-white bg-black rounded-full h-10 w-20 cursor-pointer font-bold text-md ml-auto mr-5"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          <div className="w-full h-40 relative mt-15 px-3">
            <div className="w-full h-full relative z-10">
              <div className="flex items-center justify-center absolute w-full h-full z-20">
                <div className="h-14 w-14 rounded-full bg-black opacity-50 flex items-center justify-center relative hover:bg-gray-500">
                  <AiOutlineCamera
                    size={30}
                    className="absolute z-0 text-white"
                  />
                  <input
                    className="absolute h-15 w-15 rounded-full opacity-0 cursor-pointer z-10"
                    type="file"
                    name="backgroundPicture"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <img
                className="w-full h-full object-cover cursor-pointer z-10"
                src={backgroundPicURL || "images/defaultBackground.png"}
              />
            </div>
            <div className="rounded-full w-36 h-36 flex items-center justify-center absolute left-12 bottom-0 transform translate-y-1/2 absolute z-20">
              <div className="flex items-center justify-center absolute w-full h-full z-20">
                <div className="h-12 w-12 rounded-full bg-black opacity-50 flex items-center justify-center relative hover:bg-gray-500">
                  <AiOutlineCamera
                    size={30}
                    className="absolute z-0 text-white"
                  />
                  <input
                    className="absolute h-12 w-12 rounded-full opacity-0 cursor-pointer"
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>

              <div className="absolute w-full h-full bg-gray-400 opacity-20 z-10 rounded-full border-4 border-white"></div>
              <img
                src={profilePicURL || "images/default.jpg"}
                alt="Profile picture"
                className="rounded-full w-36 h-36 border-4 border-white"
              />
            </div>
          </div>
          <div className="w-full px-5 mt-24 h-14">
            <div className="relative w-full h-full">
              <input
                id="displayName"
                className="peer w-full h-full border border-gray-300 rounded-sm px-3 pb-2 pt-5 placeholder-transparent focus:outline-none focus:border-blue-500"
                name="displayName"
                placeholder="Name"
                value={profileInfo.displayName}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="displayName"
                className="pointer-events-none absolute left-3 top-3 transform -translate-y-1/2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Name
              </label>
            </div>
          </div>
          <div className="w-full px-5 mt-8 h-40">
            <div className="relative w-full h-full">
              <textarea
                id="description"
                className="peer w-full h-full border border-gray-300 rounded-sm px-3 pb-2 pt-5 placeholder-transparent focus:outline-none focus:border-blue-500 resize-none"
                name="description"
                placeholder="description"
                value={profileInfo.description}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="description"
                className="pointer-events-none absolute left-3 top-3 text-gray-400 transform -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-focus:top-3 peer-focus:text-xs peer-focus:text-sky-500"
              >
                Bio
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileBox;
