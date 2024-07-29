import contactImg from "../assets/contactusbg.png";
import instagramImg from "../assets/instagram.png";
import githubImg from "../assets/github.png";
import facebookImg from "../assets/facebook.png";
import xImg from "../assets/x.png";
import linkedinImg from "../assets/linkedin.png";
import contactLogo from "../assets/phone.png";

const Contact = () => {
  return (
    <>
      <div className="p-6 md:p-8">
        {/* contact section  */}
        <div className="flex flex-row space-x-0 items-center mb-10 ml-6 md:ml-16">
          <img src={contactLogo} alt="" className="w-16 h-14" />
          <h2 className="text-3xl font-bold">Contact Me</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center space-x-12 space-y-6">
          <div className="py-4 flex flex-col justify-center sm:py-12  md:w-1/2">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbd2ba] to-[#ffbb93] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-2xl font-semibold text-center">
                      Send Me a Message
                    </h1>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="relative">
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                          placeholder="Subject"
                        />
                        <label
                          htmlFor="subject"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Subject
                        </label>
                      </div>

                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          className="peer pt-2 textarea-lg textarea-ghost placeholder-transparent h-24 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                          placeholder="Password"
                        ></textarea>
                        <label
                          htmlFor="password"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Message
                        </label>
                      </div>

                      <div className="relative">
                        <button className="btn btn-primary text-white rounded-full mt-4">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img src={contactImg} alt="contactImg" className="w-1/2 md:pl-6" />
        </div>

        {/* // social and contact info secion  */}

        <div className="mt-12">
          <h2 className="font-bold text-2xl ml-6 md:ml-16 flex mb-4">
            Reach me at
          </h2>
          <div
            id="contactBox"
            className="border shadow-lg rounded-full min-w-[70%] ml-8 mr-8 md:ml-12 md:mr-12 bg-white flex flex-row
   px-4"
          >
            <div className="flex flex-col p-8 w-1/3 justify-center items-center">
              <h3 className="font-semibold text-lg text-black"> Address</h3>
              <p className="font-medium text-slate-600 text-base">xyw</p>

              {/* divider */}
            </div>

            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-8 w-1/3 justify-center items-center">
              <h3 className="font-semibold text-lg text-black">
                {" "}
                Phone Number
              </h3>
              <p className="font-medium text-slate-600 text-base">849476122</p>

              {/* divider */}
            </div>

            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-8 w-1/3 justify-center items-center">
              <h3 className="font-semibold text-lg text-black">
                {" "}
                Email Address
              </h3>
              <p className="font-medium text-slate-600  text-base">
                shubham@email.com
              </p>

              {/* divider */}
            </div>
          </div>
        </div>

        {/* socials  */}
        <div className="mt-12">
          <h2 className="font-bold text-2xl ml-6 md:ml-16 flex mb-4">
            Socials
          </h2>
          <div
            id="contactBox"
            className="border shadow-lg rounded-full min-w-[70%] ml-8 mr-8 md:ml-12 md:mr-12 bg-white flex flex-row
   p-4"
          >
            <div className="flex flex-col p-4 w-1/5 justify-center items-center cursor-pointer ">
              <img src={instagramImg} alt="insta" className="w-12" />
              <p className="font-medium text-slate-700 text-base hover:underline">
                Instagram
              </p>
            </div>
            {/* divider */}
            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-4 w-1/5 justify-center items-center cursor-pointer">
              <img src={githubImg} alt="github" className="w-12" />
              <p className="font-medium text-slate-700 text-base hover:underline">
                Github
              </p>
            </div>

            {/* divider */}
            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-4 w-1/5 justify-center items-center cursor-pointer">
              <img src={facebookImg} alt="facebook" className="w-16" />
              <p className="font-medium text-slate-700 text-base hover:underline">
                Facebook
              </p>
            </div>

            {/* divider */}
            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-4 w-1/5 justify-center items-center cursor-pointer">
              <img src={xImg} alt="x.com" className="w-12" />
              <p className="font-medium text-slate-700 text-base hover:underline">
                X.com
              </p>
            </div>

            {/* divider */}
            <div className="divider md:divider-horizontal"></div>

            <div className="flex flex-col p-4 w-1/5 justify-center items-center cursor-pointer">
              <img src={linkedinImg} alt="linkedin" className="w-12" />
              <p className="font-medium text-slate-700 text-base hover:underline">
                Linkedin
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
