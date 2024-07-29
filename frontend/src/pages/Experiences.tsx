import useExperienceStore from "../stores/ExperienceStore";
import experienceLogo from "../assets/book.png";
const Experiences = () => {
  const { experiences } = useExperienceStore();
  return (
    <>
      <div className="p-6 md:p-10 md:ml-10">
        <div className="flex flex-row space-x-3 items-center mb-10 ">
          <img src={experienceLogo} alt="" className="w-16 h-14" />
          <h1 className="text-3xl font-bold ">Experiences</h1>
        </div>

        <ul className="timeline timeline-vertical  md:-ml-[55%] md:mr-[20%]">
          {experiences.map((experience, index) => (
            <li key={index}>
              <hr />
              <div className="timeline-start font-semibold">
                {experience.workTimeline}
              </div>
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box shadow-md my-2">
                <h1 className="font-bold text-xl">{experience.company}</h1>
                <h3 className="font-medium text-slate-600 text-md mb-2">
                  {experience.role}
                </h3>
                <p className="w-[65vw]">{experience.description}</p>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Experiences;
