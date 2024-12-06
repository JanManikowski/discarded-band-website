import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import background from "../assets/background-low.png";

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
      className="d-flex flex-column align-items-center justify-content-center text-white py-5"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
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

      <h1 className="text-uppercase fs-4 mb-4">Contact</h1>
      <form
        ref={form}
        onSubmit={sendEmail}
        className="p-4 rounded-3 shadow-lg w-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          opacity: "0.8",
          maxWidth: "500px",
        }}
      >
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label text-light">
            Name:
          </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            className="form-control"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              opacity: "0.8",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="user_email" className="form-label text-light">
            Email:
          </label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="form-control"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              opacity: "0.8",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label text-light">
            Message:
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            className="form-control"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              opacity: "0.8",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-warning fw-bold"
          style={{
            color: "black",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
