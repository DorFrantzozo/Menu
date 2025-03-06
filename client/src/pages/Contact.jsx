import { PhoneIcon } from "@heroicons/react/24/outline";

import EmailIcon from "../components/icons/EmailIcon";

const Contact = () => {
  return (
    <div className=" " dir="rtl">
      <section className="relative z-10 overflow-hidden bg-black py-20 dark:bg-dark lg:py-[120px]">
        <div className="container p-20">
          <div className="-mx-4 flex flex-wrap lg:justify-between">
            <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
              <div className="mb-12 max-w-[570px] lg:mb-0">
                <span className="mb-4 block text-base font-semibold text-white">
                  צור קשר
                </span>
                <h2 className="mb-6 text-[32px] font-bold uppercase text-white  sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                  השאירו פרטים
                </h2>
                <p className="mb-9 text-base leading-relaxed text-body-color font-bold text-white">
                  השאירו פרטים לתיאום הדגמה ללא עלות
                </p>

                <div className="mb-8 flex w-full max-w-[370px]">
                  <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-white sm:h-[70px] sm:max-w-[70px]">
                    <PhoneIcon className="h-16 w-8" />
                  </div>
                  <div className="w-full">
                    <h4 className="mb-1 text-xl font-bold text-white ">
                      טלפון
                    </h4>
                    <p className="text-base text-body-color text-white">
                      053-4314774
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex w-full max-w-[370px]">
                  <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-white sm:h-[70px] sm:max-w-[70px]">
                    <EmailIcon className="h-16 w-8" />
                  </div>
                  <div className="w-full ">
                    <h4 className="mb-1 text-xl font-bold text-white ">מייל</h4>
                    <p className="text-base text-body-color text-white">
                      dorfrant@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="relative rounded-lg bg-white p-8 shadow-lg dark:bg-dark-2 sm:p-12">
                <form
                  action="https://formsubmit.co/dorfrant@gmail.com"
                  method="POST"
                >
                  <ContactInputBox
                    type="text"
                    name="name"
                    placeholder="שם"
                    required
                  />
                  <ContactInputBox
                    type="text"
                    name="email"
                    placeholder="מייל"
                    required
                  />
                  <ContactInputBox
                    type="text"
                    name="phone"
                    placeholder="טלפון"
                    required
                  />
                  <ContactTextArea
                    row="6"
                    placeholder="הודעה "
                    name="details"
                    defaultValue=""
                  />
                  <div>
                    <button
                      type="submit"
                      className="w-full rounded border border-primary bg-primary p-3 bg-black text-white transition hover:bg-opacity-90"
                    >
                      שלח
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

const ContactTextArea = ({ row, placeholder, name, defaultValue }) => {
  return (
    <>
      <div className="mb-6">
        <textarea
          rows={row}
          placeholder={placeholder}
          name={name}
          className="w-full resize-none rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-black dark:border-dark-3 dark:bg-dark dark:text-white"
          defaultValue={defaultValue}
          required
        />
      </div>
    </>
  );
};

const ContactInputBox = ({ type, placeholder, name }) => {
  return (
    <>
      <div className="mb-6">
        <input
          required
          type={type}
          placeholder={placeholder}
          name={name}
          className="w-full rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
        />
      </div>
    </>
  );
};
