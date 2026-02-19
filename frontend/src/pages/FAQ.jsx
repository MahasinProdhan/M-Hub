import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to create an account to use M Hub?",
    answer:
      "No. All academic resources on M Hub are publicly accessible. Creating an account allows you to save materials and manage your profile.",
  },
  {
    question: "Are the study materials free to access?",
    answer:
      "Yes. All resources available on M Hub are completely free for students.",
  },
  {
    question: "Where are the PDFs and files stored?",
    answer:
      "The files are hosted using external storage services such as Google Drive and are accessed via secure links.",
  },
  {
    question: "Can I upload my own study materials?",
    answer:
      "Currently, content upload is managed by administrators only to maintain quality and accuracy of resources.",
  },
  {
    question: "How often is new content added?",
    answer:
      "New materials are added regularly based on availability and updates from different courses and semesters.",
  },
  {
    question: "Is M Hub an official MAKAUT platform?",
    answer:
      "No. M Hub is an independent academic support platform created to help students access resources more easily.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-10 container-page">
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-slate-600">
            Click on a question to view the answer.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-lg border transition ${
                  isOpen
                    ? "border-blue-500 bg-blue-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left transition hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="px-4 pb-4 text-sm leading-relaxed text-slate-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
