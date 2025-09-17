import React, { useState } from "react";
import { Languages, Copy, LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [form, setForm] = useState({
    text: "",
    lang: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const translateNow = async (e) => {
    e.preventDefault(); // prevents the form reload on submit
    if (form.lang === "" || form.lang === "Choose language") {
      toast.error("Please choose a language");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Translate into ${form.lang} (Translate as it is no any other data like hint description or any symbol) - ${form.text}`,
              },
            ],
          },
        ],
      };

      const options = {
        headers: {
          "X-goog-api-key": API_KEY,
        },
      };

      const { data } = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        payload,
        options
      );
      const answer = data.candidates[0].content.parts[0].text;
      setResult(answer);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Content copied");
  };

  const handleChange = (e) => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen py-16">
      <div className="w-10/12 grid grid-cols-2 gap-12 mx-auto">
        <div className="p-8 bg-slate-800 border-2 border-slate-700 rounded-xl">
          <h1 className="mb-6 text-4xl font-bold text-amber-500">Translator</h1>
          <form className="space-y-6" onSubmit={translateNow}>
            <textarea
              name="text"
              placeholder="Enter text to translate"
              onChange={handleChange}
              required
              className="p-3 text-white bg-slate-900 w-full rounded-xl focus:outline-none focus:border-2 focus:border-amber-500 placeholder-amber-50"
              rows={5}
            ></textarea>
            <select
              name="lang"
              required
              onChange={handleChange}
              className="p-3 text-white bg-slate-900 w-full rounded-xl focus:outline-none focus:border-2 focus:border-amber-500"
            >
              <option>Choose language</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="japanese">Japanese</option>
              <option value="chinese">Chinese</option>
            </select>

            {loading ? (
              <button
                disabled
                className="flex items-center gap-1 bg-gray-300 rounded-lg text-white py-3 px-6 font-medium focus:scale-90 duration-100"
              >
                <LoaderCircle className="animate-spin" />
                Loading...
              </button>
            ) : (
              <button className="flex items-center gap-1 bg-amber-500 rounded-lg text-white py-3 px-6 font-medium focus:scale-90 duration-100">
                <Languages />
                Translate
              </button>
            )}
          </form>
        </div>
        <div className="relative p-8 bg-slate-800 border-2 border-slate-700 rounded-xl">
          <p className="mt-5 text-white">{result}</p>
          <Copy
            className="absolute top-5 right-5 text-white hover:scale-105 duration-300"
            onClick={copy}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
