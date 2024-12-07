import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/signIn")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const fldata = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch(
        "https://api-ticketmanagement.onrender.com/v1.0/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fldata),
        }
      );

      const data = await response.json();
      const statuscodes = response.status;
      switch (statuscodes) {
        case 200:
          if (data.data) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            localStorage.setItem("accessToken", data.data.token);
            localStorage.setItem("user_id", data.data.user_id);
            navigate({ to: "/dashboard" });
          } else {
            alert("login completed but not the accesstoken fetched");
          }
          break;
        case 422:
          alert("server was unable to proccess the request");
          break;
        case 401:
          alert("Unauthorized accessing. Please check your credentials.");
          break;
        case 408:
          alert("your requst was timeout");
          break;
        case 400:
          alert("Invalid email or password");
          break;

        case 500:
          alert("Server error. Please try again later.");
          break;
        case 405:
          alert("you need correct method");
          break;
        default:
          alert(`Unexpected erroring: ${statuscodes}`);
          break;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("some unexpected error pls try again");
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
