import React from 'react'

function FromContact() {
    return (
        <>
            <input label="Name" placeholder="Enter your name"  />
            <input label="Email" placeholder="Enter your email" type="email"  />
            <input label="Phone number" placeholder="Enter your number" type="tel"  />
            <textarea label="Message" placeholder="Enter your message"   />
            <button >
                Send Message
            </button>
        </>
    )
}

export default FromContact