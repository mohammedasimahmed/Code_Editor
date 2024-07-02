import React, { useState } from "react";

interface SelectLanguageProps {
  lang: string;
  setLang: (lang: string) => void;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({ lang, setLang }) => {
  const [toggle, setToggle] = useState<boolean>(false);

  function chooseLang(choice: string) {
    setLang(choice);
    setToggle(!toggle);
  }

  return (
    <div className="relative w-36">
      <div
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-white w-36 cursor-pointer bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-sm p-2 text-center flex justify-between items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={() => setToggle(!toggle)}
      >
        <div>{lang}</div>
        <div>
          <svg
            className="w-2.5 h-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </div>
      </div>
      {toggle && (
        <div
          id="dropdown"
          className="z-50 absolute w-full bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200 w-full"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <button
                type="button"
                className="block text-left w-full px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => chooseLang("CPP")}
              >
                CPP
              </button>
            </li>
            <li>
              <button
                type="button"
                className="block text-left w-full px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => chooseLang("Javascript")}
              >
                Javascript
              </button>
            </li>
            <li>
              <button
                type="button"
                className="block text-left w-full px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => chooseLang("Python")}
              >
                Python
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectLanguage;
