import { useEffect, useState } from "react";



interface User {
  username: string;
  email: string;
}
function Home() {
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const userData = localStorage.getItem("user");
  console.log(userData);
  if (userData) setUser(JSON.parse(userData));
}, []);

  return (
    <div>
      
      {user ? (
        <h2>Xin chào, {user.username || user.email}</h2>
      ) : (
        <h2>Chào mừng bạn đến trang Home!</h2>
      )}
    </div>
  );
}

export default Home;
