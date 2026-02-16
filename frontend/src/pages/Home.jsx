import Sidebar from "../components/Sidebar";
import ActionCard from "../components/ActionCard";

const Home = () => {
  // TEMPORARY: frontend-only (assume logged in)
  const isLoggedIn = true;
  const userName = "Student";

  return (
    <div className="min-h-screen bg-appBg">
      {/* LOGGED OUT VIEW (optional for later) */}
      {!isLoggedIn && (
        <div className="py-16 container-page">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-semibold text-textPrimary">
              Welcome to M Hub
            </h1>
            <p className="mt-4 text-textSecondary">
              MAKAUT Hub is a centralized platform to access Previous Year
              Questions, study materials, and academic resources from all
              affiliated colleges.
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
            {/* Welcome Card */}
            <div className="p-6 card">
              <h2 className="text-xl font-semibold text-textPrimary">
                Welcome back, {userName} 👋
              </h2>
              <p className="mt-1 text-sm text-textSecondary">
                Quickly find PYQs and study materials for your semester.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
              <ActionCard
                title="Previous Year Questions"
                description="Browse semester-wise PYQs"
                link="/pyqs"
              />

              <ActionCard
                title="Study Materials"
                description="Notes, PDFs, and syllabus"
                link="/materials"
              />

              <ActionCard
                title="Colleges"
                description="Explore college resources"
                link="/colleges"
              />

              <ActionCard
                title="Profile"
                description="View and manage your account"
                link="/profile"
              />
            </div>

            {/* Recently Added Section */}
            <section className="mt-12">
              <h3 className="mb-4 text-lg font-semibold text-textPrimary">
                Recently Added
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-4 card">
                  <p className="font-medium text-textPrimary">
                    Operating System – PYQ (2023)
                  </p>
                  <p className="text-sm text-textSecondary">
                    Semester 4 · BTech CSE
                  </p>
                </div>

                <div className="p-4 card">
                  <p className="font-medium text-textPrimary">
                    DBMS Notes – Unit Wise
                  </p>
                  <p className="text-sm text-textSecondary">Semester 3 · BCA</p>
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
