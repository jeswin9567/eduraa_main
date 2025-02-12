export const TeacherProtectedRoute = ({ children }) => {
  // Your authentication logic here
  const isTeacher = true; // Replace with actual auth check
  
  if (!isTeacher) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export const StudentProtectedRoute = ({ children }) => {
  // Your authentication logic here
  const isStudent = true; // Replace with actual auth check
  
  if (!isStudent) {
    return <Navigate to="/login" />;
  }
  
  return children;
}; 