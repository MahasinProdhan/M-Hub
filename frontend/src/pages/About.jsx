const About = () => {
  return (
    <div className="py-10 container-page">
      <div className="max-w-3xl space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">About M Hub</h1>
          <p className="mt-2 text-slate-600">
            A centralized academic platform for MAKAUT students.
          </p>
        </div>

        {/* What is M Hub */}
        <section>
          <h2 className="text-lg font-medium text-slate-900">What is M Hub?</h2>
          <p className="mt-2 leading-relaxed text-slate-600">
            M Hub (MAKAUT Hub) is an academic resource platform designed to help
            students of MAKAUT-affiliated colleges easily access essential study
            materials. It brings together Previous Year Questions (PYQs), study
            materials, organizers, and semester-wise syllabus in one organized
            place.
          </p>
        </section>

        {/* Why M Hub */}
        <section>
          <h2 className="text-lg font-medium text-slate-900">Why M Hub?</h2>
          <ul className="pl-5 mt-2 space-y-2 list-disc text-slate-600">
            <li>Academic resources are scattered across multiple platforms</li>
            <li>
              Students spend unnecessary time searching for reliable content
            </li>
            <li>No single platform offers structured, filterable materials</li>
          </ul>
          <p className="mt-3 text-slate-600">
            M Hub solves this problem by providing clean organization, smart
            filtering, and quick access to academic resources.
          </p>
        </section>

        {/* Who is it for */}
        <section>
          <h2 className="text-lg font-medium text-slate-900">
            Who is M Hub for?
          </h2>
          <ul className="pl-5 mt-2 space-y-2 list-disc text-slate-600">
            <li>MAKAUT students (BTech, BCA, BSc, BA, etc.)</li>
            <li>Students preparing for semester examinations</li>
            <li>Anyone looking for organized academic resources</li>
          </ul>
        </section>

        {/* Note */}
        <div className="p-4 text-sm border-l-4 border-blue-500 bg-blue-50 text-slate-700">
          This platform is currently under active development. More features and
          improvements will be added over time.
        </div>
      </div>
    </div>
  );
};

export default About;
