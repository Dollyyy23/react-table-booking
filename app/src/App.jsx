import { useState } from "react";
import "./App.css";

const TOTAL_SEATS = 20; // Set total restaurant capacity

function App() {
  const [reservations, setReservations] = useState([]);
  const [seatsLeft, setSeatsLeft] = useState(TOTAL_SEATS);
  const [form, setForm] = useState({ name: "", phone: "", guests: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guests = parseInt(form.guests, 10);

    if (!form.name || !form.phone || !form.guests) {
      alert("Please fill out all fields.");
      return;
    }

    if (guests > seatsLeft) {
      alert("Not enough seats available!");
      return;
    }

    if (reservations.some((r) => r.name === form.name)) {
      alert("Duplicate name detected! Please use a unique name.");
      return;
    }

    const newReservation = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      guests,
      checkInTime: new Date().toLocaleTimeString(),
      checkOutTime: null,
    };

    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guests);
    setForm({ name: "", phone: "", guests: "" });
  };

  const handleCheckout = (id) => {
    setReservations(
      reservations.map((r) =>
        r.id === id ? { ...r, checkOutTime: new Date().toLocaleTimeString() } : r
      )
    );
  };

  const handleDelete = (id) => {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    const updatedSeats = reservation.checkOutTime
      ? seatsLeft
      : seatsLeft + reservation.guests;

    setReservations(reservations.filter((r) => r.id !== id));
    setSeatsLeft(updatedSeats);
  };

  return (
    <div className="container">
      <h1>Restaurant Reservation System</h1>
      <h2>Seats Left: {seatsLeft} / {TOTAL_SEATS}</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <input type="number" name="guests" placeholder="Guests" value={form.guests} onChange={handleChange} />
        <button type="submit">Reserve Table</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Check-in Time</th>
            <th>Checkout Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.phone}</td>
              <td>{r.checkInTime}</td>
              <td>{r.checkOutTime || "Not Checked Out"}</td>
              <td>
                {!r.checkOutTime && (
                  <button className="checkout" onClick={() => handleCheckout(r.id)}>Checkout</button>
                )}
                <button className="delete" onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
