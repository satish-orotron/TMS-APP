import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
export const Route = createFileRoute("/getspecifiuser")({
  component: RouteComponent,
});
function RouteComponent() {
  const [id, setId] = useState("");

  const [queryid, setQueryid] = useState(null);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  if (!token) {
    alert(
      "no access token found in the localstorage. so please login to view the tickets data"
    );
    navigate({ to: "/signIn" });
  }
  const fetchTickets = async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${queryid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      //`https://api-ticketmanagement.onrender.com/v1.0/tickets?page=1&limit=10`
    );

    if (!res.ok) {
      throw new Error("failed to fetch the tickets data");
    }
    return await res.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tickets", queryid],
    queryFn: () => fetchTickets(queryid),
  });

  const handleSearch = () => {
    if (id.trim()) {
      setQueryid(id);
    } else {
      alert("enter a valid ticket id");
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>specific user ticket</h1>
      <div>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></input>
        <button onClick={handleSearch}>Search</button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error:{error.message}</p>
      ) : (
        <>
          <table border="4" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>

                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status || "not ads"}</td>
                  <td>{ticket.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
