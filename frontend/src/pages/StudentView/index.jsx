import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import UserBanner from "./UserBanner";
import useStudent from "../../hooks/useStudent";
import UpdateStudentDetailsForm from "./UpdateStudentDetailsForm";
import StudentFaceDataContainer from "./StudentFaceDataContainer";
import StudentIdContainer from "./StudentIdContainer";
import DeleteStudentContainer from "./DeleteStudentContainer";

const StudentView = () => {
  const { id } = useParams();
  const {
    selectedStudent,
    studentFaceData,
    loading,
    error,
    fetchStudentById,
    getFaceDataByStudentId,
  } = useStudent();

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
      getFaceDataByStudentId(id);
    }
  }, [id]);

  // Shared layout for loading/error states
  const renderLayout = (content) => (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Students", href: "/students" },
              { label: selectedStudent?.name || "View Student" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto">{content}</div>
      </main>
    </div>
  );

  if (error) {
    return renderLayout(
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!selectedStudent) {
    return renderLayout(
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  return renderLayout(
    <>
      <UserBanner student={selectedStudent} />
      <StudentIdContainer student={selectedStudent} />
      <UpdateStudentDetailsForm student={selectedStudent} />
      <StudentFaceDataContainer
        student={selectedStudent}
        faceData={studentFaceData}
        loading={loading}
      />
      <DeleteStudentContainer student={selectedStudent} />
    </>
  );
};

export default StudentView;
