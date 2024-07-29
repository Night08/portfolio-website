import WaveStyle from "./WaveStyle";
import laptop from "../assets/laptop.png";

import { forwardRef } from "react";

interface AboutProps {
  about: string;
}

const About = forwardRef<HTMLDivElement, AboutProps>(({ about }, ref) => {
  return (
    <>
      <div className="pt-8 relative">
        <img
          src={laptop}
          alt=""
          className="absolute left-0 -top-10 z-50 md:w-[300px] w-48"
        />
        <div className="overflow-hidden">
          {" "}
          <WaveStyle side={"right"} />{" "}
        </div>
      </div>

      <div
        id="about"
        className="bg-[#fa9f69] flex flex-row justify-between items-top p-6 md:p-6 pt-8 pb-12"
        ref={ref}
      >
        <div className=" text-white w-[70%] md:pt-12">
          <h1 className=" font-bold text-4xl  text-center  mb-4">
            About <span className="text-black"> Me </span>
          </h1>
          <p className="text-md">{about}</p>
        </div>
        <div className=" w-[30%]">
          <img
            src="/profile.jpg"
            width={800}
            height={800}
            alt="profle"
            className="rounded-full  "
          />
        </div>
      </div>
    </>
  );
});

export default About;
