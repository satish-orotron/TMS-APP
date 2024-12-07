import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/updateticket/$ticket-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "ticket-id": ticketId } = Route.useParams();
  console.log(ticketId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  if (!token) {
    alert(
      "No access token found in the local storage. Please log in to view the ticket data."
    );
    navigate({ to: "/signIn" });
    return null;
  }

  const fetchTickets = useCallback(async () => {
    const res = await fetch(
      `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch the ticket data");
    }
    return await res.json();
  }, [ticketId, token]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tickets", ticketId],
    queryFn: fetchTickets,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
      setPriority(data.data.priority);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api-ticketmanagement.onrender.com/v1.0/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, priority }),
        }
      );

      if (response.ok) {
        alert("Ticket updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Update the Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <br />
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <br />
          <br />
          <button type="submit">Update Ticket</button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(RouteComponent);
