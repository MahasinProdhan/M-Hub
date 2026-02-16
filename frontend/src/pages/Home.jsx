import Sidebar from "../components/Sidebar";
import ActionCard from "../components/ActionCard";

const Home = () => {
  // TEMPORARY: frontend-only
  const isLoggedIn = true;
  const userName = "Student";

  return (
    <div className="min-h-screen bg-appBg">
      {/* LOGGED OUT VIEW */}
      {!isLoggedIn && (
        <div className="py-16 container-page">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-semibold text-textPrimary">
              Welcome to M Hub
            </h1>
            <p className="mt-4 text-textSecondary">
              A centralized platform to access PYQs, study materials,
              organizers, and syllabus under MAKAUT.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <a
                href="/login"
                className="px-6 py-3 text-sm font-medium text-white rounded-lg bg-primary"
              >
                Login to Continue
              </a>

              <a
                href="/"
                className="px-6 py-3 text-sm font-medium border rounded-lg border-borderLight text-textPrimary"
              >
                Explore as Guest
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LOGGED IN VIEW */}
      {isLoggedIn && (
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-8">
            {/* Welcome / Hero */}
            <div className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-white border-borderLight">
              <h2 className="text-2xl font-semibold text-textPrimary">
                Welcome back, {userName} 👋
              </h2>
              <p className="max-w-xl mt-2 text-sm text-textSecondary">
                Quickly access academic resources like PYQs, study materials,
                organizers, and syllabus for your semester.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
              <ActionCard
                title="Previous Year Questions"
                description="Browse semester-wise question papers"
                link="/pyqs"
              />

              <ActionCard
                title="Study Materials"
                description="Notes, PDFs, and reference materials"
                link="/materials"
              />

              <ActionCard
                title="Organizers"
                description="Model questions and compiled resources"
                link="/organizers"
              />

              <ActionCard
                title="Syllabus"
                description="View semester-wise syllabus"
                link="/syllabus"
              />
            </div>

            {/* Recently Added */}
            <section className="mt-14">
              <h3 className="mb-4 text-lg font-semibold text-textPrimary">
                Recently Added
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex gap-3 p-4 card">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium text-textPrimary">
                      Operating System – PYQ (2023)
                    </p>
                    <p className="text-sm text-textSecondary">
                      Semester 4 · BTech CSE
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 card">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium text-textPrimary">
                      DBMS Notes – Unit Wise
                    </p>
                    <p className="text-sm text-textSecondary">
                      Semester 3 · BCA
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </div>
  );
};

export default Home;
