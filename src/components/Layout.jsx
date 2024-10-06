// Update your Layout component to pass the role
const Layout = ({ children, role }) => {
  return (
    <div>
      <Navbar role={role} /> {/* Pass the role prop to Navbar */}
      <div>{children}</div>
    </div>
  );
};
