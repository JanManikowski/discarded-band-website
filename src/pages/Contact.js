import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { commonTitleStyle } from "../styles/constants";

const Contact = () => {
  const form = useRef();
  const [toast, setToast] = useState({ message: "", visible: false, success: false });

  const showToast = (message, success) => {
    setToast({ message, visible: true, success });
    setTimeout(() => setToast({ message: "", visible: false, success: false }), 3000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await emailjs.sendForm(
        "service_ci84krp",
        "template_s82aeo9",
        form.current,
        "Z4YIXFPmS1hcbXGWG"
      );

      showToast("Message sent successfully!", true);
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("Message sent, but confirmation email failed.", false);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "120px 20px",
      }}
    >
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x p-3 text-center rounded-2 ${
            toast.success ? "bg-success" : "bg-danger"
          } text-white`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}

      <h1 style={commonTitleStyle}>CONTACT US</h1>

      <form
        ref={form}
        onSubmit={sendEmail}
        className="p-4 rounded-3 shadow-lg w-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          maxWidth: "500px",
        }}
      >
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="user_email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          />
        </div>

        {/* Subject Dropdown */}
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <select
  name="subject"
  id="subject"
  className="form-select"
  style={{
    backgroundColor: "black", // A dark background color for the select dropdown
    color: "white", // Ensures the text inside is white
    border: "1px solid white",
    borderRadius: "0",
    padding: "10px",
    fontSize: "1rem",
    appearance: "none", // Removes native dropdown arrow for consistency in styling
    cursor: "pointer", // Ensures a pointer cursor for a clickable dropdown
  }}
  required
>
  <option value="" disabled selected>
    Select a subject
  </option>
  <option value="booking">Booking</option>
  <option value="merch">Merch</option>
  <option value="general">General</option>
</select>


        </div>

        {/* Message Field */}
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            fontWeight: "bold",
            color: "#ff4d4d",
            padding: "15px 20px",
            textTransform: "uppercase",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
