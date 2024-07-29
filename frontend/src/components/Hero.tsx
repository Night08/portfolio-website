import homeImage from "../assets/homeImage.png";

interface ScrollButtonProps {
  onAboutClick: () => void;
  name: string;
  designation: string;
}

const Hero: React.FC<ScrollButtonProps> = ({
  onAboutClick,
  name,
  designation,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center mb-24">
        <div className="p-10 flex flex-col  items-center md:w-[40%]">
          <h6 className="text-sm font-medium">Hello, I'm</h6>
          <h2 className="text-3xl font-bold">{name}</h2>
          <h3 className="text-xl font-semibold text-slate-700">
            {designation}
          </h3>
          <div className="flex gap-2 mt-2">
            <a href={`/resume.pdf`} download="shubham_resume.pdf">
              <button className=" btn download-btn bg-black text-white py-2 px-4 hover:bg-slate-800 rounded-full text-sm">
                Download CV
              </button>
            </a>
            <a>
              <button
                className=" btn download-btn bg-[#fceee6] text-black font-semibold border-[1px] hover:border-[1px] border-black p-2 px-4 hover:bg-[#fcd0b6] rounded-full text-sm"
                onClick={onAboutClick}
              >
                About Me
              </button>
            </a>
          </div>
        </div>
        <div>
          <img src={homeImage} alt="" className="md:w-[60%] md:ml-24" />
        </div>
      </div>
    </>
  );
};

export default Hero;
