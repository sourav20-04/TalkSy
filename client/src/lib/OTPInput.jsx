import React, { useRef, useState, useEffect } from "react";

/**
 * OTPInput
 * Props:
 *  - length (number) default 6
 *  - onComplete (otpString) called when all digits are filled
 *  - autoFocus (boolean) focus first input on mount
 */
const OTPInput = ({ length = 6, onComplete = () => {}, autoFocus = true }) => {
  const [values, setValues] = useState(() => Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) inputsRef.current[0].focus();
  }, [autoFocus]);

  useEffect(() => {
    const otp = values.join("");
    if (otp.length === length && !values.includes("")) {
      onComplete(otp);
    }
  }, [values, length, onComplete]);

  const handleChange = (e, idx) => {
    const raw = e.target.value;
    // keep only digits
    const digit = raw.replace(/\D/g, "").slice(0, 1);
    if (!digit) return; // nothing to set

    setValues((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });

    // move focus to next input
    const nextInput = inputsRef.current[idx + 1];
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  };

  const handleKeyDown = (e, idx) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      setValues((prev) => {
        const next = [...prev];
        if (next[idx]) {
          // clear current if it has value
          next[idx] = "";
          return next;
        } else if (idx > 0) {
          // move to previous and clear it
          next[idx - 1] = "";
          // focus previous
          setTimeout(() => {
            const prevInput = inputsRef.current[idx - 1];
            if (prevInput) {
              prevInput.focus();
              prevInput.select();
            }
          }, 0);
          return next;
        }
        return next;
      });
    } else if (key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1].focus();
    } else if (key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      inputsRef.current[idx + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;

    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < length; i++) {
        next[i] = paste[i] ?? next[i];
      }
      return next;
    });

   
    const idxToFocus = paste.length >= length ? length - 1 : paste.length;
    setTimeout(() => {
      const input = inputsRef.current[idxToFocus];
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  };

  return (
    <div className="flex gap-2 sm:gap-3 " onPaste={handlePaste}>
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          value={val}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          aria-label={`Digit ${idx + 1}`}
          className="
            w-8 h-8  sm:w-14 sm:h-14 
            [@media(min-width:371px)]:w-10
            [@media(min-width:371px)]:h-10
            [@media(max-width:271px)]:w-7
             [@media(max-width:271px)]:h-8

            text-center text-lg sm:text-2xl 
            bg-gray-100 placeholder-gray-400 
            rounded-lg border border-gray-300 
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
            transition
            "
        />
      ))}
    </div>
  );
};

export default OTPInput;