import useSkillStore from "../stores/SkillStore";

import javaImg from "../assets/icons/java.png";
import cplusImg from "../assets/icons/cplus.png";
import csharpImg from "../assets/icons/csharp.png";
import dockerImg from "../assets/icons/docker.png";
import gitImg from "../assets/icons/git.png";
import javascriptImg from "../assets/icons/javascript.png";
import linuxImg from "../assets/icons/linux.png";

import mysqlImg from "../assets/icons/mysql.png";
import mongodbImg from "../assets/icons/mongodb.png";
import nextjsImg from "../assets/icons/nextjs.png";
import pythonImg from "../assets/icons/python.png";
import reactImg from "../assets/icons/react.png";
import typescriptImg from "../assets/icons/typescript.png";

interface IconOption {
  value: string;
  label: string;
  imgSrc: string;
}

const iconOptions: IconOption[] = [
  { value: "typescriptImg", label: "Typescript", imgSrc: typescriptImg },
  { value: "reactImg", label: "React.js", imgSrc: reactImg },
  { value: "pythonImg", label: "Python", imgSrc: pythonImg },
  { value: "nextjsImg", label: "Next.Js", imgSrc: nextjsImg },
  { value: "mongodbImg", label: "MongoDB", imgSrc: mongodbImg },
  { value: "mysqlImg", label: "MySQL", imgSrc: mysqlImg },
  { value: "linuxImg", label: "Linux", imgSrc: linuxImg },
  { value: "javascriptImg", label: "Javascript", imgSrc: javascriptImg },
  { value: "gitImg", label: "Git", imgSrc: gitImg },
  { value: "dockerImg", label: "Docker", imgSrc: dockerImg },
  { value: "csharpImg", label: "C#", imgSrc: csharpImg },
  { value: "cplusImg", label: "C++", imgSrc: cplusImg },
  { value: "javaImg", label: "Java", imgSrc: javaImg },
];

const SkillCard = () => {
  const { skills } = useSkillStore();
  const totalStars = 5;

  return (
    <>
      {skills.map((skill, index) => (
        <div key={index} className="m-2 md:m-6">
          <div className="flex flex-col space-x-1 items-start justify-center w-[100%] bg-white p-4 pl-20 relative rounded-r-full">
            <div className="bg-[#fdceb2] p-4  rounded-full flex items-center justify-center absolute -left-8">
              <img
                src={
                  iconOptions.find((icon) => icon.value === skill.icon)?.imgSrc
                }
                alt="logo"
                className="w-12 h-12 rounded-lg hover:-translate-y-2 transition-all"
              />
            </div>
            <h2 className="font-semibold text-2xl "> {skill.title} </h2>
            <div>
              {/* // stars  */}
              <div className="rating space-x-2">
                {[...Array(totalStars)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`rating-${index + 1}`}
                    className={`mask mask-star ${
                      index < skill.star ? "bg-black" : "bg-slate-300"
                    } h-6 cursor-default`}
                    readOnly
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkillCard;
