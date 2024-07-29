import SkillCard from "../components/SkillCard";
import skillLogo from "../assets/skill.png";

const Skills = () => {
  return (
    <div className="w-[90%] p-6">
      <div className="p-4 md:px-10">
        <div className="flex flex-row space-x-3 items-center mb-10 ">
          <img src={skillLogo} alt="" className="w-16 h-14" />
          <h1 className="text-3xl font-bold ">Skills</h1>
        </div>
        <div className="md:pl-20">
          <SkillCard />
        </div>
      </div>
    </div>
  );
};

export default Skills;
