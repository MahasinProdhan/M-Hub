const Help = () => {
  return (
    <div className="py-12 container-page">
      <div className="max-w-4xl space-y-12">
        {/* Hero */}
        <section className="px-6 py-8 border rounded-xl border-slate-200 bg-slate-50">
          <h1 className="text-3xl font-semibold text-slate-900">
            Help & Support
          </h1>
          <p className="max-w-2xl mt-3 text-slate-600">
            This guide will help you understand how to use M Hub efficiently and
            get the most out of the platform.
          </p>
        </section>

        {/* Getting Started */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium text-slate-900">
            Getting Started
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-white border rounded-lg border-slate-200">
              <p className="font-medium text-slate-900">Apply Filters</p>
              <p className="mt-1 text-sm text-slate-600">
                Use the filters on the left to select your course, semester, and
                subject for more accurate results.
              </p>
            </div>

            <div className="p-4 bg-white border rounded-lg border-slate-200">
              <p className="font-medium text-slate-900">Browse Resources</p>
              <p className="mt-1 text-sm text-slate-600">
                Explore Previous Year Questions, study materials, organizers,
                and syllabus based on your selection.
              </p>
            </div>

            <div className="p-4 bg-white border rounded-lg border-slate-200">
              <p className="font-medium text-slate-900">Open or Download</p>
              <p className="mt-1 text-sm text-slate-600">
                Open PDFs or documents using the provided links for viewing or
                downloading.
              </p>
            </div>

            <div className="p-4 bg-white border rounded-lg border-slate-200">
              <p className="font-medium text-slate-900">Quick Navigation</p>
              <p className="mt-1 text-sm text-slate-600">
                Use the Home page cards to quickly jump to different academic
                sections.
              </p>
            </div>
          </div>
        </section>

        {/* Saved Materials */}
        <section className="space-y-3">
          <h2 className="text-xl font-medium text-slate-900">
            Saved Materials
          </h2>
          <p className="leading-relaxed text-slate-600">
            You can save useful academic resources for quick access later. Click
            the save (❤️) icon on any resource card to add it to your saved
            materials.
          </p>
          <p className="leading-relaxed text-slate-600">
            All saved items can be accessed from the sidebar under
            <span className="font-medium"> Saved Materials</span>.
          </p>
        </section>

        {/* Profile & Account */}
        <section className="space-y-3">
          <h2 className="text-xl font-medium text-slate-900">
            Profile & Account
          </h2>
          <p className="leading-relaxed text-slate-600">
            Logged-in users can manage their profile information, including
            updating their name, academic details, and profile picture from the
            Profile page.
          </p>
        </section>

        {/* Support Note */}
        <section className="p-5 border-l-4 border-blue-500 rounded-lg bg-blue-50">
          <p className="text-sm text-slate-700">
            If you face any issues or notice incorrect academic content, please
            contact the administrator. Your feedback helps improve the platform.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Help;
