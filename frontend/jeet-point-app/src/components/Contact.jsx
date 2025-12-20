import { useState } from "react";
import emailjs from "@emailjs/browser";


function Contact() {
   const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [pop, setPop] = useState("");
  function handleSubmit(event){
        event.preventDefault();
        let data={name, email, msg};

        emailjs.send("service_tuycojb", "template_n8o15uq", data, "7pyJRXFQ8-18SA-Ip")
        .then(()=>{
            setName("");
            setEmail("");
            setMsg("");
            setPop("Message Sent Successfully!");
            setTimeout(() =>setPop(""), 3000);
            alert("Message Sent Successfully!");
        })
        .catch((e)=>console.log(e));
    }
  return (
    <section id="contact" className="py-12 sm:py-20 bg-cover bg-center bg-no-repeat">
      
      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl backdrop-blur-md bg-white/10 border border-white/100 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">Have a Question? We’re Here to Help!</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-md font-medium text-black">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            value={email}
              required
              className="w-full p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-md font-medium text-black">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            value={name}
              required
              className="w-full p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-md font-medium text-black">
              Your Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message..."
              onChange={(e) => setMsg(e.target.value)}
            value={msg}
              className="w-full p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
